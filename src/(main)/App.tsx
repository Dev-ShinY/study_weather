import "../styles/App.css";
import React from "react";
import clsx from "clsx";
import Header from "./components/header";
import TodayWeather from "./components/today-weather";
import PieChart from "./components/pie-chart";

function App() {
  return (
    <div className={clsx("bg-gray-50", "min-h-screen", "p-5")}>
      <Header />
      <TodayWeather />
      <PieChart />
    </div>
  );
}

export default App;
