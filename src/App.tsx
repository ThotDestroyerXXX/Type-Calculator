import "./App.css";
import { Calculator } from "./Component/Calculator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComplainPage from "./Component/ComplainPage";

// function app returns route path and default path
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/Complain" element={<ComplainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
