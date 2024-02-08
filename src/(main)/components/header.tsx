import clsx from "clsx";
import React, { useEffect, useState } from "react";
import locationImage from "../../images/location.png";

export default function Header() {
  const [loc, setLoc] = useState(null);
  let temp = 0;
  let low = 0;
  let high = 0;

  return (
    <div
      className={clsx(
        "p-5",
        "text-left",
        "bg-white",
        "rounded-2xl",
        "border",
        "border-gray-200"
      )}
    >
      <div className={clsx("flex", "justify-between")}>
        {/* 위치 */}
        <div>
          <p className={clsx("flex", "items-center")}>
            <span className={clsx("mr-2")}>현재 위치</span>
            <img
              src={locationImage}
              alt="위치 탐색"
              className={clsx("object-cover", "h-5", "cursor-pointer")}
            />
          </p>
          <p className={clsx("font-bold")}>{loc ? loc : "Null"}</p>
        </div>

        {/* 기온 */}
        <div className={clsx("flex", "justify-center", "items-center")}>
          <div className={clsx("flex", "flex-col", "mr-4")}>
            {/* 최저온도 */}
            <span className={clsx("text-blue-600", "font-semibold", "text-lg")}>
              {temp}
            </span>
            {/* 최고온도 */}
            <span className={clsx("text-red-600", "font-semibold", "text-lg")}>
              {low}
            </span>
          </div>
          {/* 현재온도 */}
          <div className={clsx("font-semibold", "text-5xl")}>{high}°</div>
        </div>
      </div>
    </div>
  );
}
