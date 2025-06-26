import React from "react";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";

const HotelCardItem = ({hotel}) => {

  const[PhotoUrl,setPhotoUrl]=useState();
  useEffect(() => {
  if (hotel) {
    console.log("Trip object is available:", hotel);
    GetPlacePhoto();
  } else {
    console.log("Trip object not available yet");
  }
}, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName
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
      {" "}
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          hotel?.hotelName +
          hotel?.hotelAddress
        }
        target="_blank"
      >
        <div className="hover:scale-105 cursor-pointer transition-all">
          <img src={PhotoUrl?PhotoUrl:"/placeholder.avif"} className="rounded-xl h-[180px] w-full object-cover" />
          <div className="my-2 flex flex-col gap-2">
            <h2 className="font-medium">{hotel?.hotelName}</h2>
            <h2 className="text-xs text-gray-500"> 📍{hotel?.hotelAddress}</h2>
            <h2 className="text-xs">{hotel?.price}</h2>
            <h2 className="text-sm">⭐ {hotel?.ratings} star</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HotelCardItem;
