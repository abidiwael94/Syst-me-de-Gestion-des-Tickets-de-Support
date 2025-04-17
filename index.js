const express = require("express")
const mongoose = require("mongoose")
const app = express()

mongoose.connect("mongodb+srv://wael:nodejs2025@cluster0.tl2rwyg.mongodb.net/demo")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => console.error("MongoDB connection error:", err));


app.listen("3010", () => {
    console.log("server is running!")
})