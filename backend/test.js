const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");

const uri =
"mongodb+srv://toyshopadmin:Ankit12345@toy-shop-db.i3w3npr.mongodb.net/toyshop?retryWrites=true&w=majority&appName=toy-shop-db"

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });