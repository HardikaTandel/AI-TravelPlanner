import React, { useState, useEffect } from "react";
import { RiShareForwardFill } from "react-icons/ri";
import { GetPlaceDetails } from "../../service/GlobalApi";

const PHOTO_REF_URL = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;


const InfoSection = ({ trip }) => {

  const[PhotoUrl,setPhotoUrl]=useState();
  useEffect(() => {
  if (trip) {
    console.log("Trip object is available:", trip);
    GetPlacePhoto();
  } else {
    console.log("Trip object not available yet");
  }
}, [trip]);

const GetPlacePhoto = async () => {
  const data = {
    textQuery: trip?.userSelection?.location?.label
  };
  try {
    const resp = await GetPlaceDetails(data);
    console.log("Places API response:", resp.data);

    const photos = resp.data.places?.[0]?.photos;
    if (photos && photos.length > 0) {
      const photoName = photos[1].name; // safer to use 0
      const photoUrl = PHOTO_REF_URL(photoName);
      setPhotoUrl(photoUrl);
      console.log("Photo URL set to:", photoUrl);
    } else {
      console.warn("No photos found in API response.");
    }
  } catch (err) {
    console.error("Failed to fetch place details:", err);
  }
};

  return (
    <div>
      <img
        src={PhotoUrl?PhotoUrl:"/placeholder.avif"}
        className="h-[340px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flax flax-col gap-2">
          <h2 className="font-bold text-2xl my-3">
            {trip?.userSelection?.location?.label}
          </h2>

          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md  ">
              🗓️ {trip.userSelection?.noOfDays} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              {" "}
              💰 {trip.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md ">
              {" "}
              🙋 No. of Traveler: {trip.userSelection?.traveler}
            </h2>
          </div>
        </div>
        <button>
            <RiShareForwardFill className="text-white bg-black text-4xl rounded p-2 " />
        </button>
      </div>
    </div>
  );
};

export default InfoSection;
