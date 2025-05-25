import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAllUsers, updateUser, deleteUser } from "../api/AdminUserApi.js";
import { toast } from "react-toastify";

export function AdminAllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchAllUsers()
      .then((allUsers) => {
        const filteredUsers = allUsers.filter(
          (u) => u._id !== currentUser?._id
        );
        setUsers(filteredUsers);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        toast.error("Failed to load users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleBan = async (id, isBanned) => {
    try {
      const updated = await updateUser(id, { isBanned: !isBanned });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBanned: updated.isBanned } : u
        )
      );
      toast.success(
        `User ${updated.isBanned ? "banned" : "unbanned"} successfully`
      );
    } catch (err) {
      console.error("Ban/unban failed:", err);
      toast.error("Failed to ban/unban user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-user-container">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((u) => (
          <div key={u._id} className="user-card">
            <strong>{u.userName}</strong> ({u.email}) - Banned:{" "}
            <span className={u.isBanned ? "banned" : "not-banned"}>
              {u.isBanned ? "Yes" : "No"}
            </span>{" "}
            <button
              className={`btn ${u.isBanned ? "btn-unban" : "btn-ban"}`}
              onClick={() => handleBan(u._id, u.isBanned)}
            >
              {u.isBanned ? "Unban" : "Ban"}
            </button>{" "}
            <button
              className="btn btn-delete"
              onClick={() => handleDelete(u._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
