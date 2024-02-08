import "../styles/App.css";
import React from "react";
import clsx from "clsx";
import Header from "./components/header";
import TodayWeather from "./components/today-weather";

function App() {
  return (
    <div className={clsx("bg-gray-50", "min-h-screen", "p-5")}>
      <Header />
      <TodayWeather />
    </div>
  );
}

export default App;
