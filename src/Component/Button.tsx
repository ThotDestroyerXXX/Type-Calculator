import { action } from "./Calculator";
import "../css/Calculator.css";

// interface for button properties, including className and digit
interface ButtonsProps {
  dispatch: React.Dispatch<any>;
  digit: string;
  className: string;
}

//returns button and dispatch type (DigitNum action) and payload (digit) when button is clicked
const Buttons: React.FC<ButtonsProps> = ({ dispatch, digit, className }) => {
  return (
    <button
      className={className}
      onClick={() => dispatch({ type: action.DigitNum, payload: { digit } })}
    >
      {digit}
    </button>
  );
};

export default Buttons;
