import axios from "axios";

const BASE_URL = "http://localhost:5000/api/user";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const fetchAllUsers = async () => {
  const res = await axios.get(BASE_URL, getAuthConfig());
  return res.data;
};

const updateUser = async (userId, updateData) => {
  const res = await axios.put(
    `${BASE_URL}/${userId}`,
    updateData,
    getAuthConfig()
  );
  return res.data;
};

const deleteUser = async (userId) => {
  const res = await axios.delete(`${BASE_URL}/${userId}`, getAuthConfig());
  return res.data;
};

export { fetchAllUsers, updateUser, deleteUser };
