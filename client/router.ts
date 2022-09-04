import { initPageWelcome } from "./pages/1-welcome";
import { initPageRoomUp } from "./pages/2a-room-up";
import { initPageRoomIn } from "./pages/2b-room-in";
import { initPageInstructions } from "./pages/3-instructions";
import { initPageGame } from "./pages/4-game";
import { initPageScore } from "./pages/5-score";
import { initPageTimeOut } from "./pages/timeout";

const routes = [
  {
    path: /\//,
    handler: initPageWelcome,
  },
  // {
  //   path: /\/hello/,
  //   handler: initPageWelcome,
  // },
  {
    path: /\/room-up/,
    handler: initPageRoomUp,
  },
  {
    path: /\/room-in/,
    handler: initPageRoomIn,
  },
  {
    path: /\/instructions/,
    handler: initPageInstructions,
  },
  {
    path: /\/game/,
    handler: initPageGame,
  },
  {
    path: /\/score/,
    handler: initPageScore,
  },
  {
    path: /\/time-out/,
    handler: initPageTimeOut,
  },
];

export function initRouter(container: Element) {
  function goTo(path) {
    history.pushState({}, "", path);
    handleRoute(path);
  }

  function handleRoute(route) {
    for (const r of routes) {
      if (r.path.test(route)) {
        const el = r.handler({ goTo });

        if (container.firstChild) {
          container.firstChild.remove();
        }
        container.appendChild(el);
      }
    }
  }

  handleRoute(location.pathname);

  window.onpopstate = function () {
    handleRoute(location.pathname);
  };
}
