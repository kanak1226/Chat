import { useEffect, useState } from "react";
import { getUserFriends } from "../lib/api";  // ✅ updated import

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await getUserFriends(); // ✅ call correct function
        if (Array.isArray(res)) {
          setFriends(res);
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Friends</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search friends..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 text-black"
      />

      {loading ? (
        <p>Loading friends...</p>
      ) : filteredFriends.length > 0 ? (
        <ul className="space-y-3">
          {filteredFriends.map((friend) => (
            <li
              key={friend._id}
              className="p-3 border rounded-md bg-base-200 flex items-center gap-3"
            >
              <img
                src={friend.profilePic || "/default-avatar.png"}
                alt={friend.fullName}
                className="w-10 h-10 rounded-full"
              />
              <span>{friend.fullName}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No friends found</p>
      )}
    </div>
  );
};

export default FriendsPage;
