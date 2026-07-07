import { axiosInstance } from "./axios";

/* ---------------------- */
/*   AUTH ENDPOINTS       */
/* ---------------------- */

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

/* ---------------------- */
/*   FRIENDS & REQUESTS   */
/* ---------------------- */

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
};

export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
};

/* ---------------------- */
/*   CHAT / MESSAGES      */
/* ---------------------- */

export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

export const sendMessage = async (recipientId, content) => {
  const response = await axiosInstance.post("/messages", { recipientId, content });
  return response.data;
};

// ✅ Unread messages (for notifications)
export const getUnreadMessages = async () => {
  const response = await axiosInstance.get("/messages/unread");
  return response.data;
};

// ✅ Mark as read
export const markMessageAsRead = async (messageId) => {
  const response = await axiosInstance.patch(`/messages/${messageId}/read`);
  return response.data;
};
