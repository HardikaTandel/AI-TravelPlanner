import React, { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import { Link } from 'react-router-dom';


const UserTripCardItem = ({trip}) => {

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
    <Link to={'/view-trip/'+trip?.id}>
    <div className='hover:scale-105 transition-all'>
        <img src={PhotoUrl?PhotoUrl: "/placeholder.avif" } alt="Trip" className=" rounded-xl w-[250px] h-[250px]"/>
        <div>
            <h2 className='font-bold text-lg'>
                {trip?.userSelection?.location?.label}
            </h2>
            <h2 className='text-sm text-gray-500'>
                {trip?.userSelection.noOfDays} days trip with {trip?.userSelection.budget} Budget
            </h2>
                
            
        </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem