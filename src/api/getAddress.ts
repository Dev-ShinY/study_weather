export const getAddress = async (lat: number, lon: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  return new Promise<string[]>((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve([
          data.address.city,
          data.address.borough,
          data.address.quarter,
        ]);
      })
      .catch((error) => {
        reject("Error fetching address");
      });
  });
};
