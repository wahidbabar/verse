import express from "express";
import verifyAdminToken from "../middleware/verifyAdminToken";
import {
  deleteABook,
  getAllBooks,
  getSingleBook,
  postABook,
  searchBooks,
  toggleFavoriteBook,
  updateBook,
} from "./book.controller";
import multer from "multer";
const router = express.Router();

// frontend => backend server => controller => book schema  => database => send to server => back to the frontend
//post = when submit something fronted to db
// get =  when get something back from db
// put/patch = when edit or update something
// delete = when delete something
const upload = multer({ dest: "uploads/" });
// post a book
router.post(
  "/create-book",
  verifyAdminToken,
  upload.single("image"),
  postABook
);

// get all books
router.get("/", getAllBooks);

// search books
router.get("/search", searchBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, updateBook);

// delete a book endpoint
router.delete("/:id", verifyAdminToken, deleteABook);

// Favorite a book
router.post("/:id/favorite", toggleFavoriteBook);

export default router;
