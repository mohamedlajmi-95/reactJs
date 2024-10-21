const express = require("express");

const dotenv = require("dotenv");

const mongoose = require("mongoose");

const app = express();
//Middleware
app.use(express.json());

const categorieRouter = require("./routes/categorie.route");
const scategorieRouter = require("./routes/scategorie.route");
const articleRouter = require("./routes/article.route");

const userRouter = require("./routes/user.route.js");

//To be able to use .env File
dotenv.config();

// Connect to data base
mongoose
  .connect(process.env.DATABASECLOUD)
  .then(() => {
    console.log("Database Successfully Connected");
  })
  .catch((err) => {
    console.log("Unable to connect to Database", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send("accueil page");
});

app.use("/api/categories", categorieRouter);
app.use("/api/scategories", scategorieRouter);
app.use("/api/articles", articleRouter);
app.use("/api/user", userRouter);
app.listen(process.env.PORT, () => {
  console.log(`Application Executed With Port  ${process.env.PORT}`);
});
module.exports = app;
