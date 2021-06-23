const mongoose = require("mongoose");

const initDB = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qtdp5.mongodb.net/flixsocial?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log("Failed to connect to database", err));
};

module.exports = initDB;
