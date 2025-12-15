import { useState } from "react";
import CourseCommentElement, {
  type CommentData,
} from "@components/course-comment-element/course-comment-element";
import styles from "./course-comments.module.scss";

interface CourseCommentsProps {
  comments: CommentData[];
  totalCount: number;
  currentUserAvatar?: string;
  currentUserName?: string;
  onCommentSubmit?: (content: string) => void;
  onReplySubmit?: (commentId: string, replyContent: string) => void;
}

export default function CourseComments({
  comments,
  totalCount,
  currentUserAvatar = "",
  currentUserName = "You",
  onCommentSubmit,
  onReplySubmit,
}: CourseCommentsProps) {
  const [newComment, setNewComment] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitComment = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newComment.trim()) {
      if (onCommentSubmit) {
        onCommentSubmit(newComment);
      }
      console.log("New comment submitted:", newComment);
      setNewComment("");
      setIsFocused(false);
    }
  };

  const handleCancel = (): void => {
    setNewComment("");
    setIsFocused(false);
  };

  const handleReplySubmit = (commentId: string, replyContent: string): void => {
    if (onReplySubmit) {
      onReplySubmit(commentId, replyContent);
    }
    console.log(`Reply to comment ${commentId}:`, replyContent);
  };

  return (
    <section className={styles.courseComments} aria-labelledby="comments-title">
      <header className={styles.commentsHeader}>
        <h2 id="comments-title" className={styles.commentsTitle}>
          Comments <span className={styles.commentCount}>({totalCount})</span>
        </h2>
      </header>

      <form className={styles.newCommentForm} onSubmit={handleSubmitComment}>
        <div className={styles.formAvatar}>
          {currentUserAvatar ? (
            <img src={currentUserAvatar} alt={currentUserName} />
          ) : (
            <span className={styles.avatarInitials}>
              {getInitials(currentUserName)}
            </span>
          )}
        </div>

        <div className={styles.formBody}>
          <textarea
            className={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            rows={isFocused ? 4 : 2}
            aria-label="Write a comment"
          />

          {(isFocused || newComment.trim()) && (
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {comments.length > 0 ? (
        <div className={styles.commentsList} role="list">
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentWrapper} role="listitem">
              <CourseCommentElement
                comment={comment}
                onReplySubmit={handleReplySubmit}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </section>
  );
}