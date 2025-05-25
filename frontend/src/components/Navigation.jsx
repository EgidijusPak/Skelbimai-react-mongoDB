import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const logout1 = () => {
    logout();
    navigate("/");
  };

  const CATEGORIES = [
    "All",
    "Electronics",
    "Furniture",
    "Vehicles",
    "Real Estate",
    "Clothing",
    "Books",
    "Services",
    "Toys",
    "Sports Equipment",
    "Other",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory && selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {isAuthenticated && user?.role !== "admin" && (
          <>
            <button onClick={() => navigate("/dashboard")}>Home page</button>

            <button
              onClick={() => navigate(`/my-liked-ads?userId=${user._id}`)}
            >
              Liked ads
            </button>
            <button onClick={() => navigate("/my-posted-ads")}>
              My posted ads
            </button>
            <button onClick={() => navigate("/add-ad")}>Add your ad</button>
            <form onSubmit={handleSearch} className="search-form">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search ads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </>
        )}

        {isAuthenticated && user?.role === "admin" && (
          <>
            <button onClick={() => navigate("/admin/all-ads")}>
              Visi Skelbimai
            </button>
            <button onClick={() => navigate("/admin/all-users")}>
              Visi Vartotojai
            </button>
          </>
        )}
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <button onClick={logout1}>Logout</button>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
