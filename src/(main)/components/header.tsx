import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import locationImage from "../../images/location.png";
import { getGeoLoc } from "../../api/getGeoLoc";
import { getAddress } from "../../api/getAddress";

export default function Header() {
  const [loc, setLoc] = useState([0, 0]);
  const [address, setAddress] = useState<string[]>([
    "대전광역시",
    "유성구",
    "상대동",
  ]); // dummy data
  let temp = 0;
  let low = 0;
  let high = 0;

  // 위도, 경도
  const fetchLoc = useCallback(async () => {
    try {
      const res = await getGeoLoc();
      setLoc(res);
      setAddress(await getAddress(loc[0], loc[1]));
    } catch (error) {
      setLoc([37.5796, 126.977]);
    }
  }, []);

  useEffect(() => {
    fetchLoc();
  }, [fetchLoc]);

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
              onClick={fetchLoc}
            />
          </p>
          <p className={clsx("font-bold")}>
            {address ? address.join(" ") : "Null"}
          </p>
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
