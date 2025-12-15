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
    content: "Maecenas risus tortor, tincidunt nec purus eu, gravida suscipit tortor.",
    date: "1 week ago",
    replies: [
      {
        id: "reply-1",
        author: "Kristin Watson",
        avatar: "https://i.pravatar.cc/150?img=5",
        isAdmin: true,
        content:
          "Nulla pellentesque leo vitae lorem hendrerit, sit amet elementum ipsum rutrum. Morbi ultricies volutpat orci quis fringilla. Suspendisse faucibus augue quis dictum egestas.",
        date: "1 week ago",
        replies: [
          {
            id: "reply-2",
            author: "Cody Fisher",
            avatar: "https://i.pravatar.cc/150?img=12",
            content: "Thank You so much sir, you're a great mentor. 🔥🔥🔥",
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
      "Thank you for your helpful video. May I ask what is the application use to demo the animation at [4:24], is it the runnable mobile application?\n\nAs what I know, Figma Mirror app cannot do that. Please help me\n\nGreat thanks",
    date: "2 weeks ago",
    replies: [],
  },
  {
    id: "comment-3",
    author: "Esther Howard",
    avatar: "https://i.pravatar.cc/150?img=9",
    content: "Quality content 🔥",
    date: "2 weeks ago",
    replies: [],
  },
  {
    id: "comment-4",
    author: "Brooklyn Simmons",
    avatar: "https://i.pravatar.cc/150?img=10",
    content:
      "This is exactly what I needed! The step-by-step explanation made everything so clear. Looking forward to more tutorials like this.",
    date: "3 weeks ago",
    replies: [
      {
        id: "reply-3",
        author: "Kristin Watson",
        avatar: "https://i.pravatar.cc/150?img=5",
        isAdmin: true,
        content:
          "Thank you for the kind words! More tutorials coming soon. Stay tuned! 🙌",
        date: "3 weeks ago",
      },
    ],
  },
  {
    id: "comment-5",
    author: "Cameron Williamson",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Could you please make a video about advanced animations in Webflow? That would be super helpful for intermediate users like me.",
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
        const navPlaceholderTop =
          navPlaceholderRef.current.getBoundingClientRect().top;
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

        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });

        setActiveSection(sectionId);
      }
    },
    []
  );

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
          style={{
            height: isNavSticky ? navRef.current?.offsetHeight || 0 : 0,
          }}
        />

        <nav
          ref={navRef}
          className={`${styles.sectionNav} ${
            isNavSticky ? styles.sectionNavSticky : ""
          }`}
          aria-label="Lecture content navigation"
        >
          <div className={styles.navContainer}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.id} className={styles.navItem}>
                  <a
                    href={`#${item.id}`}
                    className={`${styles.navLink} ${
                      activeSection === item.id ? styles.navLinkActive : ""
                    }`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    aria-current={activeSection === item.id ? "true" : undefined}
                  >
                    {item.label}
                    {item.count !== undefined && (
                      <span className={styles.navBadge}>{item.count}</span>
                    )}
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
              ref={(el) => {
                sectionRefs.current["description"] = el;
              }}
              className={styles.contentSection}
              aria-labelledby="description-heading"
            >
              <h2 id="description-heading" className={styles.sectionTitle}>
                Lectures Description
              </h2>
              <div className={styles.sectionContent}>
                <p>
                  We cover everything you need to build your first website. From
                  creating your first page through to uploading your website to
                  the internet. We'll use the world's most popular (and free)
                  web design tool called Visual Studio Code. There are exercise
                  files you can download and then work along with me. At the end
                  of each video I have a downloadable version of where we are in
                  the process so that you can compare your project with mine.
                  This will enable you to see easily where you might have a
                  problem. We will delve into all the good stuff such as how to
                  create your very own mobile burger menu from scratch learning
                  some basic JavaScript and jQuery.
                </p>
                <p>
                  If that all sounds a little too fancy – don't worry, this
                  course is aimed at people new to web design and who have never
                  coded before. We'll start right at the beginning and work our
                  way through step by step.
                </p>
              </div>
            </section>

            <section
              id="lecture-notes"
              ref={(el) => {
                sectionRefs.current["lecture-notes"] = el;
              }}
              className={styles.contentSection}
              aria-labelledby="lecture-notes-heading"
            >
              <div className={styles.sectionHeader}>
                <h2 id="lecture-notes-heading" className={styles.sectionTitle}>
                  Lecture Notes
                </h2>
                <a href="#" className={styles.downloadNotesBtn}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Notes
                </a>
              </div>
              <div className={styles.sectionContent}>
                <p>
                  In ut aliquet ante. Curabitur mollis tincidunt turpis, sed
                  aliquam mauris finibus vel. Praesent eget mi in mi maximus
                  egestas. Mauris eget ipsum in justo bibendum pellentesque. Sed
                  id arcu in arcu ullamcorper eleifend condimentum quis diam.
                  Phasellus tempus, urna ut auctor mattis, nisi nunc tincidunt
                  lorem, eu egestas augue lectus sit amet sapien. Maecenas
                  tristique aliquet massa, a venenatis augue tempor in. Aliquam
                  turpis urna, imperdiet in lacus a, posuere suscipit augue.
                </p>
                <p>
                  Nullam non quam a lectus finibus varius nec a orci. Aliquam
                  efficitur sem cursus elit efficitur lacinia
                </p>
                <ul>
                  <li>
                    Morbi sit amet pretium tellus. Donec blandit{" "}
                    <strong>fermentum tincidunt</strong>.
                  </li>
                  <li>
                    Proin iaculis sem et imperdiet tristique. Nam varius ac nisl
                    id sodales. Donec iaculis interdum mattis.
                  </li>
                  <li>Curabitur posuere ultricies diam in egestas.</li>
                  <li>
                    Donec id diam et lacus pharetra vestibulum a id est. Mauris
                    vestibulum massa quis elit feugiat, dictum maximus ipsum
                    pellentesque.
                  </li>
                  <li>
                    Sed elementum, libero id lacinia aliquet, purus nibh
                    consectetur mauris, eget interdum mi lacus vitae sem.
                  </li>
                </ul>
                <p>
                  Donec congue aliquam lorem nec congue. Suspendisse eu risus
                  mattis, interdum ante sed, fringilla urna. Praesent mattis
                  dictum sapien a lacinia. Ut scelerisque magna aliquet,{" "}
                  <strong>blandit arcu quis</strong>, consequat purus.
                  Suspendisse eget scelerisque felis. Integer vulputate urna
                  laoreet purus vehicula condimentum. Donec quis luctus quam.
                  Curabitur quis molestie ante. Nam pharetra sagittis varius.
                  Sed ullamcorper facilisis bibendum.
                </p>
              </div>
            </section>

            <section
              id="attached-files"
              ref={(el) => {
                sectionRefs.current["attached-files"] = el;
              }}
              className={styles.contentSection}
              aria-labelledby="attached-files-heading"
            >
              <h2 id="attached-files-heading" className={styles.sectionTitle}>
                Attached Files
              </h2>
              <AttachedFiles files={attachedFiles} />
            </section>

            <section
            id="comments"
            ref={(el) => {
                sectionRefs.current["comments"] = el;
            }}
            className={styles.contentSection}
            >
            <CourseComments
                comments={commentsData}
                totalCount={154}
                currentUserName="John Doe"
                onCommentSubmit={(content) => console.log("New comment:", content)}
                onReplySubmit={(commentId, content) =>
                console.log(`Reply to ${commentId}:`, content)
                }
            />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}