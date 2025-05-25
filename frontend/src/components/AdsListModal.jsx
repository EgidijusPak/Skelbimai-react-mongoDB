import { useState } from "react";
import { toast } from "react-toastify";
import { AdEditModal } from "./AdEditModal";

export const AdsList = ({
  ads,
  user,
  onLike,
  onDeleteAd,
  onUpdateAd,
  onPostComment,
  onDeleteComment,
  commentTexts,
  onCommentChange,
  loading = false,
}) => {
  const [editAd, setEditAd] = useState(null);

  const handlePostCommentInternal = async (adId) => {
    const text = commentTexts?.[adId]?.trim() || "";

    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    const ad = ads.find((a) => a._id === adId);
    if (!ad) return;

    if (ad.is_banned) {
      toast.error("Cannot comment on a banned ad.");
      return;
    }

    if (user?.banned) {
      // <-- user banned flag is 'banned'
      toast.error("You are banned from commenting.");
      return;
    }

    try {
      await onPostComment(adId);
    } catch {
      toast.error("Failed to post comment.");
    }
  };

  const handleInputChange = (e, adId) => {
    onCommentChange((prev) => ({ ...prev, [adId]: e.target.value }));
  };

  return (
    <div className="ads-list">
      {loading && <p>Loading ads...</p>}
      {!loading && ads.length === 0 && <p>No ads to display.</p>}

      {ads.map((ad) => {
        const hasLiked = ad.likedBy.includes(user?._id);
        const adOwnerId = ad.postedBy?._id || ad.postedBy;
        const isOwner = user?._id === adOwnerId;

        return (
          <div
            key={ad._id}
            className="ad-card"
            style={{
              border: "1px solid #ccc",
              marginBottom: 20,
              padding: 10,
              borderRadius: 6,
            }}
          >
            <img
              src={ad.ads_photo}
              alt={ad.ads_name}
              className="ad-img"
              style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover" }}
            />
            <h3>{ad.ads_name}</h3>
            <p>{ad.ads_description}</p>
            <p>
              <strong>Category:</strong> {ad.ads_category}
            </p>
            <p>
              <strong>Price:</strong> ${ad.ads_price}
            </p>

            <button
              onClick={() => onLike(ad._id)}
              style={{ cursor: "pointer" }}
            >
              {hasLiked ? "❤️" : "🤍"} {ad.likedBy.length}
            </button>

            {isOwner &&
              !user?.banned && ( // <-- use 'banned' for user here too
                <>
                  <button
                    onClick={() => setEditAd(ad)}
                    style={{ marginLeft: 10 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteAd(ad._id)}
                    style={{ marginLeft: 10, color: "red" }}
                  >
                    Delete
                  </button>
                </>
              )}

            <div className="comments" style={{ marginTop: 15 }}>
              <h4>Comments</h4>
              {ad.comments?.length > 0 ? (
                ad.comments.map((comment) => {
                  const commentUserId = comment.user?._id || comment.user;
                  const isCommentOwner = user?._id === commentUserId;
                  const isAdOwner = user?._id === adOwnerId;

                  return (
                    <div key={comment._id} style={{ marginBottom: 6 }}>
                      <p style={{ margin: 0 }}>
                        <strong>{comment.user?.userName || "User"}</strong>:{" "}
                        {comment.text}
                        {(isCommentOwner || isAdOwner) && !user?.banned && (
                          <button
                            onClick={() => onDeleteComment(comment._id, ad._id)}
                            style={{
                              marginLeft: 10,
                              color: "red",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>No comments yet.</p>
              )}

              {!user?.banned && !ad.is_banned ? (
                <div className="comment-box" style={{ marginTop: 10 }}>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={commentTexts[ad._id] || ""}
                    onChange={(e) => handleInputChange(e, ad._id)}
                    style={{ width: "70%", marginRight: 10 }}
                  />
                  <button onClick={() => handlePostCommentInternal(ad._id)}>
                    Post
                  </button>
                </div>
              ) : (
                <p style={{ color: "red", fontStyle: "italic" }}>
                  Commenting is disabled.
                </p>
              )}
            </div>
          </div>
        );
      })}

      {editAd && (
        <AdEditModal
          ad={editAd}
          onClose={() => setEditAd(null)}
          onSave={(updatedFields) => {
            onUpdateAd(editAd._id, updatedFields);
            setEditAd(null);
          }}
        />
      )}
    </div>
  );
};
