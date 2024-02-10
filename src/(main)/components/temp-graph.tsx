import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getTempGraphData } from "../../api/getShortWeather";

export default function TempGraph() {
  const [graphData, setGraphData] = useState<WeatherItem[]>();

  const fetchAirInfo = async () => {
    try {
      const graphData = await getTempGraphData();
      setGraphData(graphData);
    } catch (error) {
      console.log("Error fetching air info", error);
    }
  };

  useEffect(() => {
    fetchAirInfo();
  }, []);

  interface LineChartProps {
    data: object;
  }

  const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        const myLineChart = new Chart(ctx, {
          type: "line",
          data: {
            datasets: [
              {
                data: data,
                backgroundColor: [`#7eecff`],
                borderColor: [`#98f0ff`],
              },
            ],
          },
          options: {
            parsing: {
              xAxisKey: "fcstTime",
              yAxisKey: "fcstValue",
            },
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  maxTicksLimit: 20,
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
        return () => {
          myLineChart.destroy();
        };
      }
    }, [graphData]);

    return <canvas ref={chartRef} width={"1920px"} height={"300px"}></canvas>;
  };

  return (
    <>
      <div
        className={clsx(
          "p-5",
          "bg-white",
          "border-y",
          "border-gray-200",
          "mt-10",
          "w-screen",
          "-mx-5",
          "text-center",
          "font-bold",
          "text-xl"
        )}
      >
        <p>시간대별 날씨</p>
      </div>
      <div
        className={clsx(
          "px-5",
          "py-10",
          "bg-white",
          "border-y",
          "border-gray-200",
          "mt-5",
          "w-screen",
          "-mx-5",
          "overflow-x-scroll"
        )}
      >
        <div
          className={clsx(
            "w-[1920px]",
            "h-[300px]",
            "overflow-x-auto",
            "m-auto"
          )}
        >
          {graphData && <LineChart data={graphData} />}
        </div>
      </div>
    </>
  );
}
