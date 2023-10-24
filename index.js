require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const app = express();
require("./databases/database");

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/users",require("./routes/user.routes"));

app.use((req,res)=>{res.status(404).send("ERROR: 404")});

app.listen(app.get("port"), () =>
  console.log("Server on port:", app.get("port"))
);
