const request = require("supertest");
const app = require("../index"); 

describe("POST /users", () => {
  it("should create a new user successfully", async () => {
    const user = {
      username: "john_doe",
      email: "john.doe@example.com",
    };

    const response = await request(app)
      .post("/api/users") 
      .send(user)
      .expect(201);

    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user.username).toBe(user.username);
    expect(response.body.user.email).toBe(user.email);
  });

  it("should return an error if the email already exists", async () => {
    const user = {
      username: "john_doe",
      email: "john.doe@example.com",
    };

    // Create user first
    await request(app).post("/api/users").send(user);

    const response = await request(app)
      .post("/api/users") 
      .send(user)
      .expect(400);

    expect(response.body.message).toBe("Email already exists");
  });
});

describe("POST /books", () => {
  it("should add a book successfully", async () => {
    const book = {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      publicationYear: 1925,
    };

    const response = await request(app)
      .post("/api/books") 
      .send(book)
      .expect(201);

    expect(response.body.message).toBe("Book added successfully");
    expect(response.body.book.title).toBe(book.title);
    expect(response.body.book.author).toBe(book.author);
  });

  it("should return an error if title or author is missing", async () => {
    const book = {
      genre: "Fiction",
      publicationYear: 1925,
    };

    const response = await request(app)
      .post("/api/books") 
      .send(book)
      .expect(400);

    expect(response.body.message).toBe("Book title and author are required");
  });
});

describe("POST /api/reading-list", () => { 
  it("should add a book to the reading list", async () => {
    const user = { username: "john_doe_1", email: "john.doe@example.com_1" };
    const book = {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
    };

 
    const userResponse = await request(app).post("/api/users").send(user);
    const bookResponse = await request(app).post("/api/books").send(book);

    const readingList = {
      userId: userResponse.body.user.id, 
      bookId: bookResponse.body.book.id, 
      status: "reading",
    };

    const response = await request(app)
      .post("/api/reading-list")
      .send(readingList)
      .expect(200);

    expect(response.body.message).toBe("Book added to reading list");
    expect(response.body.readingList.userId).toBe(readingList.userId);
    expect(response.body.readingList.bookId).toBe(readingList.bookId);
    expect(response.body.readingList.status).toBe(readingList.status);
  });

  it("should return an error if the user or book does not exist", async () => {
    const readingList = {
      userId: 999, 
      bookId: 999, 
      status: "reading",
    };

    const response = await request(app)
      .post("/api/reading-list") 
      .send(readingList)
      .expect(400);

    expect(response.body.message).toBe("Invalid user or book ID!");
  });
});
