import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MakePool from "./pages/MakePool";
import { Chart as ChartJS } from "chart.js/auto";
import QuestionView from "./pages/QuestionView";
import PoolDetail from "./pages/PoolDetail";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/make-pool" element={<MakePool />} />
          <Route path="/pool-question/:qId" element={<QuestionView />} />
          <Route path="/get-detail/:id" element={<PoolDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
