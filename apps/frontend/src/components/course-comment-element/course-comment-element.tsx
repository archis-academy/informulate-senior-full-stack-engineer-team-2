import { useState, type JSX } from "react";
import styles from "./course-comment-element.module.scss";

export interface CommentReply {
  id: string;
  author: string;
  avatar: string;
  isAdmin?: boolean;
  content: string;
  date: string;
  replies?: CommentReply[];
}

export interface CommentData {
  id: string;
  author: string;
  avatar: string;
  isAdmin?: boolean;
  content: string;
  date: string;
  replies?: CommentReply[];
}

interface CourseCommentElementProps {
  comment: CommentData;
  isNested?: boolean;
  onReplySubmit?: (commentId: string, replyContent: string) => void;
}

export default function CourseCommentElement({
  comment,
  isNested = false,
  onReplySubmit,
}: CourseCommentElementProps) {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleReplyClick = (): void => {
    setShowReplyForm(!showReplyForm);
    setReplyContent("");
  };

  const handleReplySubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (replyContent.trim() && onReplySubmit) {
      onReplySubmit(comment.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const handleCancelReply = (): void => {
    setShowReplyForm(false);
    setReplyContent("");
  };

  const renderContent = (content: string): JSX.Element[] => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className={styles.contentParagraph}>
        {paragraph}
      </p>
    ));
  };

  return (
    <article
      className={`${styles.commentElement} ${
        isNested ? styles.commentElementNested : ""
      }`}
    >
      <div className={styles.commentMain}>
        {/* Avatar */}
        <div className={styles.avatar}>
          {comment.avatar && !imageError ? (
            <img
              src={comment.avatar}
              alt={comment.author}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className={styles.avatarInitials}>
              {getInitials(comment.author)}
            </span>
          )}
        </div>

        <div className={styles.commentBody}>
          {/* Header */}
          <div className={styles.commentHeader}>
            <span className={styles.authorName}>{comment.author}</span>
            {comment.isAdmin && (
              <span className={styles.adminBadge}>ADMIN</span>
            )}
            <span className={styles.separator}>•</span>
            <span className={styles.commentDate}>{comment.date}</span>
          </div>

          {/* Comment Content */}
          <div className={styles.commentContent}>
            {renderContent(comment.content)}
          </div>

          {/* Reply Button */}
          <button
            type="button"
            className={styles.replyBtn}
            onClick={handleReplyClick}
            aria-expanded={showReplyForm}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>REPLY</span>
          </button>

          {/* Reply Form */}
          {showReplyForm && (
            <form className={styles.replyForm} onSubmit={handleReplySubmit}>
              <textarea
                className={styles.replyInput}
                placeholder={`Reply to ${comment.author}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className={styles.replyFormActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancelReply}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitReplyBtn}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </button>
              </div>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className={styles.repliesList}>
              {comment.replies.map((reply) => (
                <CourseCommentElement
                  key={reply.id}
                  comment={reply}
                  isNested={true}
                  onReplySubmit={onReplySubmit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

