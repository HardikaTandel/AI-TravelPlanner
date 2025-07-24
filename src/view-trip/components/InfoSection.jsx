import React, { useState, useEffect } from "react";
import { RiShareForwardFill } from "react-icons/ri";
import { GetPlaceDetails } from "../../service/GlobalApi";
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const PHOTO_REF_URL = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;


const InfoSection = ({ trip }) => {

  const[PhotoUrl,setPhotoUrl]=useState();
  const [showShareMenu, setShowShareMenu] = useState(false);
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

const handleDownloadPDF = () => {
  if (!trip) return;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;
  doc.setFontSize(20);
  doc.text('AI Travel Planner', 105, y, { align: 'center' });
  y += 10;
  doc.setFontSize(14);
  doc.text('Trip Itinerary', 105, y, { align: 'center' });
  y += 12;

  // Trip Summary
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Trip Summary', 10, y);
  doc.setFont(undefined, 'normal');
  y += 8;
  doc.text(`Destination: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.location?.label || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 7;
  doc.text(`Days: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.noOfDays || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 7;
  doc.text(`Budget: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.budget || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 7;
  doc.text(`Travelers: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.traveler || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 12;

  // Hotels
  if (trip?.tripData?.hotelOptions?.length) {
    doc.setFont(undefined, 'bold');
    doc.text('Hotel Recommendations', 10, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    trip.tripData.hotelOptions.forEach((hotel, i) => {
      // Draw a separator line between hotels (except first)
      if (i > 0) {
        doc.setDrawColor(200);
        doc.line(12, y, pageWidth - 12, y);
        y += 3;
      }
      // Hotel Name
      const hotelNameLines = doc.splitTextToSize(`• ${hotel.hotelName}`, pageWidth - 20);
      doc.text(hotelNameLines, 14, y);
      y += hotelNameLines.length * 6;
      // Address
      const addressLines = doc.splitTextToSize(`Address: ${hotel.hotelAddress}`, pageWidth - 24);
      doc.text(addressLines, 18, y);
      y += addressLines.length * 6;
      // Price and Ratings
      const priceRating = `Price: ${hotel.price}    Ratings: ${hotel.ratings}⭐`;
      const priceRatingLines = doc.splitTextToSize(priceRating, pageWidth - 24);
      doc.text(priceRatingLines, 18, y);
      y += priceRatingLines.length * 6;
      y += 4;
      if (y > 270) { doc.addPage(); y = 18; }
    });
    y += 2;
  }

  // Itinerary
  if (trip?.tripData?.itinerary) {
    doc.setFont(undefined, 'bold');
    doc.text('Itinerary', 10, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    Object.entries(trip.tripData.itinerary).sort(([a], [b]) => {
      const getDayNumber = str => parseInt(str.replace(/\D/g, ''), 10);
      return getDayNumber(a) - getDayNumber(b);
    }).forEach(([day, dayData]) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${day.replace(/([A-Za-z]+)(\d+)/, '$1 $2')}:`, 12, y);
      doc.setFont(undefined, 'normal');
      y += 7;
      dayData.places?.forEach((place, idx) => {
        // Place Name
        const placeNameLines = doc.splitTextToSize(`• ${place.placeName}`, pageWidth - 24);
        doc.text(placeNameLines, 16, y);
        y += placeNameLines.length * 6;
        // Place Details
        if (place.placeDetails) {
          const detailsLines = doc.splitTextToSize(place.placeDetails, pageWidth - 28);
          doc.text(detailsLines, 20, y);
          y += detailsLines.length * 6;
        }
        // Specific Time
        if (place.specificTime) {
          const timeLines = doc.splitTextToSize(`Time: ${place.specificTime}`, pageWidth - 28);
          doc.text(timeLines, 20, y);
          y += timeLines.length * 6;
        }
        y += 2;
        if (y > 270) { doc.addPage(); y = 18; }
      });
      y += 4;
    });
  }

  doc.save(`Trip_Itinerary_${trip?.userSelection?.location?.label || ''}.pdf`);
};

const handleSendEmail = async () => {
  if (!trip) return;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;
  doc.setFontSize(20);
  doc.text('AI Travel Planner', 105, y, { align: 'center' });
  y += 10;
  doc.setFontSize(14);
  doc.text('Trip Itinerary', 105, y, { align: 'center' });
  y += 12;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Trip Summary', 10, y);
  doc.setFont(undefined, 'normal');
  y += 8;
  doc.text(`Destination: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.location?.label || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 7;
  doc.text(`Days: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.noOfDays || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 7;
  doc.text(`Budget: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.budget || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 7;
  doc.text(`Travelers: `, 12, y); doc.setFont(undefined, 'bold'); doc.text(`${trip?.userSelection?.traveler || ''}`, 45, y); doc.setFont(undefined, 'normal');
  y += 12;
  if (trip?.tripData?.hotelOptions?.length) {
    doc.setFont(undefined, 'bold');
    doc.text('Hotel Recommendations', 10, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    trip.tripData.hotelOptions.forEach((hotel, i) => {
      if (i > 0) {
        doc.setDrawColor(200);
        doc.line(12, y, pageWidth - 12, y);
        y += 3;
      }
      const hotelNameLines = doc.splitTextToSize(`• ${hotel.hotelName}`, pageWidth - 20);
      doc.text(hotelNameLines, 14, y);
      y += hotelNameLines.length * 6;
      const addressLines = doc.splitTextToSize(`Address: ${hotel.hotelAddress}`, pageWidth - 24);
      doc.text(addressLines, 18, y);
      y += addressLines.length * 6;
      const priceRating = `Price: ${hotel.price}    Ratings: ${hotel.ratings}⭐`;
      const priceRatingLines = doc.splitTextToSize(priceRating, pageWidth - 24);
      doc.text(priceRatingLines, 18, y);
      y += priceRatingLines.length * 6;
      y += 4;
      if (y > 270) { doc.addPage(); y = 18; }
    });
    y += 2;
  }
  if (trip?.tripData?.itinerary) {
    doc.setFont(undefined, 'bold');
    doc.text('Itinerary', 10, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    Object.entries(trip.tripData.itinerary).sort(([a], [b]) => {
      const getDayNumber = str => parseInt(str.replace(/\D/g, ''), 10);
      return getDayNumber(a) - getDayNumber(b);
    }).forEach(([day, dayData]) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${day.replace(/([A-Za-z]+)(\d+)/, '$1 $2')}:`, 12, y);
      doc.setFont(undefined, 'normal');
      y += 7;
      dayData.places?.forEach((place, idx) => {
        const placeNameLines = doc.splitTextToSize(`• ${place.placeName}`, pageWidth - 24);
        doc.text(placeNameLines, 16, y);
        y += placeNameLines.length * 6;
        if (place.placeDetails) {
          const detailsLines = doc.splitTextToSize(place.placeDetails, pageWidth - 28);
          doc.text(detailsLines, 20, y);
          y += detailsLines.length * 6;
        }
        if (place.specificTime) {
          const timeLines = doc.splitTextToSize(`Time: ${place.specificTime}`, pageWidth - 28);
          doc.text(timeLines, 20, y);
          y += timeLines.length * 6;
        }
        y += 2;
        if (y > 270) { doc.addPage(); y = 18; }
      });
      y += 4;
    });
  }
  // Get user email
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email || trip?.userEmail;
  if (!email) {
    toast.error('No user email found. Please sign in.');
    return;
  }
  // Get PDF as base64
  const pdfBase64 = doc.output('datauristring').split(',')[1];
  toast('Sending email...');
  try {
    const res = await fetch('/api/send-itinerary-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pdfBase64, filename: `Trip_Itinerary_${trip?.userSelection?.location?.label || ''}.pdf` })
    });
    if (res.ok) {
      toast.success('Itinerary sent to your email!');
    } else {
      toast.error('Failed to send email.');
    }
  } catch (err) {
    toast.error('Failed to send email.');
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
        <div className="relative">
          <button onClick={() => setShowShareMenu((v) => !v)}>
            <RiShareForwardFill className="text-white bg-black text-4xl rounded p-2 " />
          </button>
          {showShareMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { handleDownloadPDF(); setShowShareMenu(false); }}
              >
                📄 Download PDF
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { handleSendEmail(); setShowShareMenu(false); }}
              >
                ✉️ Send to my email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
