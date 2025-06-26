import React from 'react';
import PlaceCardItem from './PlaceCardItem';

const PlacesToVisit = ({ trip }) => {
  const itinerary = trip?.tripData?.itinerary || {}; // Default to empty object

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Places to visit</h2>

      <div>
        {Object.entries(itinerary).length > 0 ? (
          Object.entries(itinerary)
            .sort(([a], [b]) => {
              // Extract number from 'Day1', 'Day 2', etc.
              const getDayNumber = (str) => parseInt(str.replace(/\D/g, ''), 10);
              return getDayNumber(a) - getDayNumber(b);
            })
            .map(([dayKey, dayData], index) => (
              <div key={index}>
                <h2 className='font-medium text-lg first-letter:uppercase mt-4'>
                  {dayKey.replace(/([A-Za-z]+)(\d+)/, '$1 $2')} {/* turns Day2 -> Day 2 */}
                </h2>
                <div className='grid md:grid-cols-2 gap-5'>
                  {dayData?.places?.map((place, idx) => (
                    <div key={idx} className='my-1'>
                      <h2 className='font-medium text-sm text-orange-600'>
                        {place.specificTime}
                      </h2>
                      <PlaceCardItem place={place} />
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p className='text-gray-500'>No itinerary data available.</p>
        )}
      </div>
    </div>
  );
};

export default PlacesToVisit;
