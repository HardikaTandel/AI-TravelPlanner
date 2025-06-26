import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";

const MyTrips = () => {
  const [userTrips, setUserTrips] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigation('/');
      return;
    }

    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
    const querySnapshot = await getDocs(q);

    const trips = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      trips.push(doc.data());
    });

    setUserTrips(trips); // ✅ Set once
  } catch (error) {
    console.error("Error fetching trips:", error);
  }
};


  return (
    <div className="sm:px-10 md:px-12 lg:px-72 px-5 mt-10 ">
      <h2 className="text-3xl font-bold">My Trips</h2>

      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
        {userTrips?.length>0?userTrips.map((trip, index) => (
          <UserTripCardItem trip={trip} key={index} />
        ))
    :[1,2,3,4,5,6].map((item,index)=>(
        <div key={index} className="h-[250px] w-full bg-slate-200 animate-pulse rounded-xl">

        </div>
    ))}
      </div>
    </div>
  );
};

export default MyTrips;
