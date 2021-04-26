const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");

const app = express();

const whitelist = [process.env.FE_URL, process.env.APP_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOWED BY CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

console.log(listEndpoints(app));

require("./middlewares/errorHandlers")(app);

const port = process.env.PORT || 8000;
const mongoDbUrl = "mongodb://127.0.0.1:27017/my-new-app";

mongoose
  .connect(mongoDbUrl, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    if (process.env.NODE_ENV == "production") {
      console.log("Server is running 🚀 on  CLOUD on  PORT: ", port);
    } else {
      console.log(
        `Server is running 🚀 LOCALLY  on url : http://localhost:${port}`
      );
    }
  })
  .catch((e) => {
    console.log(`❌ DB connection error: ${e}`);
  });
