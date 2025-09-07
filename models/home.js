const moongoose = require("mongoose");

const homeSchema = moongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: String,
  description: String,
});



module.exports = moongoose.model("Home", homeSchema);
