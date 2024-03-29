import axios from "axios";
import proj4 from "proj4";
import { getGeoLoc } from "./getGeoLoc";

// api
const apiUrl: string | undefined = process.env.REACT_APP_SHORT_WEATHER_API_URL;
const apiKey: string | undefined = process.env.REACT_APP_SHORT_WEATHER_API_KEY;

// Params
const numOfRows = "1000";
const pageNo = "1";
const baseDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const baseTime = `${String(new Date().getHours()).padStart(2, "0")}${String(
  (Math.floor(new Date().getMinutes() / 30) - 1) * 30
).padStart(2, "0")}`;
const dataType = "JSON";
let nx = "38";
let ny = "127";

getGeoLoc()
  .then((location) => {
    nx = String(location[0]).split(".")[0]; // api 소수점까지 요청 시, 응답 거부
    ny = String(location[1]).split(".")[0];
  })
  .catch((error) => {
    console.error("위치 정보를 가져오는 동안 오류가 발생했습니다:", error);
  });

// url
const generateApiUrl = (): string => {
  if (!apiUrl || !apiKey) {
    throw new Error("API URL or API Key is not defined");
  }
  const queryParams = new URLSearchParams({
    numOfRows,
    pageNo,
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
    dataType,
  });
  return `${apiUrl}/getUltraSrtFcst?serviceKey=${apiKey}&${queryParams.toString()}`;
};

// req
export const getShortWeather = async (
  retryCount: number = 0
): Promise<WeatherItem[]> => {
  try {
    const url = generateApiUrl();
    const response = await axios.get(url);
    return response.data.response.body.items.item;
  } catch (error) {
    console.error("Error fetching short weather:", error);

    // Re-req
    if (retryCount < 3) {
      console.log("Retrying...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return getShortWeather(retryCount + 1);
    } else {
      throw new Error("Maximum retry count exceeded.");
    }
  }
};

// req temp (최저, 최고, 현재 기온 리턴)
export const getTemp = async () => {
  if (!apiUrl || !apiKey) {
    throw new Error("API URL or API Key is not defined");
  }
  const queryParams = new URLSearchParams({
    numOfRows,
    pageNo,
    base_date: baseDate,
    base_time: "0200", // 최고/최저기온의 발표시간별 저장되는 예보자료 시간 : 0200
    nx,
    ny,
    dataType,
  });

  // 측정 시간
  try {
    const url = `${apiUrl}/getVilageFcst?serviceKey=${apiKey}&${queryParams.toString()}`;
    const response = await axios.get(url);
    const data = response.data.response.body.items.item.filter(
      (item: { fcstTime: string; fcstDate: string; category: string }) =>
        (item.category === "TMN" && item.fcstDate === baseDate) ||
        (item.category === "TMX" && item.fcstDate === baseDate)
    );

    const tmp = response.data.response.body.items.item.filter(
      (item: { category: string; fcstDate: string }) =>
        item.category === "TMP" && item.fcstDate === baseDate
    );

    data.push(tmp[0]);

    return data.map((item: { fcstValue: string }) => item.fcstValue);
  } catch (error) {}
};

export const getPieData = async () => {
  const apiUrl = process.env.REACT_APP_AIR_API_URL;
  const apiKey = process.env.REACT_APP_AIR_API_KEY;
  const queryParams = new URLSearchParams({
    numOfRows: "100",
    pageNo: "1",
    dataTerm: "DAILY",
    returnType: "json",
    ver: "1.0",
  });
  const stationName = await getAirInfo();
  try {
    const url = `${apiUrl}/getMsrstnAcctoRltmMesureDnsty?serviceKey=${apiKey}&${queryParams.toString()}&stationName=${stationName}`;
    const response = await axios.get(url);
    const { pm10Value, pm25Value, o3Value } =
      response.data.response.body.items[0];
    const pieObj: { stationName: string; data: number[] } = {
      stationName: stationName as string,
      data: [pm25Value, pm10Value, o3Value],
    };
    return pieObj;
  } catch (error) {
    console.error("Error fetching short weather:", error);
  }
};

// 가장 가까운 공기 측정소 정보
export const getAirInfo = () => {
  const apiUrl = process.env.REACT_APP_AIR_STATION_API_URL;
  const apiKey = process.env.REACT_APP_AIR_STATION_API_KEY;

  return new Promise(async (resolve, reject) => {
    if ("geolocation" in navigator) {
      try {
        const tmCoordinates = await getTMCoordinates();
        const url = `${apiUrl}/getNearbyMsrstnList?serviceKey=${apiKey}&returnType=json&tmX=${tmCoordinates[0]}&tmY=${tmCoordinates[1]}`;
        const response = await axios.get(url);
        const stationName = response.data.response.body.items[0].stationName;
        resolve(stationName);
      } catch (error) {
        console.error("Error:", error);
        reject(error);
      }
    }
  });
};

// [lat, lon] to TM cood
const getTMCoordinates = (): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    proj4.defs(
      "TM",
      "+proj=tmerc +lat_0=38.9 +lon_0=127.00289083333334 +k=1 +x_0=200000 +y_0=600000 +ellps=bessel +units=m +no_defs"
    );

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const tmCoordinates = proj4(proj4.defs["WGS84"], proj4.defs["TM"], [
          lon,
          lat,
        ]);
        resolve(tmCoordinates);
      },
      function (error) {
        console.error("Error getting current position:", error);
        reject(error);
      }
    );
  });
};

// 실시간 기온 그래프 데이터
export const getTempGraphData = async (
  retryCount: number = 0
): Promise<WeatherItem[]> => {
  const baseTime =
    new Date().getMinutes() <= 40
      ? `${
          String(new Date().getHours() - 1 - retryCount).padStart(2, "0") + "00"
        }`
      : `${String(new Date().getHours() - retryCount).padStart(2, "0") + "00"}`;

  const queryParams = new URLSearchParams({
    numOfRows,
    pageNo,
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
    dataType,
  });

  try {
    const url = `${apiUrl}/getVilageFcst?serviceKey=${apiKey}&${queryParams.toString()}`;
    const response = await axios.get(url);
    const TempGraphData = response.data.response.body.items.item.filter(
      (item: { category: string }) => item.category === "TMP"
    );

    return TempGraphData.map(
      (item: { fcstDate: string; fcstTime: string }) => ({
        ...item,
        fcstTime:
          item.fcstTime.slice(0, 2) + "시 (" + item.fcstDate.slice(-2) + "일)",
      })
    );
  } catch (error) {
    // Re-req
    if (retryCount < 3) {
      console.log("Retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getTempGraphData(retryCount + 1);
    } else {
      throw new Error("Maximum retry count exceeded.");
    }
  }
};
