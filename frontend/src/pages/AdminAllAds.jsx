import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllAds,
  updateAd,
  deleteAd,
  banComment,
  deleteComment,
} from "../api/AdApi.js";

export const AdminAllAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAds()
      .then(setAds)
      .catch((err) => {
        console.error("Error loading ads:", err);
        toast.error("Failed to load ads");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBanAd = async (adId, isBanned) => {
    try {
      const updated = await updateAd(adId, { is_banned: !isBanned });
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adId ? { ...ad, is_banned: updated.is_banned } : ad
        )
      );
      toast.success(
        `Ad ${updated.is_banned ? "banned" : "unbanned"} successfully`
      );
    } catch (err) {
      console.error("Ban/unban ad failed:", err);
      toast.error("Failed to ban/unban ad");
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      await deleteAd(adId);
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
      toast.success("Ad deleted successfully");
    } catch (err) {
      console.error("Delete ad failed:", err);
      toast.error("Failed to delete ad");
    }
  };

  const handleDeleteComment = async (commentId, adId) => {
    try {
      await deleteComment(commentId);
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adId
            ? {
                ...ad,
                comments: ad.comments?.filter((c) => c._id !== commentId),
              }
            : ad
        )
      );
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Delete comment failed:", err);
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <p>Loading ads...</p>;

  return (
    <div className="admin-ads-container">
      <h2>All Ads (Admin)</h2>
      {ads.length === 0 && <p>No ads found.</p>}

      {ads.map((ad) => (
        <div key={ad._id} className="ad-card">
          <h3>{ad.ads_name}</h3>
          {ad.ads_photo && (
            <img src={ad.ads_photo} alt="Ad" className="ad-image" />
          )}
          <p>{ad.ads_description}</p>
          <p>
            Banned:{" "}
            <span className={ad.is_banned ? "banned" : "not-banned"}>
              {ad.is_banned ? "Yes" : "No"}
            </span>
          </p>
          <button
            className={`btn ${ad.is_banned ? "btn-unban" : "btn-ban"}`}
            onClick={() => handleBanAd(ad._id, ad.is_banned)}
          >
            {ad.is_banned ? "Unban" : "Ban"}
          </button>{" "}
          <button
            className="btn btn-delete"
            onClick={() => handleDeleteAd(ad._id)}
          >
            Delete Ad
          </button>
          <div className="comments-section">
            <h4>Comments</h4>
            {ad.comments?.length === 0 && <p>No comments.</p>}
            {ad.comments?.map((comment) => (
              <div key={comment._id} className="comment-card">
                <p>
                  <strong>{comment.user?.userName || "Unknown"}</strong>:{" "}
                  {comment.text}
                </p>
                <p>
                  Banned:{" "}
                  <span className={comment.isBanned ? "banned" : "not-banned"}>
                    {comment.isBanned ? "Yes" : "No"}
                  </span>
                </p>

                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteComment(comment._id, ad._id)}
                >
                  Delete Comment
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
