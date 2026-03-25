const Message = require("../models/Message");

// Get chat history between two users
exports.getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Fetch messages where this sender and receiver are involved
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark: Actually we usually save via socket, but adding a controller to fetch them
