import { model, Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    user: {
      type: mongoose.Types.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = model("Review", ReviewSchema);
export default Review;
