import { useState } from "react";
import { toast } from "react-toastify";

const categories = [
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

export const AdEditModal = ({ ad, onClose, onSave }) => {
  const [form, setForm] = useState({
    ads_name: ad.ads_name,
    ads_description: ad.ads_description,
    ads_price: ad.ads_price,
    ads_category: ad.ads_category,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { ads_name, ads_description, ads_price, ads_category } = form;
    if (
      !ads_name.trim() ||
      !ads_description.trim() ||
      !ads_price ||
      !ads_category
    ) {
      toast.error("All fields are required.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Ad</h3>
        <input
          name="ads_name"
          value={form.ads_name}
          onChange={handleChange}
          placeholder="Ad Name"
        />
        <textarea
          name="ads_description"
          value={form.ads_description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          name="ads_price"
          type="number"
          value={form.ads_price}
          onChange={handleChange}
          placeholder="Price"
        />
        <select
          name="ads_category"
          value={form.ads_category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
