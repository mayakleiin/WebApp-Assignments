const express = require("express");
const app = express();
const port = process.env.PORT;

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const postsRoute = require("./routes/postsRoute");
const commentsRoute = require("./routes/commentsRoute");

app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
