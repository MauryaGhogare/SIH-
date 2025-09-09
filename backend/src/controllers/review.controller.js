import Review from "../models/review.model.js";

export const review = async (req, res) => {
  const { stars, reviewmsg } = req.body;
  try {
    if (!stars) {
      return res
      .status(400)
      .json({ message: "Stars are required" });
    }
    
    const authUser = req.user;
    
    if (!authUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const newReview = new Review({
      id: authUser._id,
      name: authUser.name,
      reviewmsg:reviewmsg || "",
      reviewstar: stars,
    });
    
    await newReview.save();

    return res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    console.log("Error in send review", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
  
    const reviews = await Review.find()
      .sort({ createdAt: -1 });
    
    return res.status(200).json(reviews);
  } catch (error) {
    console.log("Error in get reviews:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};