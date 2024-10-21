const express = require("express");
const router = express.Router();

// Create an instance of Article
const Article = require("../models/articles");
const { verifyToken } = require("../middleware/verify-token");

// Show List Of Articles.
router.get("/", verifyToken, async (req, res) => {
  try {
    const art = await Article.find({}, null, {
      sort: { _id: -1 },
    }).populate("scategorieID"); // .populate for jointure all atribute of SCategories
    res.status(200).json(art);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Search for an Article
router.get("/:id", async (req, res) => {
  try {
    const art = await Article.findById(req.params.id);
    res.status(200).json(art);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Delete an Article
router.delete("/:id", async (req, res) => {
  const id = req.params.scategorieId;
  await Article.findByIdAndDelete(id);
  res.json({ message: "Article Deleted Successfully." });
});

//update an article
router.put("/:id", async (req, res) => {
  try {
    const art = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(art);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Create A New Article
router.post("/", async (req, res) => {
  const newart = new Article(req.body);
  try {
    await newart.save();
    res.status(200).json(newart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
