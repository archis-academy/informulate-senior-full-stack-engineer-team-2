import { Link } from "react-router-dom";
import InstructorCTABanner from "@components/instructorCTABanner/InstructorCTABanner";
import PopularTools from "@components/popular-tools/popular-tools";
import styles from "./home.module.scss";

// Navigation links data
interface NavLink {
  to: string;
  label: string;
  description: string;
}

const navLinks: NavLink[] = [
  {
    to: "/filter-demo",
    label: "Price Filter Demo",
    description: "Dual-handle slider with synchronized inputs",
  },
  {
    to: "/course-detail",
    label: "Course Details",
    description: "Course overview with sticky navigation",
  },
  {
    to: "/course-watch",
    label: "Course Watch",
    description: "Video player with lecture header",
  },
];

function Home() {
  return (
    <main className={styles.homePage}>
      <nav className={styles.devNav} aria-label="Demo pages navigation">
        <div className={styles.devNavContainer}>
          <div className={styles.devNavHeader}>
            <h2 className={styles.devNavTitle}>Quick Links</h2>
            <p className={styles.devNavSubtitle}>
              Navigate to different pages and components
            </p>
          </div>

          <ul className={styles.devNavList}>
            {navLinks.map((link) => (
              <li key={link.to} className={styles.devNavItem}>
                <Link to={link.to} className={styles.devNavLink}>
                  <span className={styles.linkLabel}>{link.label}</span>
                  <span className={styles.linkDescription}>
                    {link.description}
                  </span>
                  <span className={styles.linkArrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <PopularTools />
      <InstructorCTABanner />
    </main>
  );
}

export default Home;