import axios from "axios";

type WeatherItem = {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
};

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
const nx = "55";
const ny = "127";
const dataType = "JSON";

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
