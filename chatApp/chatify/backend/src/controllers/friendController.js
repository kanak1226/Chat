import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// Accept Friend Request
export const acceptRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "accepted";
    await request.save();

    // ✅ Update both users' friends arrays
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.recipient },
    });
    await User.findByIdAndUpdate(request.recipient, {
      $addToSet: { friends: request.sender },
    });

    res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    console.error("❌ Error in acceptRequest:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Friends of logged-in user
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "friends",
      "fullName email profilePic"
    );

    res.json(user.friends); // ✅ return populated friends array
  } catch (err) {
    console.error("❌ Error in getFriends:", err);
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};
