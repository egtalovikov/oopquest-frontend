import React, { useContext } from "react";
import { Gravatar } from "../components/Gravatar.js";
import LoadingScreen from "../components/LoadingScreen.js";
import AuthContext from "../context/AuthContext";

export default function Profile() {
  const { useremail, username } = useContext(AuthContext);

  if (username)
    return (
      <div className="flex grow justify-center items-center bg-slate-900 text-white text-2xl">
        <div>
          <Gravatar
            className="m-2 border-4 border-amber-400 rounded-full"
            email={useremail}
            size={100}
          />
        </div>
        {username}
      </div>
    );
  else return <LoadingScreen />;
}
