
const express = require("express");
const app = express();
const PORT = 3000;

app.use('/test', (req, res) => {
    res.send("hello from server")
})

app.use('/hello3', (req, res) => {
    res.send("hello from server")
})

app.listen(PORT, () => {
    console.log("application is running on port", PORT)
})