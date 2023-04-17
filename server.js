import express, { response } from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import multer from "multer";
import myModel from "./src/app/model/Model";

const port = 8888;
const db = "mongodb://127.0.0.1:27017/MOB402";
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/rsc");
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
  try {
    await myModel.find().then((data) => {
      res.render("home", { data: data.map((data) => data.toObject()) });
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/search", async (req, res) => {
  const tenSP = req.query.tenSP;
  if (tenSP == "") {
    res.redirect("/");
    return;
  }
  try {
    await myModel.find({ tenSP: tenSP }).then((data) => {
      res.render("home", { data: data.map((data) => data.toObject()) });
    });
  } catch (error) {}
});

app.get("/sapxep", async (req, res) => {
  const sapxep = req.query.sapxep;
  if (sapxep == 0) {
    res.redirect("/");
  } else if (sapxep == 1) {
    try {
      await myModel
        .find()
        .sort({ giaSP: 1 })
        .then((data) => {
          res.render("home", { data: data.map((data) => data.toObject()) });
        });
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    try {
      await myModel
        .find()
        .sort({ giaSP: -1 })
        .then((data) => {
          res.render("home", { data: data.map((data) => data.toObject()) });
        });
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

app.get("/add", async (req, res) => {
  res.render("add");
});

app.post("/add", upload.single("anhSP"), async (req, res) => {
  const { maSP, tenSP, loaiSP, giaSP } = req.body;
  const anhSP = `/rsc/${req.file.originalname}`;

  try {
    const newPd = new myModel({
      maSP,
      tenSP,
      loaiSP,
      giaSP,
      anhSP,
    });
    newPd.save();
    res.status(200).redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await myModel.findById(id).then((data) => {
      res.render("edit", { data: data.toObject() });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/edit/:id", upload.single("anhSP"), async (req, res) => {
  const id = req.params.id;
  const { maSP, tenSP, loaiSP, giaSP } = req.body;
  const anhSP = `/rsc/${req.file.originalname}`;

  try {
    await myModel.findByIdAndUpdate(id, { maSP, tenSP, loaiSP, giaSP, anhSP });
    res.status(200).redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    await myModel
      .findByIdAndDelete({ _id: req.params.id })
      .then((response) => res.status(200).send("OK"));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
