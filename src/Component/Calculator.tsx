import React, { useReducer, useState } from "react";
import "../css/Calculator.css";
import Buttons from "./Button";
import Operates from "./Operates";
import { useNavigate } from "react-router-dom";

//What action would like to perform
export const action = {
  DigitNum: "Digitnum",
  clearDigit: "Clear",
  deletes: "Deleted",
  Operations: "Operate",
  Answers: "Displayanswer",
};

//data type for Operand One, Operand Two, ... , histories
interface State {
  OperandOne: string;
  OperandTwo: string;
  Operation: string;
  overwrite?: boolean;
  histories: string[]; // Updated to be an array of strings
  setHistories: React.Dispatch<React.SetStateAction<string[]>>;
}

//data type for type and payload in reducer function
interface Action {
  type: string;
  payload: {
    digit: string;
    operateButton: string;
  };
}

function reducer(state: State, { type, payload }: Action): State {
  //select case for action (add digit, operation, delete one digit, clear calculator, answer)
  switch (type) {
    //case add digit
    case action.DigitNum:
      if (payload.digit && state.OperandTwo === "0") {
        return {
          ...state,
          OperandTwo: payload.digit,
        };
      }
      //if we want to add digit but there is already an answer on the result screen, it resets and adds digit
      if (state.overwrite) {
        return {
          ...state,
          OperandTwo: payload.digit,
          overwrite: false,
        };
      }
      //else, add digit to screen
      return {
        ...state,
        OperandTwo: `${state.OperandTwo || ""}${payload.digit}`,
      };

    //case Operation
    case action.Operations:
      // if there is no digit in the screen, then Operation button cannot be clicked
      if (state.OperandOne === "" && state.OperandTwo === "") {
        return state;
      }
      // if operand one is present but not operand two, then display operation to screen
      if (state.OperandTwo === "") {
        return {
          ...state,
          Operation: payload.operateButton,
        };
      }

      // if there is no operand one, then add operation to screen, operand two become the new operand one, operand two is set to 0, and overwrite is false
      if (state.OperandOne === "") {
        return {
          ...state,
          Operation: payload.operateButton,
          OperandOne: state.OperandTwo,
          OperandTwo: "",
          overwrite: false,
        };
      }
      // else if there is operand one, operand two, and operation, then calculate the operands. Then, assign in to operand one. after that, display operation and operand two becomes ""
      return {
        ...state,
        OperandOne: Answer(state),
        Operation: payload.operateButton,
        OperandTwo: "",
      };

    // case for clearing screen
    case action.clearDigit:
      //straightforward clearing, but operand two becomes zero and displayed on screen
      return {
        ...state,
        OperandOne: "",
        OperandTwo: "0",
        Operation: "",
      };

    // case for "=" button
    case action.Answers:
      // if there is nothing on the screen, then the "=" button will not be functioning
      if (
        state.Operation === "" ||
        state.OperandOne === "" ||
        state.OperandTwo === ""
      ) {
        return state;
      }

      // else, calculate the operands. Then, assign it to operand two and display it on screen
      return {
        ...state,
        overwrite: true,
        OperandOne: "",
        Operation: "",
        OperandTwo: Answer(state),
      };

    // case for delete digit
    case action.deletes:
      // if answer of calculation is on screen, then instead of deleting one digit, it clears the screen so that we can do new calculation
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          OperandTwo: state.Operation ? state.Operation.slice(0, -1) : "0",
        };
      }
      // if there is operand one and the operand two is 0 (example : 3+0), then delete the 0 (example : 3+0 to 3+)
      if (state.OperandOne !== "" && state.OperandTwo === "0") {
        return {
          ...state,
          OperandTwo: state.OperandTwo.slice(0, -1),
        };
      }
      // if what is displaying on screen is only "0", then the delete button won't work
      if (state.OperandTwo === "0") {
        return state;
      }
      // if there is operand one but not operand two (example : 3+), then operand one becomes operand two, operation is set to "", and operand one is set to "" (example : 3+ to 3)
      if (state.OperandOne !== "" && state.OperandTwo === "") {
        return {
          ...state,
          OperandTwo: state.OperandOne,
          Operation: "",
          OperandOne: "",
        };
      }

      // if there is operand one and operand two, then delete one digit
      if (state.OperandTwo !== "" && state.OperandOne !== "") {
        return {
          ...state,
          OperandTwo: state.OperandTwo.slice(0, -1),
        };
      }

      // if one digit is deleted from operand two and operand two becomes "" (example : 2 becomes ""), then operand two becomes 0 and displayed on screen (example : 2 becomes "0")
      if (state.OperandTwo.slice(0, -1) === "") {
        return {
          ...state,
          OperandTwo: "0",
        };
      }
      // else delete one digit
      return {
        ...state,
        OperandTwo: state.OperandTwo.slice(0, -1),
      };

    default:
      return state;
  }
}
// function Answer is called when we want to do consecutive operation or the "Answers" action meets the requirement
function Answer({
  OperandOne,
  OperandTwo,
  Operation,
  histories,
  setHistories,
}: State) {
  // convert string to number from operand one and operand two
  const one = parseFloat(OperandOne);
  const two = parseFloat(OperandTwo);

  // if operand one or two is not a number, then return error
  if (isNaN(one) || isNaN(two)) {
    return "Err";
  }

  //variable calculate to store calculation, then select case for each operation
  let calculate: string = "";
  switch (Operation) {
    case "+":
      calculate = String(one + two);
      break;
    case "-":
      calculate = String(one - two);
      break;
    case "X":
      calculate = String(one * two);
      break;
    case "/": {
      // if division by zero or operand two is not a number, then display error on screen
      if (two === 0 || isNaN(two)) {
        return "Err";
      }
      let temp = one / two;
      temp = Number(temp.toFixed(3));
      calculate = String(temp);
      break;
    }
  }
  //set calculate to histories array and display it on screen
  setHistories((prevHistories) => [...prevHistories, calculate]);
  return calculate;
}

// main function
export function Calculator() {
  //set array of histories to display on screen. Initialize the array to ""
  const [histories, setHistories] = useState([""]);

  // set the initial state of each variable
  const initialState = {
    OperandOne: "",
    OperandTwo: "0",
    Operation: "",
    histories: histories,
    setHistories: setHistories,
  };

  // usereducer function
  const [{ OperandOne, OperandTwo, Operation }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // navigate to different page
  const nav = useNavigate();
  return (
    <div className='container-calculator'>
      <div className='wrapper'>
        <div className='resultScreen'>
          <div className='history'>
            <div className='history-inside'>
              {histories.map((history, index) => (
                <div key={index}>{history}</div>
              ))}
            </div>
          </div>
          <div className='answercalc'>
            {OperandOne}
            {Operation}
            {OperandTwo}
          </div>
        </div>
        <div className='BoxButton'>
          <button
            className='lightgraybut'
            onClick={() =>
              dispatch({
                type: action.clearDigit,
                payload: {
                  digit: "",
                  operateButton: "",
                },
              })
            }
          >
            C
          </button>
          <button
            className='lightgraybut'
            id='del-but'
            onClick={() =>
              dispatch({
                type: action.deletes,
                payload: {
                  digit: "",
                  operateButton: "",
                },
              })
            }
          >
            DEL
          </button>
          <button
            className='brownbut'
            onClick={() => {
              nav("/Complain");
            }}
          >
            ?
          </button>
          <Operates
            className='yellowbut'
            operateButton='/'
            dispatch={dispatch}
          />
          <Buttons className='lightgraybut' digit='1' dispatch={dispatch} />
          <Buttons className='lightgraybut' digit='2' dispatch={dispatch} />
          <Buttons className='lightgraybut' digit='3' dispatch={dispatch} />
          <Operates
            className='yellowbut'
            operateButton='X'
            dispatch={dispatch}
          />
          <Buttons className='lightgraybut' digit='4' dispatch={dispatch} />
          <Buttons className='lightgraybut' digit='5' dispatch={dispatch} />
          <Buttons className='lightgraybut' digit='6' dispatch={dispatch} />
          <Operates
            className='yellowbut'
            operateButton='+'
            dispatch={dispatch}
          />
          <Buttons className='lightgraybut' digit='7' dispatch={dispatch} />
          <Buttons className='lightgraybut' digit='8' dispatch={dispatch} />
          <Buttons className='lightgraybut' digit='9' dispatch={dispatch} />
          <Operates
            className='yellowbut'
            operateButton='-'
            dispatch={dispatch}
          />
          <Buttons className='lightgraybutzero' digit='0' dispatch={dispatch} />
          <button
            className='yellowbut-equal'
            id='equal'
            onClick={() =>
              dispatch({
                type: action.Answers,
                payload: {
                  digit: "",
                  operateButton: "",
                },
              })
            }
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
