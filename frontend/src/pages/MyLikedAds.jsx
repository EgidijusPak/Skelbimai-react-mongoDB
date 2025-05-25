import React, { useEffect, useState } from "react";
import { AdsList } from "../components/AdsListModal";
import {
  getAllAds,
  toggleLike,
  createComment,
  deleteComment,
  deleteAd,
  updateAd,
} from "../api/AdApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const MyLikedAds = () => {
  const [likedAds, setLikedAds] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLikedAds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAllAds()
      .then((ads) => {
        const filtered = ads.filter(
          (ad) => !ad.is_banned && ad.likedBy.includes(user._id)
        );
        setLikedAds(filtered);
      })
      .catch(() => toast.error("Failed to load liked ads."))
      .finally(() => setLoading(false));
  }, [user, isAuthenticated]);

  const handleLike = async (adId) => {
    try {
      const updated = await toggleLike(adId);
      setLikedAds((prev) =>
        prev
          .map((ad) =>
            ad._id === adId ? { ...ad, likedBy: updated.likedBy } : ad
          )
          .filter((ad) => ad.likedBy.includes(user._id))
      );
      toast.success("Updated like status");
    } catch {
      toast.error("Failed to update like.");
    }
  };

  const handleDeleteAd = async (adId) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot delete ads.");
      return;
    }

    try {
      await deleteAd(adId);
      setLikedAds((prev) => prev.filter((ad) => ad._id !== adId));
      toast.success("Ad deleted");
    } catch {
      toast.error("Failed to delete ad.");
    }
  };

  const handleUpdateAd = async (adId, updatedFields) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot update ads.");
      return;
    }

    try {
      const updatedAd = await updateAd(adId, updatedFields);
      setLikedAds((prev) =>
        prev.map((ad) =>
          ad._id === updatedAd._id ? { ...ad, ...updatedAd } : ad
        )
      );
      toast.success("Ad updated");
    } catch {
      toast.error("Failed to update ad.");
    }
  };

  const handlePostComment = async (adId, text) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot post comments.");
      return;
    }

    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const ad = likedAds.find((a) => a._id === adId);
    if (!ad) {
      toast.error("Ad not found.");
      return;
    }
    if (ad.is_banned) {
      toast.error("Cannot comment on a banned ad.");
      return;
    }

    try {
      const newComment = await createComment(adId, text);

      const commentWithUser = {
        ...newComment,
        postedBy: {
          _id: user._id,
          username: user.username || user.email || "Unknown",
        },
      };

      setLikedAds((prev) =>
        prev.map((ad) =>
          ad._id === adId
            ? { ...ad, comments: [...(ad.comments || []), commentWithUser] }
            : ad
        )
      );
      setCommentTexts((prev) => ({ ...prev, [adId]: "" }));
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId, adId) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot delete comments.");
      return;
    }

    try {
      await deleteComment(commentId);
      setLikedAds((prev) =>
        prev.map((ad) =>
          ad._id === adId
            ? {
                ...ad,
                comments: ad.comments?.filter((c) => c._id !== commentId),
              }
            : ad
        )
      );
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div>
      {!isAuthenticated && <p>Please log in to see your liked ads.</p>}
      <AdsList
        ads={likedAds}
        user={user}
        onLike={handleLike}
        onDeleteAd={handleDeleteAd}
        onUpdateAd={handleUpdateAd}
        onPostComment={(adId) =>
          handlePostComment(adId, commentTexts[adId] || "")
        }
        onDeleteComment={handleDeleteComment}
        commentTexts={commentTexts}
        onCommentChange={setCommentTexts}
        loading={loading}
      />
    </div>
  );
};
