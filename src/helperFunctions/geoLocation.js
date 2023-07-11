import { getLocation } from "../fetchAndPostDatas/fetchData";

export const geoloc = (setUserAddress) => {
  navigator.geolocation.getCurrentPosition(
    (pos) => geoLocationSucess(pos, setUserAddress),
    geoLocationError
  );
};

const geoLocationSucess = (pos, setUserAddress) => {
  getLocation(pos.coords.latitude, pos.coords.longitude).then((response) => {
    if (response) {
      setUserAddress(response.features[0].properties.address_line2);
    }
  });
};

const geoLocationError = (error) => {
  let errors = {
    1: "Permission denied",
    2: "Position unavailable",
    3: "Request timeout",
  };
  console.log(errors[error.code]);
};
