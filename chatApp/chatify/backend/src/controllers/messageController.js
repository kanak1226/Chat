import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
};

// Get unread messages (for notifications)
export const getUnreadMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      recipient: req.user._id,
      isRead: false,
    })
      .populate("sender", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Error marking as read" });
  }
};
