import { rtdb } from "./rtdb";
const url = process.env.url;

export const state = {
  data: {
    roomId: "",
    rtdbRoomId: "",
    userName: "",
    rivalName: "",
    userId: "",
    rivalId: "",
    userStatus: "busy",
    rivalStatus: "busy",
    userScore: "",
    rivalScore: "",
    userChoise: "",
    rivalChoise: "",
    currentGame: {
      myPlay: "",
      rivalPlay: "",
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

          // fetch(url + "/cuantos-players/" + data.rtdbRoomId)
          //   .then((res) => {
          //     return res.json();
          //   })
          //   .then((data) => {
          //     console.log("ESTA ROOM TIENE", data, "PARTICIPANTES");

          //     // SI TIENE UN PLAYER
          //     if (data == 1) {
          //       // LE PREGUNTO SI SOY YO EL PLAYER
          //       fetch(url + "/info-room/" + currentState.rtdbRoomId)
          //         .then((res) => {
          //           return res.json();
          //         })
          //         .then((data) => {
          //           if (data[currentState.userName]) {
          //             // SI SOY NO PASA NADA
          //             console.log("Esta room tiene un solo player y sos vos:");
          //           } else {
          //             // SI NO SOY YO, ME VOY A AGREGAR COMO SEGUNDA PLAYER
          //             // OBTENGO RIVALNAME
          //             for (var key in data) {
          //               currentState.rivalName = key;
          //             }
          //             state.setState(currentState);

          //             console.log(
          //               "Esta room tiene un solo player y NO sos vos, tu rival es:",
          //               currentState.rivalName,
          //               "Te agregas como 2do player"
          //             );

          //             state.setState(currentState);
          //             fetch(
          //               url + "/agregar-player/" + currentState.rtdbRoomId,
          //               {
          //                 method: "post",
          //                 headers: {
          //                   "content-type": "application/json",
          //                 },
          //                 body: JSON.stringify({
          //                   userName: currentState.userName,
          //                   userId: currentState.userId,
          //                 }),
          //               }
          //             )
          //               .then((res) => {
          //                 return res.json();
          //               })
          //               .then((data) => {
          //                 console.log(data);
          //                 // LUEGO REDIRECT TO instructions
          //                 root.goTo("/instructions");
          //               });
          //           }
          //         });
          //     } else if (data == 2) {
          //       // SI TIENE DOS PLAYERS
          //       console.log("La room tiene dos players");
          //       // LE PREGUNTO SI MI USERNAME COINCIDE CON ALGUNO DE LOS USERNAMES DE LOS PLAYERS
          //       fetch(url + "/info-room/" + currentState.rtdbRoomId)
          //         .then((res) => {
          //           return res.json();
          //         })
          //         .then((resp) => {
          //           if (resp[currentState.userName]) {
          //             console.log("Uno de los players sos vos");
          //             // PARA AGREGAR EL NOMBRE DEL RIVAL EN MI STATE:
          //             const users: string[] = [];
          //             for (var key in resp) {
          //               console.log(key, typeof key);
          //               users.push(key);
          //             }
          //             console.log(users);
          //             if (users[0] == currentState.userName) {
          //               currentState.rivalName = users[1];
          //             } else if (users[1] == currentState.userName) {
          //               currentState.rivalName = users[0];
          //             }
          //             state.setState(currentState);
          //             root.goTo("/instructions");
          //             // SI COINCIDE MI NOMBRE, ESTÁ TODO BIEN PORQUE YA SOY PLAYER, REDIRECT TO instructions
          //           } else {
          //             console.log(
          //               "No podes ingresar a esta sala porque ya tiene dos participantes y vos no sos uno de ellos"
          //             );
          //             root.goTo("/sala-llena");
          //           }
          //         });
          //     }
          //   });
        }
      });
  },
  getPlayersName(root) {
    const currentState = state.getState();
    // LE PREGUNTO A LA RTDB CUANTOS PLAYERS TIENE
    const roomRef = rtdb.ref("/rooms/" + currentState.rtdbRoomId + "/players");
    roomRef.on("value", (snap) => {
      console.log("valor player rtdb", snap.val());
      var users: string[] = [];
      for (var key in snap.val()) {
        users.push(key.toString());
      }
      console.log("RTDB", users);
      if (users.length == 1) {
        console.log("RTDB hay un solo player en la room");
        if (users[0] == currentState.userName) {
          console.log("RTDB soy el unico player de la room");
          root.goTo("/instructions");
        } else if (users[0] != currentState.userName) {
          console.log("RTDB no soy player, me agrego");
          const myRoomRef = rtdb.ref(
            "/rooms/" +
              currentState.rtdbRoomId +
              "/players/" +
              currentState.userName
          );
          myRoomRef.set({
            userId: currentState.userId,
            userName: currentState.userName,
            score: 0,
            chose: "none",
            status: "busy",
          });
          root.goTo("/instructions");
        }
      } else if (users.length == 2) {
        console.log("rtdb somos doos");
        if (users.includes(currentState.userName)) {
          console.log("RTDB somos 2 y soy player");
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
          root.goTo("/instructions");
        } else {
          console.log("RTDB sala llena");
          root.goTo("/sala-llena");
        }
      }
    });
  },

  // obtenerRivalName(root) {
  //   const currentState = this.getState();
  //   console.log("obtener rivalname");
  //   // PREGUNTO CUANTOS PLAYERS HAY EN MI ROOM
  //   fetch(url + "/cuantos-players/" + currentState.rtdbRoomId)
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("ESTA ROOM TIENE", data, "PARTICIPANTES");
  //       // SI HAY UNO NO HAGO NADA
  //       if (data == 1) {
  //         root.goTo("/instructions");
  //       } else if (data == 2) {
  //         fetch(url + "/info-room/" + currentState.rtdbRoomId)
  //           .then((res) => {
  //             return res.json();
  //           })
  //           .then((data) => {
  //             const users: string[] = [];
  //             for (var key in data) {
  //               console.log(key, typeof key);
  //               users.push(key);
  //             }
  //             console.log(users);
  //             if (users[0] == currentState.userName) {
  //               currentState.rivalName = users[1];
  //             } else if (users[1] == currentState.userName) {
  //               currentState.rivalName = users[0];
  //             }
  //             state.setState(currentState);
  //             root.goTo("/instructions");
  //           });
  //       }
  //     });
  //   // SI HAY DOS, GUARDO EL OTRO NOMBRE EN RIVALNAME
  // },

  setStatus(root, status: string, route: string) {
    const currentState = this.getState();
    currentState.userStatus = status;
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

    root.goTo(route);
  },
  escucharCambioRival(root) {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;
    const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    roomRef.on("value", (snap) => {
      const valor = snap.val();
      currentState.rivalStatus = valor[currentState.rivalName].status;
      if (currentState.rivalStatus == "ok") {
        root.goTo("/game");
      }
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
