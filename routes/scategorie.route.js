const express = require("express");
const router = express.Router();

// Create an instance of category
const Scategorie = require("../models/scategories");

// Show List Of Scategories.
router.get("/", async (req, res) => {
  try {
    const scat = await Scategorie.find({}, null, {
      sort: { _id: -1 },
    }).populate("categorieID"); // .populate for jointure all atribute of Categories
    res.status(200).json(scat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Search for an Scategory
router.get("/:id", async (req, res) => {
  try {
    const scat = await Scategorie.findById(req.params.id);
    res.status(200).json(scat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Delete an Scategory
router.delete("/:id", async (req, res) => {
  const id = req.params.scategorieId;
  await Scategorie.findByIdAndDelete(id);
  res.json({ message: "Scategorie Deleted Successfully." });
});

//update an Scategorie
router.put("/:id", async (req, res) => {
  try {
    const scat = await Scategorie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(scat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Create A New SCategory
router.post("/", async (req, res) => {
  const { nomscategorie, imagescategorie } = req.body;
  const newscat = new Scategorie({
    nomscategorie: nomscategorie,
    imagescategorie: imagescategorie,
  });
  try {
    await newscat.save();
    res.status(200).json(newscat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
