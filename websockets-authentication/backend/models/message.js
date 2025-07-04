import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});



// Use existing model if already compiled, or compile it if not
export default mongoose.models.Message || mongoose.model("Message", messageSchema);