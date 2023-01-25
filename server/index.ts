import * as express from "express";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";

const dev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

// console.log(process.env)
const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});

app.post("/auth", function (req, res) {
  const { userName } = req.body;
  usersCollection
    .where("userName", "==", userName)
    .get()
    .then((resp) => {
      if (resp.empty) {
        usersCollection.add(req.body).then((newUserRef) => {
          res.json({ id: newUserRef.id });
        });
      } else {
        res.json({
          id: resp.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  const { userName } = req.body;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomLongId = uuidv4();
        const roomRef = rtdb.ref(
          "rooms/" + roomLongId + "/players/" + userName
        );
        roomRef
          .set({
            userId,
            userName,
            score: 0,
            chose: "ninguna",
            status: "busy",
          })
          .then((rtdbRes) => {
            const roomId = 1000 + Math.trunc(Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                  rtdbRoomId: roomLongId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "User not found",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            res.json(snap.data());
          });
      } else {
        res.status(401).json({
          message: "Room not found",
        });
      }
    });
});

app.get("/cuantos-players/:rtdbRoomId", function (req, res) {
  const { rtdbRoomId } = req.params;

  const playersRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
  playersRef.get().then((resp) => {
    res.json(resp.numChildren());
  });
});

app.get("/info-room/:rtdbRoomId", function (req, res) {
  const { rtdbRoomId } = req.params;

  const playersRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players");
  playersRef.get().then((resp) => {
    res.json(resp.val());
  });
});

app.post("/agregar-player/:rtdbRoomId", function (req, res) {
  const { userId } = req.body;
  const { userName } = req.body;
  const { rtdbRoomId } = req.params;
  const playersRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players/" + userName);
  playersRef.set(
    {
      userId,
      userName,
      score: 0,
      chose: "ninguna",
      status: "busy",
    },
    function () {
      res.json("ok");
    }
  );
});

app.patch("/status", function (req, res) {
  const { status } = req.body;
  const { userName } = req.body;
  const { rtdbRoomId } = req.body;
  const userRef = rtdb.ref("/rooms/" + rtdbRoomId + "/players/" + userName);

  userRef
    .update({
      status,
    })
    .then((snap) => {
      res.json({ message: `El status se ha actualizado: ${status}` });
    });
});

app.use(express.static("./dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log("Corriendo en puerto http://localhost:" + port);
});
