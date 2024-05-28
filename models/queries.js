import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true }
});

const QueryModel = mongoose.model('Query', QuerySchema);
export default QueryModel;
