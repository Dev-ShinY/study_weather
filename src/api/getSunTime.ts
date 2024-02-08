import axios from "axios";

const apiUrl: string | undefined = process.env.REACT_APP_SUN_TIME_API_URL;
const apiKey: string | undefined = process.env.REACT_APP_SUN_TIME_API_KEY;
const location = encodeURIComponent("서울");
const locdate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const generateApiUrl = () => {
  if (!apiUrl || !apiKey) {
    throw new Error("API URL or API Key is not defined");
  }

  return `${apiUrl}?serviceKey=${apiKey}&locdate=${locdate}&location=${location}`;
};

export const getSunTime = async () => {
  try {
    const url = generateApiUrl();
    const response = await axios.get(url);
    const { sunrise, sunset } = response.data.response.body.items.item;
    return { sunrise, sunset };
  } catch (error) {
    console.error("Error fetching sun time:", error);
    throw error;
  }
};
