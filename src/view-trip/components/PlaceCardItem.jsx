import React, { useEffect, useState } from "react";
import {GetPlaceDetails} from "../../service/GlobalApi"
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";

const PHOTO_REF_URL = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;


const PlaceCardItem = ({ place }) => {

const[PhotoUrl,setPhotoUrl]=useState();
  useEffect(() => {
  if (place) {
  //console.log("Trip object is available:", place);
    GetPlacePhoto();
  } else {
    console.log("Trip object not available yet");
  }
}, [place]);

const GetPlacePhoto = async () => {
  const data = {
    textQuery: place.placeName
  };
  try {
    const resp = await GetPlaceDetails(data);
    //console.log("Places API response:", resp.data);

    const photos = resp.data.places?.[0]?.photos;
    if (photos && photos.length > 0) {
      const photoName = photos[0].name; // safer to use 0
      const photoUrl = PHOTO_REF_URL(photoName);
      setPhotoUrl(photoUrl);
      //console.log("Photo URL set to:", photoUrl);
    } else {
      console.warn("No photos found in API response.");
    }
  } catch (err) {
    console.error("Failed to fetch place details:", err);
  }
};

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.placeName} target='_blank'>
    <div className="border rounded-xl p-2  flex gap-5 hover:scale-105 transition-all mt-3 hover:shadow-md cursor-pointer">
      <img
        src={PhotoUrl?PhotoUrl:"/placeholder.avif"}
        className="w-[120px] h-[120px] rounded-xl"
      />
      <div>
        <h2 className="font-bold text-lg">{place.placeName}</h2>
        <p className="text-sm text-gray-500">{place.placeDetails}</p>
        {/*<h2 className="mt-2">🕒 {place.timeToTravel}</h2>*/}
        <button
          className="text-lg mt-4 text-gray-600 "
        >
          <FaMapLocationDot />
        </button>
      </div>
    </div>
    </Link>
  );
};

export default PlaceCardItem;
