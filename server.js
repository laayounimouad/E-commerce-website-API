const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs"); // to automatically require files (fs=>file system)
require("dotenv").config();

//imports routes
// const authRoutes = require("./routes/auth");

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

//middlewares

app.use(morgan("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(cors());

//routes middlewares
//automatically require routes
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);
// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server is running on port ${port}`));
