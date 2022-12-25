import mongoose from "mongoose";
const { Schema } = mongoose;

const LinkSchema = new Schema({
  id: ObjectID,
  link: String, // String is shorthand for {type: String}
});

const LinkModel = mongoose.model("links", LinkSchema);

module.exports = LinkModel;
