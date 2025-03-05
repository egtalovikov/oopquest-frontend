import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";

import { USER_STATES } from "../constants";

import HomeMenu from "../components/menu/HomeMenu";
import Lobby from "../components/lobby/Lobby";
import Game from "../components/game/Game";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const { username, useremail } = useContext(AuthContext);
  const { userInfo } = useContext(SocketContext);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "OOPQuest";
  }, []);

  useEffect(() => {
    if (!username || !useremail) {
      navigate("/login");
      return;
    }
  }, [username, useremail, navigate]);

  if (!userInfo) return <LoadingScreen />;

  switch (userInfo.state) {
    case USER_STATES.MENU:
      return <HomeMenu />;
    case USER_STATES.LOBBY:
      return <Lobby />;
    case USER_STATES.GAME:
      return <Game />;
    default:
      return <LoadingScreen />;
  }
}
