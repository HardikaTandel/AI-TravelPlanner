import React from "react";
import HotelCardItem from "./HotelCardItem";

const Hotels = ({tripData}) => {
  return (
    <div>
      <h2 className="font-bold text-xl mt-5 mb-2">Hotel Reccomendations</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {tripData?.hotelOptions?.map((hotel, index) => (
         <HotelCardItem hotel={hotel}/>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
