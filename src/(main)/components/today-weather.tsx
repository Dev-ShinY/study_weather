import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { getSunTime } from "../../api/getSunTime"; // sun rise, sun set
import { getShortWeather } from "../../api/getShortWeather"; // weather forecast

export default function TodayWeather() {
  // sun time
  type SunTime = [string, string];
  let [sunTime, setSunTime] = useState<SunTime>(["0", "0"]);

  // now time
  let nowTime: number = parseInt(
    new Date().toTimeString().slice(0, 5).replace(":", "")
  );

  // images file
  const weatherImages = [
    require("../../images/weather/rain.png"),
    require("../../images/weather/rain-snow.png"),
    require("../../images/weather/snow.png"),
    require("../../images/weather/sometimes-rain.png"),
    "",
    require("../../images/weather/sometimes-rain-snow.png"),
    require("../../images/weather/sometimes-snow.png"),
    require("../../images/weather/clear-day.png"),
    require("../../images/weather/clear-night.png"),
    require("../../images/weather/cloudy-day.png"),
    require("../../images/weather/cloudy-night.png"),
    require("../../images/weather/cloud.png"),
  ];

  const [weatherCode, setWeatherCode] = useState<number>(0);

  // 출몰시간
  const fetchSunTime = async () => {
    try {
      const { sunrise, sunset } = await getSunTime();
      setSunTime([sunrise, sunset]);
    } catch (error) {
      console.log("Error fetching sun time:", error);
    }
  };

  // 날씨
  const fetchShortWeather = async () => {
    const fcstTime = String((new Date().getHours() + 1) * 100);

    try {
      const res = await getShortWeather();
      const ptyCode = res.find(
        (item) => item.fcstTime === fcstTime && item.category === "PTY"
      )?.fcstValue;
      const skyCode = res.find(
        (item) => item.fcstTime === fcstTime && item.category === "SKY"
      )?.fcstValue;
      if (ptyCode !== "0") {
        setWeatherCode(parseInt(String(ptyCode)) - 1);
      } else {
        switch (skyCode) {
          case "1":
            parseInt(sunTime[0]) < nowTime && nowTime < parseInt(sunTime[1])
              ? setWeatherCode(8)
              : setWeatherCode(7);
            break;
          case "3":
            parseInt(sunTime[0]) < nowTime && nowTime < parseInt(sunTime[1])
              ? setWeatherCode(10)
              : setWeatherCode(9);
            break;

          case "4":
            setWeatherCode(11);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log("Error fetching short weather:", error);
    }
  };

  useEffect(() => {
    fetchSunTime();
    fetchShortWeather();
  }, []);

  return (
    <div className={clsx("p-5", "flex", "flex-col", "items-center")}>
      <div
        className={clsx(
          "rounded-full",
          parseInt(sunTime[0]) < nowTime && nowTime < parseInt(sunTime[1])
            ? "bg-blue-300"
            : "bg-blue-900",
          "w-60",
          "h-60",
          "border-8",
          "border-white",
          "shadow-lg",
          "flex",
          "justify-center",
          "items-center"
        )}
      >
        <img src={weatherImages[weatherCode]} alt="weatherImages" />
      </div>

      <div className={clsx("mt-10")}></div>
    </div>
  );
}
