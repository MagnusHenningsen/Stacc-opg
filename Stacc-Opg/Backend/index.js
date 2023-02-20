const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/consumption", (req, res) => {
    fs.readFile("consumption.json", (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        } 
        const output = JSON.parse(data);
        res.json(output);
    });
});

app.get("/providers", (req, res) => {
    fs.readFile("providers.json", (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        } 
        const output = JSON.parse(data);
        res.json(output);
    });
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});