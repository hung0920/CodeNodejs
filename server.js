import express from 'express';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars';

const port = 8888;
const db = 'mongodb';
const app = express();

app.use(express.urlencoded({
    extended: true,
}))
app.use(express.json());

app.engine(".hbs", engine({
    extname: ".hbs",
}))
app.set("view engine", ".hbs");
app.set("views", "./src/views")

app.get("/", async (req, res) => {
    res.render("home");
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})