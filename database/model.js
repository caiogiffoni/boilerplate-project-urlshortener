const mongoose = require("mongoose");

const { Schema } = mongoose;
const ObjectID = Schema.ObjectID;

const LinkSchema = new Schema({
  original_url: String, // String is shorthand for {type: String}
  short_url: String, // String is shorthand for {type: String}
});

const LinkModel = mongoose.model("links", LinkSchema);

module.exports = LinkModel;
