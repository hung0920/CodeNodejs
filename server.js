import express from "express";
import mongoose from "mongoose";
import Model from "./src/app/model/NhanVienModel";
import multer from "multer";
import { engine } from "express-handlebars";

const port = 8888;
const db = "mongodb://127.0.0.1:27017/MOB402";
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/src");
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
    await Model.find().then((data) => {
      res.render("home", { data: data.map((data) => data.toObject()) });
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/search", async (req, res) => {
    const maNV = req.query.maNV;
    if (maNV == "") {
        res.redirect('/');
        return;
    }
  try {
    await Model.find({ maNV: maNV }).then((data) => {
      res.render("home", { data: data.map((data) => data.toObject()) });
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/add", async (req, res) => {
  res.render("Add");
});

app.post("/add", upload.single("anhNV"), async (req, res) => {
  const { maNV, tenNV, diemTB } = req.body;
  const anhNV = `src/${req.file.originalname}`;
  try {
    const newNV = new Model({
      maNV,
      tenNV,
      diemTB,
      anhNV,
    });
    newNV.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let acc = await Model.findOne({ _id: id });
    res.render("Edit", { data: acc.toObject() });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/edit/:id", upload.single("anhNV"), async (req, res) => {
  const id = req.params.id;
  const { maNV, tenNV, diemTB } = req.body;
  const anhNV = `src/${req.file.originalname}`;
  try {
    await Model.findByIdAndUpdate(id, {
      maNV,
      tenNV,
      diemTB,
      anhNV,
    });
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Model.findByIdAndDelete({ _id: id })
    .then((res) => res.status(200).send("OK"))
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
