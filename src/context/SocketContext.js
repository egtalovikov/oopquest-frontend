import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import io from "socket.io-client";
import AuthContext from "../context/AuthContext";

import { DEBUG, ROOM_STATES } from "../constants";

const SocketContext = createContext();
const socket = io.connect(process.env.REACT_APP_SOCKETIO_URL);

export default SocketContext;

export const SocketProvider = ({ children }) => {
  const { username, useremail } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);

  const gameEnded = useRef(false);
  const canUpdateSocket = useRef(true);
  const updateSocketCooldown = 5000;

  useEffect(() => {
    if (DEBUG) console.log("userInfo: " + JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    if (roomInfo?.state === ROOM_STATES.ENDED) {
      gameEnded.current = true;
    } else {
      gameEnded.current = false;
    }

    const currTime = new Date().getTime();

    if (roomInfo?.sendTime) {
      roomInfo.correctionTime = currTime - roomInfo.sendTime;
    }

    if (DEBUG) console.log("roomInfo: " + JSON.stringify(roomInfo));
  }, [roomInfo]);

  useEffect(() => {
    if (DEBUG) console.log("username or email updated, updating socket");
    updateSocket();
  }, [username, useremail]);

  const updateSocket = useCallback(() => {
    if (username === null || useremail === null) {
      if (DEBUG) console.log("username or email is null, not updating socket");
      return;
    }
    if (!canUpdateSocket.current) {
      if (DEBUG) console.log("can't update socket yet");
      return;
    }
    canUpdateSocket.current = false;
    setTimeout(() => {
      canUpdateSocket.current = true;
    }, updateSocketCooldown);

    socket.emit("update-socket", username, useremail, (response) => {
      if (gameEnded.current) return;

      if (response) {
        setUserInfo(response.userInfo);
        setRoomInfo(response.roomInfo);
      }
    });
  }, [setUserInfo, setRoomInfo, gameEnded, username, useremail]);

  useEffect(() => {
    socket.on("user-update", (data) => {
      setUserInfo(data);
    });

    socket.on("room-update", (data) => {
      setRoomInfo(data);
    });

    socket.on("disconnect", () => {
      if (DEBUG) console.log("disconnected");
    });

    socket.on("connect", () => {
      if (DEBUG) console.log("connected");
      updateSocket();
    });
  }, [setRoomInfo, setUserInfo, updateSocket]);

  const cancelRoom = useCallback(() => {
    socket.emit("cancel-room", username);
  }, [username]);

  const leaveRoom = useCallback(() => {
    socket.emit("leave-room", username, (response) => {
      if (response) {
        setUserInfo(response.userInfo);
        setRoomInfo(response.roomInfo);
      }
    });
  }, [username]);

  const updateRoom = useCallback(
    (newLobbyState) => {
      socket.emit("update-room", username, newLobbyState);
    },
    [username]
  );

  const createRoom = useCallback(() => {
    socket.emit("create-room", username, (response) => {
      if (response) {
        setUserInfo(response.userInfo);
        setRoomInfo(response.roomInfo);
      }
    });
  }, [username]);

  const joinRoom = useCallback(
    (roomCode, setCodeError) => {
      socket.emit("join-room", roomCode, username, (response) => {
        if (response === "404") {
          setCodeError("Неправильный код");
          return;
        } else if (response === "full") {
          setCodeError("Игра заполнена");
          return;
        } else if (response === "banned") {
          setCodeError("Вам не рады в этой игре");
          return;
        }
        setUserInfo(response.userInfo);
        setRoomInfo(response.roomInfo);
        setCodeError(null);
      });
    },
    [username]
  );

  const joinPublicRoom = useCallback(
    (roomCode, setCodeError) => {
      socket.emit("join-room", roomCode, username, (response) => {
        if (response === "404") {
          setCodeError("Неправильный код");
          return;
        } else if (response === "full") {
          setCodeError("Игра заполнена");
          return;
        } else if (response === "banned") {
          setCodeError("Вам не рады в этой игре");
          return;
        }
        setUserInfo(response.userInfo);
        setRoomInfo(response.roomInfo);
        setCodeError(null);
      });
    },
    [username]
  );

  const getPublicRooms = useCallback((setPublicRooms) => {
    socket.emit("public-rooms", (response) => {
      if (response) {
        setPublicRooms(response);
        if (DEBUG) console.log("public rooms: " + JSON.stringify(response));
      }
    });
  }, []);

  const kickPlayer = useCallback(
    (player) => {
      socket.emit("kick-room", username, player);
    },
    [username]
  );

  const startGame = useCallback(() => {
    socket.emit("start-game", username);
  }, [username]);

  const answerQuestion = useCallback(
    (answer, auto) => {
      socket.emit("answer-question", username, answer, auto);
    },
    [username]
  );

  const answerPickRegion = useCallback(
    (answer) => {
      socket.emit("answer-pick-region", username, answer);
    },
    [username]
  );

  const answerAttackRegion = useCallback(
    (answer) => {
      socket.emit("answer-attack-region", username, answer);
    },
    [username]
  );

  let contextData = {
    socket: socket,

    userInfo: userInfo,
    roomInfo: roomInfo,

    setUserInfo: setUserInfo,
    setRoomInfo: setRoomInfo,

    socketCancelRoom: cancelRoom,
    socketLeaveRoom: leaveRoom,
    socketUpdateRoom: updateRoom,
    socketCreateRoom: createRoom,
    socketJoinRoom: joinRoom,
    socketJoinPublicRoom: joinPublicRoom,
    socketGetPublicRooms: getPublicRooms,
    socketKickPlayer: kickPlayer,

    socketStartGame: startGame,

    socketAnswerQuestion: answerQuestion,
    socketAnswerPickRegion: answerPickRegion,
    socketAnswerAttackRegion: answerAttackRegion,
  };

  return (
    <SocketContext.Provider value={contextData}>
      {children}
    </SocketContext.Provider>
  );
};
