const url = "http://localhost:3000";

export const state = {
  data: {
    userName: "",
    userId: "",
    roomId: "",
    resultadoParcial: "",
    oponentUserName: "",
    myStatus: "busy",
    oponentStatus: "",
    currentGame: {
      myPlay: "",
      pcPlay: "",
    },
    historyScore: {
      myPlay: 0,
      pcPlay: 0,
    },
  },
  listeners: [],

  init() {
    const localState = localStorage.getItem("game-state");
    if (localState) {
      state.setState(JSON.parse(localState));
    }
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    console.log("State: ", newState);

    for (const call of this.listeners) {
      call(newState);
    }
    localStorage.setItem("game-state", JSON.stringify(newState));
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  setUserName(name) {
    const currentState = this.getState();
    currentState.userName = name;
    // state.setState(currentState);
    // Si no existe, lo crea.
    // Si existe el userName, trae el ID,
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
        // if (data.message) {
        //   console.error("no existe el user");
        // } else {
        currentState.userId = data.id;
        // currentState.nombre = data.nombre;
        // this.setState(currentState);
        // }
      });
  },

  setNewRoom(params) {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(url + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: currentState.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.roomId = data.id;
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
          // this.init();
          params.goTo("/room-up");
        });
    }
    // else {
    //   console.error("No hay user Id");
    // }
  },

  entrarSala(roomId, params) {
    const currentState = this.getState();
    fetch(url + "/rooms/" + roomId + "?userId=" + currentState.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          console.error("Not found");
        } else {
          currentState.roomId = roomId;
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
          // state.init();
          params.goTo("/instructions");
        }
      });
  },

  setStatus(params, status:string, route:string){
    const currentState = this.getState();
    currentState.myStatus = status
    state.setState(currentState)

    params.goTo(route)
  },

  move(myPlay) {},
  //   const currentState = this.getState();
  //   currentState.currentGame.myPlay = myPlay;
  //   currentState.currentGame.pcPlay = pcPlay;

  //   if (
  //     (myPlay == "piedra" && pcPlay == "tijeras") ||
  //     (myPlay == "papel" && pcPlay == "piedra") ||
  //     (myPlay == "tijeras" && pcPlay == "papel")
  //   ) {
  //     currentState.historyScore.myPlay++;
  //     currentState.resultadoParcial = "GANASTE";
  //   } else if (myPlay == pcPlay) {
  //     currentState.resultadoParcial = "EMPATE";
  //   } else {
  //     currentState.historyScore.pcPlay++;
  //     currentState.resultadoParcial = "PERDISTE";
  //   }
  //   this.setState(currentState);
  // },
};
