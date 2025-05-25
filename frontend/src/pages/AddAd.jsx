import React, { useState } from "react";
import { toast } from "react-toastify";
import { createAd } from "../api/AdApi";
import { useAuth } from "../context/AuthContext";

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

export const AddAd = () => {
  const [form, setForm] = useState({
    ads_name: "",
    ads_description: "",
    ads_price: "",
    ads_photo: "",
    ads_category: CATEGORIES[0],
  });

  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || user?.banned) {
      toast.error("Banned users cannot post ads.");
      return;
    }

    setLoading(true);

    try {
      const { ads_name, ads_description, ads_price, ads_photo, ads_category } =
        form;

      if (
        !ads_name ||
        !ads_description ||
        !ads_price ||
        !ads_photo ||
        !ads_category
      ) {
        toast.error("Please fill in all fields.");
        return;
      }

      await createAd({ ...form, ads_price: parseFloat(ads_price) });
      toast.success("Ad created successfully!");
      setForm({
        ads_name: "",
        ads_description: "",
        ads_price: "",
        ads_photo: "",
        ads_category: CATEGORIES[0],
      });
    } catch (err) {
      console.error("Failed to create ad:", err);
      toast.error("Failed to create ad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-ad-container">
      <h2>Create a New Ad</h2>

      {!isAuthenticated && <p>Please log in to post an ad.</p>}

      {user?.isBanned ? (
        <p className="text-red-600 font-semibold">
          You are banned and cannot post ads.
        </p>
      ) : (
        isAuthenticated && (
          <form onSubmit={handleSubmit} className="add-ad-form">
            <label>
              Title:
              <input
                type="text"
                name="ads_name"
                value={form.ads_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description:
              <textarea
                name="ads_description"
                value={form.ads_description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Price ($):
              <input
                type="number"
                name="ads_price"
                value={form.ads_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </label>

            <label>
              Category:
              <select
                name="ads_category"
                value={form.ads_category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Photo URL:
              <input
                type="text"
                name="ads_photo"
                value={form.ads_photo}
                onChange={handleChange}
                required
              />
            </label>

            {form.ads_photo && (
              <img
                src={form.ads_photo}
                alt="Preview"
                className="ad-preview-image"
              />
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Create Ad"}
            </button>
          </form>
        )
      )}
    </div>
  );
};
