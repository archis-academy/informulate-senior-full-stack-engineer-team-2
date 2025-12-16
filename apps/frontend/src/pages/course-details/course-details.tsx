import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import VideoPlayer from "@components/video-player/video-player";
import styles from "./course-details.module.scss";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "instructor", label: "Instructor" },
  { id: "review", label: "Review" },
];

export default function CourseDetailsPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const [isNavSticky, setIsNavSticky] = useState<boolean>(false);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navRef = useRef<HTMLElement | null>(null);
  const navPlaceholderRef = useRef<HTMLDivElement | null>(null);
  // Distance in pixels from the top at which the navigation becomes active
  const SCROLL_OFFSET = 150;
  const [navHeight, setNavHeight] = useState(0);
  
  useLayoutEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);
  
  useEffect(() => {
    const handleScroll = (): void => {
      if (navPlaceholderRef.current) {
        const navTop = navPlaceholderRef.current.getBoundingClientRect().top;
        setIsNavSticky(navTop <= 0);
      }

      const scrollPosition = window.scrollY + SCROLL_OFFSET;

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
    <main className={styles.courseDetailsPage}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <h1 className={styles.pageTitle}>Course Details</h1>

        <div className={styles.videoSection}>
          <VideoPlayer
            src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
            title="Course Introduction Video"
            aspectRatio="16:9"
          />
        </div>

        <div
          ref={navPlaceholderRef}
          className={styles.navPlaceholder}
          style={{ height: isNavSticky ? navRef.current?.offsetHeight : 0 }}
        />

        <nav
          ref={navRef}
          className={`${styles.sectionNav} ${
            isNavSticky ? styles.sectionNavSticky : ""
          }`}
          aria-label="Course content navigation"
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
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className={styles.contentSections}>
          <section
            id="overview"
            ref={(el) => {
              sectionRefs.current["overview"] = el;
            }}
            className={styles.contentSection}
            aria-labelledby="overview-heading"
          >
            <h2 id="overview-heading" className={styles.sectionTitle}>
              Description
            </h2>
            <div className={styles.sectionContent}>
              <p>
                It gives you a huge self-satisfaction when you look at your work
                and say, "I made this!". I love that feeling after I'm done
                working on something. When I lean back in my chair, look at the
                final result with a smile, and have this little "spark joy"
                moment. It's especially satisfying when I know I just made
                $5,000.
              </p>
              <p>
                I do! And that's why I got into this field. Not for the love of
                Web Design, which I do now. But for the LIFESTYLE! There are
                many ways one can achieve this lifestyle. This is my way. This
                is how I achieved a lifestyle I've been fantasizing about for
                five years. And I'm going to teach you the same.
              </p>
              <p>
                Often people think Web Design is complicated. That it needs some
                creative talent or knack for computers. Sure, a lot of people
                make it very complicated. People make the simplest things
                complicated. Like most subjects taught in the universities. But
                I don't like complicated. I like easy. I like life hacks. I like
                to take the shortest and simplest route to my destination.
              </p>
              <p>
                I haven't gone to an art school or have a computer science
                degree. I'm an outsider to this field who hacked himself into
                it, somehow ending up being a sought-after professional. That's
                how I'm going to teach you Web Design. So you're not demotivated
                on your way with needless complexity. So you enjoy the process
                because it's simple and fun. So you can become a Freelance Web
                Designer in no time.
              </p>
              <p>
                For example, this is a Design course but I don't teach you
                Photoshop. Because Photoshop is needlessly complicated for Web
                Design. But people still teach it to web designers. I don't. I
                teach Figma – a simple tool that is taking over the design
                world. You will be designing a complete website within a week
                while others are still learning how to create basic layouts in
                Photoshop.
              </p>
              <p>
                Second, this is a Development course. But I don't teach you how
                to code. Because for Web Design coding is needlessly complicated
                and takes too long to learn. Instead, I teach Webflow – a tool
                that is taking over the web design world. You will be building
                complex websites within two weeks while others are still
                learning the basics of HTML & CSS.
              </p>
              <p>
                Third, this is a Freelancing course. But I don't just teach you
                how to write great proposals. I give you a winning proposal
                template. When you're done with the course, you will have a
                stunning portfolio website with portfolio pieces already in it.
                Buy this course now and take it whenever the time is right for
                you.
              </p>
            </div>
          </section>

          <section
            id="curriculum"
            ref={(el) => {
              sectionRefs.current["curriculum"] = el;
            }}
            className={styles.contentSection}
            aria-labelledby="curriculum-heading"
          >
            <h2 id="curriculum-heading" className={styles.sectionTitle}>
              Curriculum
            </h2>
            <div className={styles.sectionContent}>
              <p>
                This course includes over 50 hours of on-demand video content,
                organized into comprehensive modules that take you from beginner
                to professional.
              </p>
              <p>
                <strong>Module 1: Getting Started</strong> - Learn the
                fundamentals and set up your development environment. We'll
                cover all the tools you need to succeed.
              </p>
              <p>
                <strong>Module 2: Design Fundamentals</strong> - Master the
                principles of good design, including color theory, typography,
                and layout composition.
              </p>
              <p>
                <strong>Module 3: Figma Mastery</strong> - Become proficient in
                Figma, the industry-standard design tool. Learn to create
                wireframes, mockups, and prototypes.
              </p>
              <p>
                <strong>Module 4: Webflow Development</strong> - Build
                responsive, professional websites without writing code using
                Webflow's powerful visual development platform.
              </p>
              <p>
                <strong>Module 5: Freelancing Success</strong> - Learn how to
                find clients, write winning proposals, price your services, and
                build a sustainable freelance business.
              </p>
            </div>
          </section>

          <section
            id="instructor"
            ref={(el) => {
              sectionRefs.current["instructor"] = el;
            }}
            className={styles.contentSection}
            aria-labelledby="instructor-heading"
          >
            <h2 id="instructor-heading" className={styles.sectionTitle}>
              Instructor
            </h2>
            <div className={styles.sectionContent}>
              <p>
                <strong>John Doe</strong> is a freelance web designer and
                educator with over 10 years of experience in the industry. He
                has worked with clients ranging from small startups to Fortune
                500 companies.
              </p>
              <p>
                John started his journey just like you – with no design
                background and no coding skills. Through trial and error, he
                discovered the most efficient ways to build beautiful,
                functional websites without the complexity.
              </p>
              <p>
                Today, John runs a successful freelance business and has taught
                over 85,000 students worldwide. His teaching philosophy focuses
                on practical skills using modern tools like Figma and Webflow,
                making web design accessible to everyone.
              </p>
              <p>
                John holds a 4.9 instructor rating based on over 12,500 reviews.
                He is committed to helping his students achieve the same freedom
                and success that he has found in this field.
              </p>
            </div>
          </section>

          {/* Review Section */}
          <section
            id="review"
            ref={(el) => {
              sectionRefs.current["review"] = el;
            }}
            className={styles.contentSection}
            aria-labelledby="review-heading"
          >
            <h2 id="review-heading" className={styles.sectionTitle}>
              Student Reviews
            </h2>
            <div className={styles.sectionContent}>
              <p>
                <strong>Overall Rating: 4.8 out of 5</strong> (Based on 12,450
                reviews)
              </p>
              <p>
                <strong>Michael C.</strong> - "This course completely changed my
                career trajectory. The instructor's approach to teaching web
                design is refreshingly simple and practical. Within a month, I
                was able to land my first freelance client. Highly recommended!"
              </p>
              <p>
                <strong>Sarah W.</strong> - "I've taken many online courses, but
                this one stands out. The focus on Figma and Webflow instead of
                traditional coding makes it accessible to everyone. The
                freelancing section at the end is pure gold."
              </p>
              <p>
                <strong>David P.</strong> - "Great course overall. The content
                is well-structured and easy to follow. Perfect for beginners who
                want to break into web design without getting overwhelmed by
                complex coding."
              </p>
              <p>
                <strong>Emily R.</strong> - "As someone who always thought
                design required artistic talent, this course proved me wrong.
                The systematic approach to design principles made everything
                click. Highly recommended!"
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
