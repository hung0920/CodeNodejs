import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import multer from 'multer';

const port = 8888;
const db = "mongodb://127.0.0.1:27017/MOB402";
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.use(express.static("./src/public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./src/views");

async function connectdb() {
  try {
    await mongoose.connect(db);
    console.log("OK");
  } catch (error) {
    console.log("FAIL");
  }
}

connectdb();

app.get("/", async (req, res) => {
    res.render("home");
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})