import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllAds,
  toggleLike,
  deleteAd,
  createComment,
  deleteComment,
  updateAd,
} from "../api/AdApi";
import { toast } from "react-toastify";
import { AdsList } from "../components/AdsListModal";

export const MyPostedAds = () => {
  const { user, isAuthenticated } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      setAds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAllAds()
      .then((allAds) => {
        const myAds = allAds.filter(
          (ad) => !ad.is_banned && ad.postedBy?._id === user._id
        );
        setAds(myAds);
      })
      .catch(() => toast.error("Failed to load your ads."))
      .finally(() => setLoading(false));
  }, [user, isAuthenticated]);

  const handleLike = async (adId) => {
    try {
      const updated = await toggleLike(adId);
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adId ? { ...ad, likedBy: updated.likedBy } : ad
        )
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
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
      toast.success("Ad deleted");
    } catch {
      toast.error("Failed to delete ad.");
    }
  };

  const handleUpdateAd = async (adId, updatedData) => {
    if (user?.isBanned) {
      toast.error("Banned users cannot update ads.");
      return;
    }

    try {
      const updatedAd = await updateAd(adId, updatedData);
      setAds((prev) => prev.map((ad) => (ad._id === adId ? updatedAd : ad)));
      toast.success("Ad updated");
    } catch {
      toast.error("Failed to update ad.");
    }
  };

  const handleCreateComment = async (adId, text) => {
    if (user?.isBanned) {
      toast.error("You are banned and cannot comment.");
      return;
    }

    const ad = ads.find((a) => a._id === adId);
    if (!ad) {
      toast.error("Ad not found.");
      return;
    }
    if (ad.is_banned) {
      toast.error("Cannot comment on a banned ad.");
      return;
    }

    if (!text.trim()) {
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
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div>
      <h2>My Posted Ads</h2>
      <AdsList
        ads={ads}
        user={user}
        loading={loading}
        onLike={handleLike}
        onDeleteAd={handleDeleteAd}
        onUpdateAd={handleUpdateAd}
        onPostComment={(adId) =>
          handleCreateComment(adId, commentTexts[adId] || "")
        }
        onDeleteComment={handleDeleteComment}
        commentTexts={commentTexts}
        onCommentChange={setCommentTexts}
      />
    </div>
  );
};
