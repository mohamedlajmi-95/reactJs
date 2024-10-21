const express = require("express");

// Create an instance of category
const Categorie = require("../models/categorie");

const { verifyToken } = require("../middleware/verify-token");
const { authorizeRoles } = require("../middleware/authorizeRole");

const router = express.Router();

// Show List Of Categories.
router.get("/", verifyToken, async (req, res) => {
  try {
    const cat = await Categorie.find({}, null, { sort: { _id: -1 } });
    res.status(200).json(cat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Search for a Category
router.get("/:id", async (req, res) => {
  try {
    const cat = await Categorie.findById(req.params.id);
    res.status(200).json(cat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Delete a Category
router.delete("/:id", async (req, res) => {
  const id = req.params.categorieId;
  await Categorie.findByIdAndDelete(id);
  res.json({ message: "Categorie Deleted Successfully." });
});

//update a Categorie
router.put("/:id", async (req, res) => {
  try {
    const cat = await Categorie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(cat);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Create A New Category
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "visiteure", "user"),
  async (req, res) => {
    const { nomcategorie, imagecategorie } = req.body;
    const newCategorie = new Categorie({
      nomcategorie: nomcategorie,
      imagecategorie: imagecategorie,
    });
    try {
      await newCategorie.save();
      res.status(200).json(newCategorie);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

module.exports = router;
