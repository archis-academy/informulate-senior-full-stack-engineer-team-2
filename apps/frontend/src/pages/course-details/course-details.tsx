import { Link } from "react-router-dom";
import VideoPlayer from "@components/video-player/video-player";
import styles from "./course-details.module.scss";

export default function CourseDetailsPage() {
  return (
    <main className={styles.courseDetailsPage}>
      <div className={styles.contentContainer}>
        <Link to="/" className={styles.breadcrumbLink}>
          ← Back to Home
        </Link>

        <h1 className={styles.courseTitle}>Course Details</h1>
        <p className={styles.courseSubtitle}>
          Watch the course introduction video below.
        </p>

        <div className={styles.heroVideoCard}>
          <h2 className={styles.videoTitle}>Course Introduction</h2>
          <div className={styles.videoContainer}>
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
