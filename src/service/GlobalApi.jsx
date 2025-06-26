import axios from 'axios';

export const GetPlaceDetails = (data) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  return axios.post(
    `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`,
    {
      textQuery: data.textQuery
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "places.displayName,places.photos"
      }
    }
  );
};

 export const PHOTO_REF_URL = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
