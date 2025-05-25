import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAllAds,
  toggleLike,
  deleteAd,
  createComment,
  deleteComment,
  updateAd,
} from "../api/AdApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AdsList } from "../components/AdsListModal"; // Ensure correct path

export const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search")?.toLowerCase() || "";
  const category = queryParams.get("category") || "All";

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});
  const [editAdData, setEditAdData] = useState({});

  useEffect(() => {
    setLoading(true);
    getAllAds()
      .then((allAds) => {
        let visibleAds = allAds.filter((ad) => !ad.is_banned);

        if (search.trim()) {
          visibleAds = visibleAds.filter((ad) => {
            const text = `${ad.ads_name} ${ad.ads_description} ${
              ad.postedBy?.userName || ""
            }`.toLowerCase();
            return text.includes(search);
          });
        }

        if (category !== "All") {
          visibleAds = visibleAds.filter((ad) => ad.ads_category === category);
        }

        setAds(visibleAds);
      })
      .catch(() => toast.error("Failed to load ads."))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleLike = async (adId) => {
    try {
      const updatedAd = await toggleLike(adId);
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adId ? { ...ad, likedBy: updatedAd.likedBy } : ad
        )
      );
    } catch {
      toast.error("Failed to toggle like.");
    }
  };

  const handleDeleteAd = async (adId) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot delete ads.");
      return;
    }

    try {
      await deleteAd(adId);
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
      toast.success("Ad deleted.");
    } catch {
      toast.error("Failed to delete ad.");
    }
  };

  const handleUpdateAd = async (adId, updatedFields) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot update ads.");
      return;
    }

    if (
      !updatedFields.ads_name ||
      !updatedFields.ads_category ||
      !updatedFields.ads_price
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const updated = await updateAd(adId, updatedFields);
      setAds((prev) =>
        prev.map((ad) => (ad._id === adId ? { ...ad, ...updated } : ad))
      );
      toast.success("Ad updated.");
      setEditAdData((prev) => ({ ...prev, [adId]: null }));
    } catch {
      toast.error("Failed to update ad.");
    }
  };

  const handlePostComment = async (adId) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot post comments.");
      return;
    }

    const text = commentTexts[adId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const newComment = await createComment(adId, text);
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adId
            ? { ...ad, comments: [...(ad.comments || []), newComment] }
            : ad
        )
      );
      setCommentTexts((prev) => ({ ...prev, [adId]: "" }));
    } catch {
      toast.error("Failed to post comment.");
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
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <AdsList
        ads={ads}
        user={user}
        loading={loading}
        onLike={handleLike}
        onDeleteAd={handleDeleteAd}
        onUpdateAd={handleUpdateAd}
        onCommentChange={setCommentTexts}
        onPostComment={handlePostComment}
        onDeleteComment={handleDeleteComment}
        commentTexts={commentTexts}
        editAdData={editAdData}
        setEditAdData={setEditAdData}
      />
    </div>
  );
};
