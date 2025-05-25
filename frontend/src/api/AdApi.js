import axios from "axios";

const BASE_URL = "http://localhost:5000/api/ads";
const COMMENT_URL = "http://localhost:5000/api/comment";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Get all ads with comments
export const getAllAds = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createAd = async (adData) => {
  const response = await axios.post("/api/ads", adData, getAuthConfig());
  return response.data;
};

// Update ad by ID
export const updateAd = async (adId, updateData) => {
  const response = await axios.put(
    `${BASE_URL}/${adId}`,
    updateData,
    getAuthConfig()
  );
  return response.data;
};

// Delete ad by ID
export const deleteAd = async (adId) => {
  const res = await axios.delete(`${BASE_URL}/${adId}`, getAuthConfig());
  return res.data;
};

export const createComment = async (adId, text) => {
  const response = await axios.post(
    "/api/comment",
    { adId, text },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

// Ban/unban comment by ID
export const banComment = async (commentId, updateData) => {
  const res = await axios.put(
    `${COMMENT_URL}/${commentId}`,
    updateData,
    getAuthConfig()
  );
  return res.data;
};

// Delete comment by ID
export const deleteComment = async (commentId) => {
  const res = await axios.delete(
    `${COMMENT_URL}/${commentId}`,
    getAuthConfig()
  );
  return res.data;
};
// Toggle like (add/remove user ID in likedBy array)
export const toggleLike = async (adId) => {
  const res = await axios.put(
    `http://localhost:5000/api/ads/${adId}/like`,
    {},
    getAuthConfig()
  );
  return res.data;
};
