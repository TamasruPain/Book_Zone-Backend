import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    bname: String,
    auther: String,
    publishYear: String,
    edition: String,
    department: String,
    semester: String,
    blink: String
  
});

const BookModel = mongoose.model('books', bookSchema);
export default BookModel;

