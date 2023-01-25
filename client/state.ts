import { rtdb } from "./rtdb";
const url = process.env.url;

export const state = {
  data: {
    roomId: "",
    rtdbRoomId: "",
    userName: "",
    rivalName: "TU OPONENTE",
    userId: "",
    rivalId: "",
    userStatus: "busy",
    rivalStatus: "busy",
    userScore: 0,
    rivalScore: 0,
    userChoise: "none",
    rivalChoise: "none",
    resultadoParcial: "",
  },
  listeners: [],
  // goTo("/instructions")

  // init() {
  //   const localState = localStorage.getItem("game-state");
  //   if (localState) {
  //     state.setState(JSON.parse(localState));
  //   }
  // },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    // console.log("State: ", this.data);

    for (const call of this.listeners) {
      call(newState);
    }
    // localStorage.setItem("game-state", JSON.stringify(newState));
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  setUserName(room, root) {
    const currentState = this.getState();
    fetch(url + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userName: currentState.userName }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.userId = data.id;

        this.setState(currentState);
        if (room == "room-up") {
          this.setNewRoom(root);
        } else if (room == "room-in") {
          root.goTo("/room-in");
        }
      });
  },

  setNewRoom(root) {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(url + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentState.userId,
          userName: currentState.userName,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.roomId = data.id;
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
          console.log("Se creó la room");
          // this.init();
          root.goTo("/room-up");
        });
    } else {
      console.error("No hay user Id");
    }
  },

  getInRoom(roomId, root) {
    // A LA DB LE CONSULTO EL ID LARGO DE LA RTDB
    const currentState = this.getState();
    fetch(url + "/rooms/" + roomId + "?userId=" + currentState.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          console.error("Not found");
        } else {
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
          this.getPlayersName(root);
        }
      });
  },

  getPlayersName(root) {
    const currentState = state.getState();
    // LE PREGUNTO A LA RTDB CUANTOS PLAYERS TIENE
    const roomRef = rtdb.ref("/rooms/" + currentState.rtdbRoomId + "/players");
    roomRef.on("value", (snap) => {
      var users: string[] = [];
      for (var key in snap.val()) {
        users.push(key.toString());
      }
      // console.log("RTDB", users);
      if (users.length == 1) {
        if (users[0] == currentState.userName) {
          // console.log("UN PLAYER, VOY A INSTRUCTIONS");
          root.goTo("/instructions");
        } else if (users[0] != currentState.userName) {
          const myRoomRef = rtdb.ref(
            "/rooms/" +
              currentState.rtdbRoomId +
              "/players/" +
              currentState.userName
          );
          myRoomRef.set({
            userId: currentState.userId,
            userName: currentState.userName,
            score: currentState.userScore,
            chose: currentState.userChoise,
            status: currentState.userStatus,
          });
          console.log("Se agregó el player");
          root.goTo("/instructions");
        }
      } else if (users.length == 2) {
        if (users.includes(currentState.userName)) {
          if (users[0] == currentState.userName) {
            currentState.rivalName = users[1];
          } else if (users[1] == currentState.userName) {
            currentState.rivalName = users[0];
          }
          currentState.rivalStatus = snap.val()[currentState.rivalName].status;
          currentState.rivalId = snap.val()[currentState.rivalName].userId;
          currentState.rivalChoise = snap.val()[currentState.rivalName].chose;
          currentState.rivalScore = snap.val()[currentState.rivalName].score;

          state.setState(currentState);
          roomRef.off("value");
          root.goTo("/instructions");
        } else {
          root.goTo("/sala-llena");
        }
      }
    });
  },

  setMyStatus(root, status: string) {
    const currentState = this.getState();
    currentState.userStatus = status;
    state.setState(currentState);
    const myUserRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/players/" + currentState.userName
    );
    myUserRef.update({
      status,
    });

    if (status == "ok") {
      if (currentState.rivalId) {
        const rivalRoomRef = rtdb.ref(
          "/rooms/" +
            currentState.rtdbRoomId +
            "/players/" +
            currentState.rivalName
        );
        rivalRoomRef.on("value", (snap) => {
          const valor = snap.val();
          var rivalStatus = valor.status;
          currentState.rivalStatus = rivalStatus;
          state.setState(currentState);

          if (
            currentState.rivalStatus == "ok" &&
            currentState.userStatus == "ok"
          ) {
            root.goTo("/game");
          } else if (
            currentState.rivalStatus == "busy" &&
            currentState.userStatus == "ok"
          ) {
            root.goTo("/waiting-for");
          }
        });
      } else {
        // SI ESTOY LISTA PARA JUGAR PERO NO TENGO OPONENTE
        console.log("Esperando que se sume un oponente a tu sala");
        const roomRef = rtdb.ref(
          "/rooms/" + currentState.rtdbRoomId + "/players"
        );
        roomRef.on("value", (snap) => {
          const valor = snap.val();
          var users: string[] = [];
          for (var key in snap.val()) {
            users.push(key.toString());
          }
          if (users.length == 2) {
            console.log("Se sumó tu oponente")
            this.setMyStatus(root, status);
          }
        });
      }
    } else if (status == "busy") {
      root.goTo("/score");
    }
  },

  setGame(userChoise) {
    const currentState = this.getState();
    currentState.userChoise = userChoise;
    // currentState.rivalChoise = rivalChoise;
    var myPlay = currentState.userChoise;
    var pcPlay = currentState.rivalChoise;

    if (
      (myPlay == "piedra" && pcPlay == "tijera") ||
      (myPlay == "papel" && pcPlay == "piedra") ||
      (myPlay == "tijera" && pcPlay == "papel") ||
      (myPlay != "ninguna" && pcPlay == "ninguna")
    ) {
      currentState.userScore++;
      currentState.resultadoParcial = "GANASTE";
    } else if (myPlay == pcPlay) {
      currentState.resultadoParcial = "EMPATE";
    } else {
      currentState.rivalScore++;
      currentState.resultadoParcial = "PERDISTE";
    }
    this.setState(currentState);
  },
};
