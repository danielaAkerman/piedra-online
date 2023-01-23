import { initRouter } from "./router";
import { state } from "./state";
import "./components/button"
import "./components/input"
import "./components/results"
import "./components/countdown"
import "./components/score-bar"

(function () {
  // if (localStorage["game-state"]) {
  //   state.init();
  // }
  // localStorage.clear()

  const root = document.querySelector(".root") as HTMLElement;
  initRouter(root);
})();