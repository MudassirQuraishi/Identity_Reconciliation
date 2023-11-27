const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const identifyRoutes = require("./Routes/identify");
const Logger = require("./Utilities/Logger");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", identifyRoutes);
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        Logger.log("Succesfull mongodb connection made");
        app.listen(process.env.SERVER_PORT);
        console.log(
            `Successfully started server at port ${process.env.SERVER_PORT}`
        );
        Logger.log(
            `Server has been succesfully started and listening for incoming requests on port ${process.env.SERVER_PORT}.`
        );
    })
    .catch((err) => {
        console.log(err);
        Logger.error(
            `Error while connecting to mongodb server. Error : ${err.message}`
        );
    });
