import { rtdb } from "./rtdb";
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
    myStatus: "busy",
    rivalStatus: "",
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
    console.log("State: ", this.data);

    for (const call of this.listeners) {
      call(newState);
    }
    // localStorage.setItem("game-state", JSON.stringify(newState));
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  setUserName(room, params) {
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
          this.setNewRoom(params);
        } else if (room == "room-in") {
          params.goTo("/room-in");
        }
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
    } else {
      console.error("No hay user Id");
    }
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

          fetch(url + "/cuantos-players/" + data.rtdbRoomId)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              console.log("ESTA ROOM TIENE", data, "PARTICIPANTES");

              // SI TIENE UN PLAYER
              if (data == 1) {
                // LE PREGUNTO SI SOY YO EL PLAYER
                fetch(url + "/info-room/" + currentState.rtdbRoomId)
                  .then((res) => {
                    return res.json();
                  })
                  .then((data) => {
                    if (data[currentState.userName]) {
                      // SI SOY NO PASA NADA
                      console.log("Esta room tiene un solo player y sos vos:");
                    } else {
                      // SI NO SOY YO, ME VOY A AGREGAR COMO SEGUNDA PLAYER
                      // OBTENGO RIVALNAME
                      for (var key in data) {
                        currentState.rivalName = key;
                      }
                      state.setState(currentState);

                      console.log(
                        "Esta room tiene un solo player y NO sos vos, tu rival es:",
                        currentState.rivalName,
                        "Te agregas como 2do player"
                      );

                      state.setState(currentState);
                      fetch(
                        url + "/agregar-player/" + currentState.rtdbRoomId,
                        {
                          method: "post",
                          headers: {
                            "content-type": "application/json",
                          },
                          body: JSON.stringify({
                            userName: currentState.userName,
                            userId: currentState.userId,
                          }),
                        }
                      )
                        .then((res) => {
                          return res.json();
                        })
                        .then((data) => {
                          console.log(data);
                          // LUEGO REDIRECT TO instructions
                          params.goTo("/instructions");
                        });
                    }
                  });
              } else if (data == 2) {
                // SI TIENE DOS PLAYERS
                console.log("La room tiene dos players");
                // LE PREGUNTO SI MI USERNAME COINCIDE CON ALGUNO DE LOS USERNAMES DE LOS PLAYERS
                fetch(url + "/info-room/" + currentState.rtdbRoomId)
                  .then((res) => {
                    return res.json();
                  })
                  .then((resp) => {
                    if (resp[currentState.userName]) {
                      console.log("Uno de los players sos vos");
                      // PARA AGREGAR EL NOMBRE DEL RIVAL EN MI STATE:
                      const users: string[] = [];
                      for (var key in resp) {
                        console.log(key, typeof key);
                        users.push(key);
                      }
                      console.log(users);
                      if (users[0] == currentState.userName) {
                        currentState.rivalName = users[1];
                      } else if (users[1] == currentState.userName) {
                        currentState.rivalName = users[0];
                      }
                      state.setState(currentState);
                      params.goTo("/instructions");
                      // SI COINCIDE MI NOMBRE, ESTÁ TODO BIEN PORQUE YA SOY PLAYER, REDIRECT TO instructions
                    } else {
                      console.log(
                        "No podes ingresar a esta sala porque ya tiene dos participantes y vos no sos uno de ellos"
                      );
                      params.goTo("/sala-llena");
                    }
                  });
              }
            });
        }
      });
  },

  obtenerRivalName(container) {
    const currentState = this.getState();
    console.log("obtener rivalname");
    // PREGUNTO CUANTOS PLAYERS HAY EN MI ROOM
    fetch(url + "/cuantos-players/" + currentState.rtdbRoomId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("ESTA ROOM TIENE", data, "PARTICIPANTES");
        // SI HAY UNO NO HAGO NADA
        if (data == 1) {
          container.goTo("/instructions");
        } else if (data == 2) {
          fetch(url + "/info-room/" + currentState.rtdbRoomId)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              const users: string[] = [];
              for (var key in data) {
                console.log(key, typeof key);
                users.push(key);
              }
              console.log(users);
              if (users[0] == currentState.userName) {
                currentState.rivalName = users[1];
              } else if (users[1] == currentState.userName) {
                currentState.rivalName = users[0];
              }
              state.setState(currentState);
              container.goTo("/instructions");
            });
        }
      });
    // SI HAY DOS, GUARDO EL OTRO NOMBRE EN RIVALNAME
  },

  setStatus(params, status: string, route: string) {
    const currentState = this.getState();
    currentState.myStatus = status;
    state.setState(currentState);

    fetch(url + "/status", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status,
        userName: currentState.userName,
        rtdbRoomId: currentState.rtdbRoomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });

    params.goTo(route);
  },
  escucharCambioRival() {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;
    const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    roomRef.on("value", (snap) => {
      const valor = snap.val();
      console.log("valor de rtdb", valor);
    });

    //   //   const messagesList = map(messagesFromServer);
    //   //   currentState.messages = messagesList;
    //   //   this.setState(currentState);
    //   // });
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
