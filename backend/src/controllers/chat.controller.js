import Message from "../models/message.model.js";

// Send Message
export const sendMsg = async (req, res) => {
  const { msg } = req.body;
  console.log("Message from backend:", msg);
  try {
    if (!msg) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Ensure req.user is available (for authenticated users)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newMsg = new Message({
      user: req.user._id, 
      text: msg,
    });

    await newMsg.save();

    return res.status(201).json({
      message: "Message sent successfully",
      chat: newMsg, // Changed from 'msg' to 'chat' for consistency
    });
  } catch (error) {
    console.error("Error in sendMsg:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
// Get Messages
export const getMsg = async (req, res) => {
    try {
      const messages = await Message.find()
        .sort({ createdAt: -1 }) // Newest messages first
        .populate("user", "username email"); // Populate user info if required
  
      return res.status(200).json({
        chats: messages, // Wrap messages in a key for consistency
      });
    } catch (error) {
      console.error("Error in getMsg:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  };
  