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
    { image: require("../../images/weather/rain.png"), title: "비가 내려요" },
    {
      image: require("../../images/weather/rain-snow.png"),
      title: "비와 눈이 내려요",
    },
    { image: require("../../images/weather/snow.png"), title: "눈이 내려요" },
    {
      image: require("../../images/weather/sometimes-rain.png"),
      title: "빗방울이 내려요",
    },
    { image: "dummy", title: "dummy" },
    {
      image: require("../../images/weather/sometimes-rain-snow.png"),
      title: "빗방울과 눈날림이 있어요",
    },
    {
      image: require("../../images/weather/sometimes-snow.png"),
      title: "눈날림이 있어요",
    },
    {
      image: require("../../images/weather/clear-day.png"),
      title: "맑은 날이에요",
    },
    {
      image: require("../../images/weather/clear-night.png"),
      title: "맑은 밤이에요",
    },
    {
      image: require("../../images/weather/cloudy-day.png"),
      title: "구름이 많이 낀 날이에요",
    },
    {
      image: require("../../images/weather/cloudy-night.png"),
      title: "구름이 많이 낀 밤이에요",
    },
    {
      image: require("../../images/weather/cloud.png"),
      title: "전체적으로 흐려요",
    },
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
              ? setWeatherCode(7)
              : setWeatherCode(8);
            break;
          case "3":
            parseInt(sunTime[0]) < nowTime && nowTime < parseInt(sunTime[1])
              ? setWeatherCode(9)
              : setWeatherCode(10);
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
    <div
      className={clsx(
        "p-5",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "relative"
      )}
    >
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
        <img src={weatherImages[weatherCode].image} alt="weatherImages" />

        <div className={clsx("absolute", "right-10")}>
          <div
            className={clsx(
              "font-thin",
              "text-sm",
              "rounded-full",
              "px-5",
              "py-3",
              "mb-5",
              "shadow-sm"
            )}
            style={{ background: "rgba(255, 255, 255, 0.9)" }}
          >
            오늘 일출 시간
            <div className={clsx("text-right")}>
              {sunTime[0].slice(0, 2) + "시 " + sunTime[1].slice(2) + "분"}
            </div>
          </div>
          <div
            className={clsx(
              "font-thin",
              "text-sm",
              "rounded-full",
              "px-5",
              "py-3",
              "shadow-sm"
            )}
            style={{ background: "rgba(255, 255, 255, 0.9)" }}
          >
            오늘 일몰 시간
            <div className={clsx("text-right")}>
              {sunTime[1].slice(0, 2) + "시 " + sunTime[1].slice(2) + "분"}
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx("mt-5", "text-gray-400", "tracking-wider", "text-xl")}
      >
        {"현재 날씨는 " + weatherImages[weatherCode].title}
      </div>
    </div>
  );
}
