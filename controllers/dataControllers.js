const {
  Book: bookModel,
  ReadingList: ReadingListModel,
  User: UserModel,
} = require("../models");
const { Op, where } = require("sequelize");

// MS1_Assessment_1.1: Adding Users

const addUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const newUser = await UserModel.create({
      username: username,
      email: email,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

//   MS1_Assessment_1.2: Adding Books

const addBook = async (req, res) => {
  try {
    const { title, author, genre, publicationYear } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "Book title and author are required" });
    }

    const addNewBook = await bookModel.create({
      title,
      author,
      genre,
      publicationYear,
    });
    res
      .status(201)
      .json({ message: "Book added successfully", book: addNewBook });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// MS1_Assessment_1.3: Searching for Books

const searchBooks = async (req, res) => {
  try {
    const title = req.query.title;
    const author = req.query.author;
    console.log(title, author);
    const result = await bookModel.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
        author: {
          [Op.like]: `%${author}%`,
        },
      },
    });
    if (result.length === 0)
      return res.status(404).json({ message: "No books found" });
    res.status(200).json({ books: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// MS1_Assessment_1.4: Managing Reading List

const addToReadingList = async (req, res) => {
  try {
    const { userId, bookId, status } = req.body;

    const user = await UserModel.findByPk(userId);
    const book = await bookModel.findByPk(bookId);

    if (!user || !book)
      return res.status(400).json({ message: "Invalid user or book ID!" });

    const readingList = await ReadingListModel.create({
      userId: userId,
      bookId: bookId,
      status: status,
    });

    res.status(200).json({
      message: "Book added to reading list",
      readingList: readingList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to Managing Reading List!" });
  }
};

//   MS1_Assessment_1.5:Update Book Detail

const updateBook = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    const title = req.body.title;
    const genre = req.body.genre;
    console.log(title, genre);

    const updateBookById = await bookModel.findByPk(bookId);
    if (!updateBookById)
      return res.status(400).json({ message: "Book not found" });

    updateBookById.title = title || updateBookById.title;
    updateBookById.genre = genre || updateBookById.genre;

    await updateBookById.save();

    res.status(200).json({
      message: "Book details updated successfully",
      book: updateBookById,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to Updat eBook Detail!" });
  }
};

// MS1_Assessment_1.6:  Get the User's Reading List

const getUserByReadingList = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const findUserById = await ReadingListModel.findAll({
      where: {
        userId: userId,
      },
    });
    if (!findUserById)
      return res
        .status(400)
        .json({ message: "User not found or no books in reading list" });
    res.status(200).json({ readingList: findUserById });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to Get the User's Reading List!" });
  }
};

// MS1_Assessment_1.7:  Remove a Book from the Reading List

const removeBookFromReadingList = async (req, res) => {
  try {
    const readingListId = parseInt(req.params.readingListId);

    const findreadingListId = await ReadingListModel.findByPk(readingListId);
    if (!findreadingListId)
      return res.status(400).json({ message: "Reading list entry not found" });

    await findreadingListId.destroy();
    res.status(200).json({ message: "Book removed from reading list" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to Remove a Book from the Reading List!" });
  }
};

module.exports = {
  addUser,
  addBook,
  searchBooks,
  addToReadingList,
  updateBook,
  getUserByReadingList,
  removeBookFromReadingList,
};
