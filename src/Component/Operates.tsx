import { action } from "./Calculator";
import "../css/Calculator.css";

// interface for operation, including classname
interface OperatesProps {
  dispatch: React.Dispatch<any>;
  operateButton: string;
  className: string;
}

// returns operation button. When clicked, dispatch operations action and operateButton payload
const Operates: React.FC<OperatesProps> = ({
  dispatch,
  operateButton,
  className,
}) => {
  return (
    <button
      className={className}
      onClick={() =>
        dispatch({ type: action.Operations, payload: { operateButton } })
      }
    >
      {operateButton}
    </button>
  );
};

export default Operates;
