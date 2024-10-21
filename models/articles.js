const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  designation: { type: String, required: true, unique: true },
  prix: { type: Number, required: true, unique: true },
  marque: { type: String, required: true, unique: true },
  qtestock: { type: Number, required: false },
  imageart: { type: String, required: false },
  scategorieID: { type: mongoose.Schema.Types.ObjectId, ref: "Scategorie" },
});

module.exports = mongoose.model("Article", ArticleSchema);
