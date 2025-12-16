import { Link } from "react-router-dom";
import VideoPlayer from "@components/video-player/video-player";
import LectureHeader from "@components/lecture-header/lecture-header";
import styles from "./course-watch.module.scss";

interface StudentAvatar {
  id: string;
  name: string;
  avatar: string;
}

interface LectureData {
  lectureNumber: number;
  lectureTitle: string;
  studentsWatching: number;
  studentAvatars: StudentAvatar[];
  commentCount: number;
  lastUpdated: string;
}

const lectureData: LectureData = {
  lectureNumber: 2,
  lectureTitle: "Sign up in Webflow",
  studentsWatching: 512,
  studentAvatars: [
    { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Sarah Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Emily Brown", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: "5", name: "David Lee", avatar: "https://i.pravatar.cc/150?img=5" },
  ],
  commentCount: 48,
  lastUpdated: "December 15, 2024",
};

export default function CourseWatchPage() {
  return (
    <main className={styles.courseWatchPage}>
      <div className={styles.topBar}>
        <Link to="/course-details" className={styles.backLink}>
          ← Back to Course
        </Link>
      </div>

      <div className={styles.videoSection}>
        <VideoPlayer
          src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
          title={lectureData.lectureTitle}
          aspectRatio="16:9"
        />
      </div>

      <LectureHeader {...lectureData} />

      <div className={styles.contentSection}>
        <p>Lecture content and comments section</p>
      </div>
    </main>
  );
}
