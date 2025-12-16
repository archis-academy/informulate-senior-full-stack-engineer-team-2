import { useState } from "react";
import styles from "./lecture-header.module.scss";

interface Student {
  id: string;
  name: string;
  avatar: string;
}

interface LectureHeaderProps {
  lectureNumber?: number;
  lectureTitle: string;
  studentsWatching: number;
  studentAvatars?: Student[];
  commentCount: number;
  lastUpdated: string;
}

const DEFAULT_STUDENT_AVATARS: Student[] = [
  { id: "1", name: "John Doe", avatar: "" },
  { id: "2", name: "Sarah Smith", avatar: "" },
  { id: "3", name: "Mike Johnson", avatar: "" },
  { id: "4", name: "Emily Brown", avatar: "" },
  { id: "5", name: "David Lee", avatar: "" },
];

function Avatar({ student }: { student: Student }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className={styles.avatar} title={student.name}>
      {!imgError && student.avatar ? (
        <img
          src={student.avatar}
          alt={student.name}
          onError={() => setImgError(true)}
        />
      ) : null}
      <span
        className={`${styles.avatarInitials} ${
          !imgError && student.avatar ? styles.hidden : ""
        }`}
      >
        {getInitials(student.name)}
      </span>
    </div>
  );
}

export default function LectureHeader({
  lectureNumber,
  lectureTitle,
  studentsWatching,
  studentAvatars = [],
  commentCount,
  lastUpdated,
}: LectureHeaderProps) {
  const formatNumber = (num: number): string => num.toLocaleString();
  const MAX_DISPLAY_AVATARS = 5;
  
  const displayAvatars: Student[] =
  studentAvatars.length > 0
    ? studentAvatars.slice(0, MAX_DISPLAY_AVATARS)
    : DEFAULT_STUDENT_AVATARS.slice(0, MAX_DISPLAY_AVATARS);

  return (
    <header className={styles.lectureHeader}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h2 className={styles.lectureTitle}>
            {lectureNumber && (
              <span className={styles.lectureNumber}>{lectureNumber}. </span>
            )}
            {lectureTitle}
          </h2>

          <div className={styles.studentsInfo}>
            <div className={styles.avatarStack} aria-label="Students watching">
              {displayAvatars.map((student, index) => (
                <div
                  key={student.id}
                  style={{ zIndex: displayAvatars.length - index }}
                >
                  <Avatar student={student} />
                </div>
              ))}
            </div>

            <div className={styles.studentCount}>
              <span className={styles.countNumber}>
                {formatNumber(studentsWatching)}
              </span>
              <span className={styles.countLabel}>Students watching</span>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.metaItem}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.metaIcon}
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <div className={styles.metaText}>
              <span className={styles.metaValue}>
                {formatNumber(commentCount)}
              </span>
              <span className={styles.metaLabel}>Comments</span>
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.metaItem}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.metaIcon}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div className={styles.metaText}>
              <span className={styles.metaValue}>Last updated</span>
              <span className={styles.metaLabel}>{lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
