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

app.get("/lugar", (req, res) => {
  res.json({
    lugar: process.env.LUGAR,
  });
});

app.get("/hola", (req, res) => {
  res.json({
    message: "hola soy el server",
  });
});

app.post("/auth", function (req, res) {
  const { name } = req.body;
  usersCollection
    .where("name", "==", name)
    .get()
    .then((resp) => {
      if (resp.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: resp.docs[0].id,
          nombre: resp.docs[0].data().nombre,
        });
      }
    });
});

app.use(express.static("./dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log("Corriendo en puerto http://localhost:" + port);
});
