import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import VideoPlayer from "@components/video-player/video-player";
import LectureHeader from "@components/lecture-header/lecture-header";
import AttachedFiles from "@components/attached-files/attached-files";
import CourseComments from "@components/course-comments/course-comments";
import styles from "./course-watch.module.scss";

interface NavItem {
  id: string;
  label: string;
  count?: number;
}

const navItems: NavItem[] = [
  { id: "description", label: "Description" },
  { id: "lecture-notes", label: "Lectures Notes" },
  { id: "attached-files", label: "Attach File", count: 1 },
  { id: "comments", label: "Comments" },
];

const attachedFiles = [
  {
    id: "file-1",
    name: "Project_Starter_Files.zip",
    type: "zip",
    size: "2.4 MB",
    downloadUrl: "#",
  },
];

const commentsData = [
  {
    id: "comment-1",
    author: "Ronald Richards",
    avatar: "https://i.pravatar.cc/150?img=11",
    content: "I really enjoyed this lecture. The explanations were clear and easy to follow.",
    date: "1 week ago",
    replies: [
      {
        id: "reply-1",
        author: "Kristin Watson",
        avatar: "https://i.pravatar.cc/150?img=5",
        isAdmin: true,
        content:
          "Thank you, Ronald! I'm glad the lecture helped. If you have any questions, feel free to ask.",
        date: "1 week ago",
        replies: [
          {
            id: "reply-2",
            author: "Cody Fisher",
            avatar: "https://i.pravatar.cc/150?img=12",
            content: "Thank you both! This guidance is very helpful. 🔥🔥🔥",
            date: "1 week ago",
          },
        ],
      },
    ],
  },
  {
    id: "comment-2",
    author: "Guy Hawkins",
    avatar: "https://i.pravatar.cc/150?img=8",
    content:
      "Great video! Can you clarify which application was used to demo the animation at [4:24]? I tried Figma Mirror, but it doesn’t work the same way.",
    date: "2 weeks ago",
    replies: [],
  },
  {
    id: "comment-3",
    author: "Esther Howard",
    avatar: "https://i.pravatar.cc/150?img=9",
    content: "Excellent content! Learned a lot from this session.",
    date: "2 weeks ago",
    replies: [],
  },
  {
    id: "comment-4",
    author: "Brooklyn Simmons",
    avatar: "https://i.pravatar.cc/150?img=10",
    content:
      "This lecture was exactly what I needed. The step-by-step instructions made everything very clear. Looking forward to more tutorials!",
    date: "3 weeks ago",
    replies: [
      {
        id: "reply-3",
        author: "Kristin Watson",
        avatar: "https://i.pravatar.cc/150?img=5",
        isAdmin: true,
        content:
          "Thank you for the kind feedback! More tutorials are on the way. Stay tuned! 🙌",
        date: "3 weeks ago",
      },
    ],
  },
  {
    id: "comment-5",
    author: "Cameron Williamson",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Could you make a video about advanced animations in Webflow? It would be really useful for intermediate learners like me.",
    date: "1 month ago",
    replies: [],
  },
];

const lectureData = {
  lectureNumber: 2,
  lectureTitle: "Sign up in Webflow",
  studentsWatching: 512,
  studentAvatars: [],
  commentCount: 48,
  lastUpdated: "December 15, 2024",
};

export default function CourseWatchPage() {
  const [activeSection, setActiveSection] = useState<string>("description");
  const [isNavSticky, setIsNavSticky] = useState<boolean>(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navRef = useRef<HTMLElement | null>(null);
  const navPlaceholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      if (navPlaceholderRef.current) {
        const navPlaceholderTop = navPlaceholderRef.current.getBoundingClientRect().top;
        setIsNavSticky(navPlaceholderTop <= 0);
      }

      const navHeight = navRef.current?.offsetHeight || 60;
      const scrollPosition = window.scrollY + navHeight + 50;

      for (const item of navItems) {
        const section = sectionRefs.current[item.id];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
      e.preventDefault();
      const section = sectionRefs.current[sectionId];
      if (section) {
        const navHeight = navRef.current?.offsetHeight || 60;
        const sectionTop = section.offsetTop - navHeight - 20;
        window.scrollTo({ top: sectionTop, behavior: "smooth" });
        setActiveSection(sectionId);
      }
    },
    []
  );

  return (
    <main className={styles.courseWatchPage}>
      <div className={styles.topBar}>
        <Link to="/course-detail" className={styles.backLink}>
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

      <LectureHeader
        lectureNumber={lectureData.lectureNumber}
        lectureTitle={lectureData.lectureTitle}
        studentsWatching={lectureData.studentsWatching}
        studentAvatars={lectureData.studentAvatars}
        commentCount={lectureData.commentCount}
        lastUpdated={lectureData.lastUpdated}
      />

      <div className={styles.contentWrapper}>
        <div
          ref={navPlaceholderRef}
          className={styles.navPlaceholder}
          style={{ height: isNavSticky ? navRef.current?.offsetHeight || 0 : 0 }}
        />

        <nav
          ref={navRef}
          className={`${styles.sectionNav} ${isNavSticky ? styles.sectionNavSticky : ""}`}
          aria-label="Lecture content navigation"
        >
          <div className={styles.navContainer}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.id} className={styles.navItem}>
                  <a
                    href={`#${item.id}`}
                    className={`${styles.navLink} ${activeSection === item.id ? styles.navLinkActive : ""}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    aria-current={activeSection === item.id ? "true" : undefined}
                  >
                    {item.label}
                    {item.count !== undefined && <span className={styles.navBadge}>{item.count}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className={styles.container}>
          <div className={styles.contentSections}>
            <section
              id="description"
              ref={(el) => { sectionRefs.current["description"] = el; }}
              className={styles.contentSection}
              aria-labelledby="description-heading"
            >
              <h2 id="description-heading" className={styles.sectionTitle}>Lectures Description</h2>
              <div className={styles.sectionContent}>
                <p>We cover everything you need to build your first website...</p>
                <p>If that all sounds a little too fancy – don't worry...</p>
              </div>
            </section>

            <section
            id="lecture-notes"
            ref={(el) => { sectionRefs.current["lecture-notes"] = el; }}
            className={styles.contentSection}
            aria-labelledby="lecture-notes-heading"
            >
            <div className={styles.sectionHeader}>
                <h2 id="lecture-notes-heading" className={styles.sectionTitle}>
                Lecture Notes
                </h2>
                <a href="#" className={styles.downloadNotesBtn}>Download Notes</a>
            </div>
            <div className={styles.sectionContent}>
                <p>
                These lecture notes cover all the key concepts we discussed in the video. 
                They provide a step-by-step guide to help you follow along and practice on your own.
                </p>
                <p>
                Make sure to review these notes after watching the lecture to reinforce your understanding. 
                Use them as a reference while working on exercises and projects.
                </p>
                <ul>
                <li>Introduction to building your first website using Visual Studio Code.</li>
                <li>How to structure pages and sections effectively.</li>
                <li>Tips for styling elements and using layouts.</li>
                <li>Creating interactive components with basic JavaScript and jQuery.</li>
                <li>Downloading and comparing example project files to track your progress.</li>
                </ul>
                <p>
                These notes are designed to complement the video lecture. Follow them closely, 
                practice each step, and you'll gain hands-on experience building your first web project.
                </p>
            </div>
            </section>


            <section
              id="attached-files"
              ref={(el) => { sectionRefs.current["attached-files"] = el; }}
              className={styles.contentSection}
              aria-labelledby="attached-files-heading"
            >
              <h2 id="attached-files-heading" className={styles.sectionTitle}>Attached Files</h2>
              <AttachedFiles files={attachedFiles} />
            </section>

            <div
              id="comments"
              ref={(el) => { sectionRefs.current["comments"] = el; }}
              className={styles.contentSection}
            >
              <CourseComments
                comments={commentsData}
                totalCount={154}
                currentUserName="John Doe"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
