import { Link } from "react-router-dom";
import VideoPlayer from "@components/video-player/video-player";
import styles from "./course-details.module.scss";

export default function CourseDetailsPage() {
  return (
    <main className={styles.courseDetailsPage}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <h1 className={styles.title}>Course Details</h1>
        <p className={styles.subtitle}>
          Watch the course introduction video below.
        </p>

        <div className={styles.videoSection}>
          <h2 className={styles.videoTitle}>Course Introduction</h2>
          <div className={styles.videoWrapper}>
            <VideoPlayer
              src="https://www.youtube.com/watch?v=bMknfKXIFA8"
              title="Course Introduction Video"
              aspectRatio="16:9"
            />
          </div>
        </div>
      </div>
    </main>
  );
}