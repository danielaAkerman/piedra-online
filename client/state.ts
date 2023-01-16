const url = process.env.url;

export const state = {
  data: {
    userName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    resultadoParcial: "",
    rivalName: "",
    rivalId: "",
    ready: false,
    oponentStatus: "",
    myScore: "",
    rivalScore: "",
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
    console.log("State: ", this.data);

    for (const call of this.listeners) {
      call(newState);
    }
    // localStorage.setItem("game-state", JSON.stringify(newState));
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
        this.setState(currentState);
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
          // this.init();
          params.goTo("/room-up");
        });
    }
    // else {
    //   console.error("No hay user Id");
    // }
  },

  entrarSala(roomId, params) {
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




          // LE PREGUNTO A LA RTDB CUANTOS PLAYERS TIENE

          fetch(
            url +
              "/cuantos-players/" +
              data.rtdbRoomId
          )
            .then((res) => {
              return res.json();
            })
            .then((data) => {console.log("ESTA ROOM TIENE", data, "PARTICIPANTES")})


            // SI TIENE UN PLAYER


            // LE PREGUNTO SI SOY YO EL PLAYER

            // SI SOY NO PASA NADA

            // SI NO SOY YO, ME VOY A AGREGAR COMO SEGUNDA PLAYER
            // LUEGO REDIRECT TO instructions






            // SI TIENE DOS PLAYERS

            // LE PREGUNTO SI MI USERNAME COINCIDE CON ALGUNO DE LOS USERNAMES DE LOS PLAYERS

            // SI COINCIDE MI NOMBRE, ESTÁ TODO BIEN PORQUE YA SOY PLAYER, REDIRECT TO instructions

            // SI MI NOMBRE NO COINCIDE, ESTOY INTENTANDO ENTRAR EN UNA SALA LLENA, REDIRECT TO sala-llena


          // fetch(
          //   url +
          //     "/info-room/" +
          //     data.rtdbRoomId +
          //     "?userId=" +
          //     currentState.userId +
          //     "&userName=" +
          //     currentState.userName
          // )
          //   .then((res) => {
          //     return res.json();
          //   })
          //   .then((data) => {
          //     if (data[1]) {
          //       console.log("HAY DOS");
          //       if (
          //         data[0].userName == currentState.userName ||
          //         data[1].userName == currentState.userName
          //       ) {
          //         console.log("HAY DOS PLAYERS PERO UNO O UNA SOS VOS");
          //         if (data[0].userName == currentState.userName) {
          //           currentState.rivalName = data[1].userName;
          //           currentState.rivalId = data[1].userId;
          //         } else if (data[1].userName == currentState.userName) {
          //           currentState.rivalName = data[0].userName;
          //           currentState.rivalId = data[0].userId;
          //         }
          //         state.setState(currentState);
          //       }
          //     } else if (data[0]) {
          //       console.log("HAY UNO O UNA");
          //       if (data[0].userName != currentState.userName) {
          //         console.log("HAY UN PLAYER PERO NO SOS VOS");
          //         // ME TENGO QUE AGREGAR A LOS PLAYERS

          //         fetch(url + "/agregar-player/" + currentState.rtdbRoomId, {
          //           method: "post",
          //           headers: {
          //             "content-type": "application/json",
          //           },
          //           body: JSON.stringify({
          //             userId: currentState.userId,
          //             userName: currentState.userName,
          //           }),
          //         })
          //           .then((res) => {
          //             return res.json();
          //           })
          //           .then((data) => {
          //             console.log("ENVIADOS LOS DATOS DEL NUEVO PLAYER");
          //           });
          //       } else if (data[0].userName == currentState.userName) {
          //         console.log("YA SOS PLAYER");
          //       }
          //     }
          //   });
        }
      });
  },

  setStatus(params, status: string, route: string) {
    const currentState = this.getState();
    currentState.myStatus = status;
    state.setState(currentState);

    params.goTo(route);
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
