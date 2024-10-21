const mongoose = require("mongoose");

const ScategorieSchema = mongoose.Schema({
  nomscategorie: { type: String, required: true },
  imagescat: { type: String, required: true },
  categorieID: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie" },
});

module.exports = mongoose.model("Scategorie", ScategorieSchema);
