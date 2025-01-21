const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();

const { addUser, addBook, searchBooks, addToReadingList,updateBook, getUserByReadingList, removeBookFromReadingList } = require("./controllers/dataControllers");

app.use(express.json());
app.use(cors());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Unable to connect to database", error);
  });


//   Routes

app.post("/api/users", addUser);
app.post("/api/books", addBook);

app.get("/api/books/search", searchBooks)
app.post("/api/reading-list", addToReadingList)
app.post("/api/books/:bookId", updateBook)
app.get("/api/reading-list/:userId", getUserByReadingList)

app.post("/api/reading-list/:readingListId", removeBookFromReadingList)

module.exports = app