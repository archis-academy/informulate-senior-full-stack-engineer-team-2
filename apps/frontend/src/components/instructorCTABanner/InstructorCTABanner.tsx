import { Link } from "react-router-dom"; 
import styles from "./instructor-cta-banner.module.scss";
import Icon from "@components/icon/icon";

interface Step {
  number: 1 | 2 | 3 | 4;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: "Apply to become instructor" },
  { number: 2, title: "Build & edit your profile" },
  { number: 3, title: "Create your new course" },
  { number: 4, title: "Start teaching & earning" },
];

export default function InstructorCTABanner() {
  return (
    <section className={styles.bannerWrapper} aria-labelledby="cta-heading">
      <div className={styles.leftColumn}>
        <div className={styles.leftContent}>
          <h2 id="cta-heading" className={styles.title}>
            Become an instructor
          </h2>
          <p className={styles.description}>
            Instructors from around the world teach millions of students on our
            platform. We provide the tools and skills to teach what you love.
          </p>
          <Link to="/instructor-application" className={styles.ctaButton}>
            <span className={styles.buttonText}>Start Teaching</span>
            <span className={styles.buttonIcon} aria-hidden="true">
              <Icon name="arrow-right" />
            </span>
          </Link>
        </div>

        <div className={styles.imageWrapper}>
          <img
            src="/instructor-pointing.png"
            alt="Instructor pointing towards steps"
            className={styles.instructorImage}
          />
        </div>
      </div>

      {/* RIGHT COLUMN  */}
      <div className={styles.rightColumn}>
        <h2 className={styles.stepsTitle}>Your teaching & earning steps</h2>
        <ul className={styles.stepsGrid}>
          {steps.map((step) => (
            <li
              key={step.number}
              className={`${styles.stepItem} ${
                styles[`stepItem--${step.number}`]
              }`}
            >
              <span className={styles.stepCircle}>{step.number}</span>
              <span className={styles.stepLabel}>{step.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
