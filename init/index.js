const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


mongoose
  .connect(`${process.env.ATLASDB_URL}`)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

  const   initDatabase = async () =>{
    await Listing.deleteMany({}),
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "658d339c3dffaa5de9c7f455" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized"); 
  };
module.exports = initDatabase;