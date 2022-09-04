export const state = {
  data: {
    userName: "",
    resultadoParcial: "",
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
    // const localState = localStorage.getItem("game-state");
    // state.setState(JSON.parse(localState));
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const call of this.listeners) {
      call(newState);
    }
    localStorage.setItem("game-state", JSON.stringify(newState));
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  addUserName(name) {
    const currentState = this.getState();
    currentState.userName = name;
  },

  addRoomId(id){
    const currentState = this.getState();
    currentState.roomId = id;
  },

  move(myPlay) {}
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
}
