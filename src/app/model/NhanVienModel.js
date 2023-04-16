import mongoose, { Schema } from "mongoose";

const NhanVien = new Schema({
    maNV: { type: "string", required: true },
    tenNV: { type: "string", required: true },
    anhNV: { type: "string", required: true },
    diemTB: { type: "Number", required: true },
})

module.exports = mongoose.model('nhanvien', NhanVien);