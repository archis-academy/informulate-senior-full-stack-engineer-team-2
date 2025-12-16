import { useEffect, useRef, useState, useCallback } from "react";

export interface StickyNavItem {
  id: string;
}

export function useStickyNav(items: StickyNavItem[]) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.id ?? "");
  const [isNavSticky, setIsNavSticky] = useState<boolean>(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLElement | null>(null);
  const navPlaceholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      if (navPlaceholderRef.current) {
        const placeholderTop =
          navPlaceholderRef.current.getBoundingClientRect().top;
        setIsNavSticky(placeholderTop <= 0);
      }

      const navHeight = navRef.current?.offsetHeight || 60;
      const scrollPosition = window.scrollY + navHeight + 50;

      for (const item of items) {
        const section = sectionRefs.current[item.id];
        if (!section) continue;

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
      e.preventDefault();
      const section = sectionRefs.current[sectionId];
      if (!section) return;

      const navHeight = navRef.current?.offsetHeight || 60;
      const targetTop = section.offsetTop - navHeight - 20;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
      setActiveSection(sectionId);
    },
    []
  );

  return {
    activeSection,
    isNavSticky,
    sectionRefs,
    navRef,
    navPlaceholderRef,
    handleNavClick,
  };
}
