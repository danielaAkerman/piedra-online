import * as express from "express";
// import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";

const dev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

// console.log(process.env)

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

// app.use(express.static("../dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log("Corriendo en puerto " + port);
});
