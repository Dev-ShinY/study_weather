import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import locationImage from "../../images/location.png";
import { getGeoLoc } from "../../api/getGeoLoc";
import { getAddress } from "../../api/getAddress";
import { getTemp } from "../../api/getShortWeather";

export default function Header() {
  const [loc, setLoc] = useState([0, 0]);
  const [address, setAddress] = useState<string[]>(["", "", ""]);
  const [temp, setTemp] = useState<number[]>([]);

  // 위도, 경도
  const fetchLoc = useCallback(async () => {
    try {
      const res = await getGeoLoc();
      setLoc(res);
      const addressData = await getAddress(res[0], res[1]);
      setAddress(addressData);
    } catch (error) {
      setLoc([37.5796, 126.977]);
      setAddress(["대전광역시", "유성구", "상대동"]);
    }
  }, []);

  const fetchTemp = useCallback(async () => {
    try {
      const res = await getTemp();
      setTemp(res);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchLoc();
    fetchTemp();
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
              {temp[0]}
            </span>
            {/* 최고온도 */}
            <span className={clsx("text-red-600", "font-semibold", "text-lg")}>
              {temp[1]}
            </span>
          </div>
          {/* 현재온도 */}
          <div className={clsx("font-semibold", "text-5xl")}>{temp[2]}°</div>
        </div>
      </div>
    </div>
  );
}
