import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { getPieData } from "../../api/getShortWeather";
import Chart from "chart.js/auto";

export default function PieChart() {
  const [pieObj, setPieObj] = useState<{
    stationName: string;
    data: number[];
  }>();

  const fetchAirInfo = async () => {
    try {
      const pieObj = await getPieData();
      setPieObj(pieObj);
    } catch (error) {
      console.log("Error fetching air info", error);
    }
  };

  useEffect(() => {
    fetchAirInfo();
  }, []);

  interface DonutChartProps {
    value: number;
    step: number[];
  }

  const DonutChart: React.FC<DonutChartProps> = ({ value, step }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        const total = step[2];
        const data = [value, total - value];

        const stepColor = [
          "56, 199, 255",
          "54, 247, 80",
          "250, 240, 55",
          "255, 99, 132",
        ];

        const stepIndex = step.findIndex((step) => value <= step);
        const myDonutChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: data,
                backgroundColor: [
                  `rgb(${stepColor[stepIndex]})`,
                  `rgba(${stepColor[stepIndex]}, 0.2)`,
                ],
              },
            ],
          },
          options: {
            cutout: "80%",
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
          },
        });
        return () => {
          myDonutChart.destroy();
        };
      }
    }, [value]);

    return <canvas ref={chartRef}></canvas>;
  };

  return (
    <div>
      <div
        className={clsx(
          "mt-10",
          "flex",
          "justify-center",
          "w-full",
          "justify-between"
        )}
      >
        {pieObj &&
          [
            { title: "초미세먼지(PM2.5)", unit: "㎍/m³", step: [15, 35, 75] },
            { title: "미세먼지(PM10)", unit: "㎍/m³", step: [30, 80, 150] },
            { title: "오존(O3)", unit: "ppm", step: [0.03, 0.09, 0.15] },
          ].map((item, index) => {
            return (
              <div
                className={clsx(
                  "px-5",
                  "py-10",
                  "bg-white",
                  "rounded-2xl",
                  "border",
                  "border-gray-200",
                  "w-[30%]",
                  "h-60",
                  "flex",
                  "flex-col",
                  "justify-start",
                  "items-center"
                )}
                key={index}
              >
                {pieObj.data[index] && (
                  <>
                    <DonutChart value={pieObj?.data[index]} step={item.step} />
                    <div>
                      <p className={clsx("text-center", "font-bold")}>
                        {pieObj?.data[index] + item.unit}
                      </p>
                      <p className={clsx("p-1", "text-center")}>{item.title}</p>
                    </div>
                  </>
                )}
                {!pieObj.data[index] && "Null"}
              </div>
            );
          })}
      </div>
    </div>
  );
}
