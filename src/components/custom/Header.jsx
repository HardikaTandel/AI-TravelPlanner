import React, { useEffect,useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [openDialog, setOpenDialog] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log(user);
  }, []);

    const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

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
        window.location.reload();
      });
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <img src="/logo.svg" />
      <div>
        {user ? (
          <div className="flex item-center gap-5">
            <a href="/my-trips">
            <Button variant="outline" className="rounded-full">
              My Trips
            </Button>
            </a>
            <a href="/create-trip">
            <Button variant="outline" className="rounded-full">
              + Create trip
            </Button>
            </a>
            <Popover >
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="h-[30px] w-[35px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button className="bg-black text-amber-50" onClick={()=>setOpenDialog(true)}>Sign In</Button>
        )}
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

export default Header;
