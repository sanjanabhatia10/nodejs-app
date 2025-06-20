const mongoose = require("mongoose");
const { clearKey } = require("../services/cache"); // For cache clearing on POST
const Book = mongoose.model("Book");

module.exports = app => {
  // Root route for health check
  app.get("/", (req, res) => {
    res.send("Hello from the root route!");
  });

  // GET /api/books - fetch all books or by author, WITH CACHE!
  app.get("/api/books", async (req, res) => {
    try {
      let books;
      if (req.query.author) {
        books = await Book.find({ author: req.query.author }).cache();
      } else {
        books = await Book.find().cache(); // <--- .cache() is back!
      }
      res.send(books);
    } catch (err) {
      console.error("Error in GET /api/books:", err);
      res.status(500).send({ error: "Failed to fetch books" });
    }
  });

  // POST /api/books - add a new book
  app.post("/api/books", async (req, res) => {
    const { title, content, author } = req.body;

    const book = new Book({
      title,
      content,
      author
    });

    try {
      await book.save();
      // Optionally clear cache if you use caching
      if (clearKey) clearKey(Book.collection.collectionName);
      res.send(book);
    } catch (err) {
      console.error("Error in POST /api/books:", err);
      res.status(400).send({ error: "Failed to save book" });
    }
  });
};

