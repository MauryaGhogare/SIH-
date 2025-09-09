import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reviewmsg: {
      type: String,
    },
    reviewstar: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;