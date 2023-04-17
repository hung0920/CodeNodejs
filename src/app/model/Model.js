import mongoose, { Schema } from "mongoose";

const product = new Schema({
    maSP: { type: "string", require: true },
    tenSP: { type: "string", require: true },
    anhSP: { type: "string", require: true },
    loaiSP: { type: "string", require: true },
    giaSP: { type: "number", require: true },
})

module.exports = new mongoose.model("product", product);