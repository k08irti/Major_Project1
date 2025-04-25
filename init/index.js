const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ArkiTravels');
}

const initDB = async () => {
   await Listing.deleteMany({});
   console.log(initDB);
   initData.data = initData.data.map((obj) =>({
    ...obj, owner: "68011a8435c867069202c652"
   }));
   
   await Listing.insertMany(initData.data);
   console.log("data initilized");
};

initDB();