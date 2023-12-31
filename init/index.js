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

//   const   initDatabase = async () =>{
//     await Listing.deleteMany({}),
//     initData.data = initData.data.map((obj) => ({ ...obj, owner: "659048e8cae424adacf13dcc" }));
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized"); 
//   };
// module.exports = initDatabase;