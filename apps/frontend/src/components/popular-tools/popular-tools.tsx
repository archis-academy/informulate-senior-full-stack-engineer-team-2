import { useCallback, useRef } from "react";
import styles from "./popular-tools.module.scss";
import { Link } from "react-router-dom";
import Icon from "@components/icon/icon";

interface Tool {
  id: number;
  name: string;
  courseCount: number;
  icon?: string;
}

interface Keyword {
  id: number;
  name: string;
}

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

interface ToolCardProps {
  tool: Tool;
}

function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link to={`/tools/${tool.id}`} className={styles.toolCard}>
      <div className={styles.toolIcon}>
        <span>{tool.name.charAt(0)}</span>
      </div>
      <div className={styles.toolInfo}>
        <h3 className={styles.toolName}>{tool.name}</h3>
        <p className={styles.toolCourseCount}>
          {tool.courseCount.toLocaleString()} courses
        </p>
      </div>
    </Link>
  );
}


interface KeywordTagProps {
  keyword: Keyword;
}

function KeywordTag({ keyword }: KeywordTagProps) {
  return (
    <li className={styles.keywordItem}>
      <Link to={`/keywords/${keyword.id}`} className={styles.keywordTag}>
        {keyword.name}
      </Link>
    </li>
  );
}

export default function PopularTools() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getScrollAmount = useCallback((): number => {
    const container = scrollContainerRef.current;
    if (!container) return 300;

    const firstCard = container.querySelector<HTMLElement>(`.${styles.toolCard}`);
    if (!firstCard) return 300;

    const cardWidth = firstCard.offsetWidth;
    const containerStyles = window.getComputedStyle(container);
    const gap = parseFloat(containerStyles.gap) || 16;

    return cardWidth + gap;
  }, []);

  const handleScroll = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = getScrollAmount();
    const scrollDirection = direction === "left" ? -scrollAmount : scrollAmount;

    container.scrollBy({
      left: scrollDirection,
      behavior: "smooth",
    });
  }, [getScrollAmount]);

  return (
    <section className={styles.popularToolsSection} aria-labelledby="popular-tools-heading">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="popular-tools-heading" className={styles.sectionTitle}>
            Popular Tools
          </h2>
          <p className={styles.sectionSubtitle}>
            Explore courses on the most in-demand tools and technologies
          </p>
        </div>

        <div className={styles.toolsWrapper}>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            <Icon name="arrow-left" aria-hidden />
          </button>

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
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            <Icon name="arrow-right" aria-hidden />
          </button>
        </div>

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
