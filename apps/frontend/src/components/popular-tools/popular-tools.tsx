import { useRef } from "react";
import styles from "./popular-tools.module.scss";

// Tool Card Interface
interface Tool {
  id: number;
  name: string;
  courseCount: number;
  icon?: string;
}

// Keyword Interface
interface Keyword {
  id: number;
  name: string;
}

// Placeholder data for tools
const tools: Tool[] = [
  { id: 1, name: "ChatGPT", courseCount: 1250 },
  { id: 2, name: "Python", courseCount: 3420 },
  { id: 3, name: "JavaScript", courseCount: 2890 },
  { id: 4, name: "React", courseCount: 1850 },
  { id: 5, name: "AWS", courseCount: 1560 },
  { id: 6, name: "Docker", courseCount: 980 },
  { id: 7, name: "Figma", courseCount: 1120 },
  { id: 8, name: "Node.js", courseCount: 1340 },
  { id: 9, name: "TypeScript", courseCount: 1670 },
  { id: 10, name: "TensorFlow", courseCount: 890 },
  { id: 11, name: "Kubernetes", courseCount: 720 },
  { id: 12, name: "MongoDB", courseCount: 1050 },
  { id: 13, name: "PostgreSQL", courseCount: 680 },
  { id: 14, name: "Flutter", courseCount: 920 },
  { id: 15, name: "Swift", courseCount: 540 },
];

// Placeholder data for keywords
const keywords: Keyword[] = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "Machine Learning" },
  { id: 3, name: "Data Science" },
  { id: 4, name: "Mobile Development" },
  { id: 5, name: "Cloud Computing" },
  { id: 6, name: "DevOps" },
  { id: 7, name: "UI/UX Design" },
  { id: 8, name: "Cybersecurity" },
  { id: 9, name: "Artificial Intelligence" },
  { id: 10, name: "Blockchain" },
  { id: 11, name: "Game Development" },
  { id: 12, name: "Digital Marketing" },
  { id: 13, name: "Project Management" },
  { id: 14, name: "Business Analytics" },
  { id: 15, name: "Photography" },
];

// Reusable Tool Card Component
interface ToolCardProps {
  tool: Tool;
}

function ToolCard({ tool }: ToolCardProps) {
  return (
    <a href={`/tools/${tool.id}`} className={styles.toolCard}>
      <div className={styles.toolIcon}>
        {/* Placeholder icon - first letter of tool name */}
        <span>{tool.name.charAt(0)}</span>
      </div>
      <div className={styles.toolInfo}>
        <h3 className={styles.toolName}>{tool.name}</h3>
        <p className={styles.toolCourseCount}>
          {tool.courseCount.toLocaleString()} courses
        </p>
      </div>
    </a>
  );
}

// Reusable Keyword Tag Component
interface KeywordTagProps {
  keyword: Keyword;
}

function KeywordTag({ keyword }: KeywordTagProps) {
  return (
    <li className={styles.keywordItem}>
      <a href={`/keywords/${keyword.id}`} className={styles.keywordTag}>
        {keyword.name}
      </a>
    </li>
  );
}

// Main Popular Tools Section Component
export default function PopularTools() {
  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll amount in pixels
  const SCROLL_AMOUNT = 300;

  /**
   * Handles scrolling the tool cards container
   * @param direction - 'left' or 'right'
   */
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const scrollAmount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.popularToolsSection} aria-labelledby="popular-tools-heading">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 id="popular-tools-heading" className={styles.sectionTitle}>
            Popular Tools
          </h2>
          <p className={styles.sectionSubtitle}>
            Explore courses on the most in-demand tools and technologies
          </p>
        </div>

        {/* Scrollable Tools Container */}
        <div className={styles.toolsWrapper}>
          {/* Left Navigation Button */}
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className={styles.toolsScrollContainer}
            role="list"
            aria-label="List of popular tools"
          >
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Popular Keywords Section */}
        <div className={styles.keywordsSection}>
          <h3 className={styles.keywordsTitle}>Popular Keywords:</h3>
          <ul className={styles.keywordsList} role="list">
            {keywords.map((keyword) => (
              <KeywordTag key={keyword.id} keyword={keyword} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}