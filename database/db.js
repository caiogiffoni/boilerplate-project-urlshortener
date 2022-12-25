const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://caio:1234@cluster0.hqzczjh.mongodb.net/test"
  );
}

module.exports = main;
