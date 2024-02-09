export const getGeoLoc = () => {
  return new Promise<number[]>((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const loc = [position.coords.latitude, position.coords.longitude];
          resolve(loc);
        },
        function (error) {
          console.error("위치 정보를 가져오는 데 실패했습니다.", error);
          reject(error);
        }
      );
    } else {
      alert("Geolocation is not supported in this browser.");
    }
  });
};
