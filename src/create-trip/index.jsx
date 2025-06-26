import React, {  useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "../constants/options";
import axios from "axios";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { chatSession } from "./AIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading,setLoading]=useState(false);

 const navigate= useNavigate();
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {

    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfDays > 5 && !formData?.location) ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("please fill all the details");
      return;
    }
    
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);

    console.log(result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail:user?.email,
      id:docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary just for you!
      </p>

      <div className="mt-20 flex flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">Choose your destination </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
              placeholder: "Search for a place...",
            }}
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">
          How many days are you planning your trip?
        </h2>
        <Input
          placeholder="Ex. 3"
          className="border-gray-300 "
          type="number"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <p className="text-gray-400 text-md mb-4">
          The budget is exclusively allocated for activities and dining
          purposes.
        </p>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border rounded-lg hover:shadow-2xl cursor-pointer 
                ${formData?.budget == item.title && `shadow-lg border-black`}`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          Who are you planning with on your next adventure?
        </h2>

        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border rounded-lg hover:shadow-2xl cursor-pointer 
                ${
                  formData?.traveler == item.people && `shadow-lg border-black`
                }`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 flex justify-end">
        <Button
        disabled={loading}
        onClick={OnGenerateTrip} className="px-6 py-5 bg-red-400">
        {loading?
        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />: 'Generate Trip ✨'
      } 
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="" />
              <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
              <p>Sign into the App using Google authentication securely</p>
              <Button
              onClick={login} className="width-full mt-5">
                <>
                Sign In with Google
                </>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
