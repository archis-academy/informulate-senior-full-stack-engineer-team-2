import { useState, useCallback } from "react";
import PriceFilter, { type PriceFilterState } from "@components/price-filter/price-filter";
import styles from "./filter-demo.module.scss";

export default function FilterDemoPage() {
  const [filterState, setFilterState] = useState<PriceFilterState | null>(null);

  const handleFilterChange = useCallback((filter: PriceFilterState) => {
    setFilterState(filter);
  }, []);

  return (
    <main className={styles.demoPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Price Filter Demo</h1>

        <div className={styles.content}>
          <div className={styles.filterSection}>
            <PriceFilter
              minPrice={0}
              maxPrice={1000}
              initialMin={100}
              initialMax={800}
              currency="$"
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className={styles.stateSection}>
            <h2>Current Filter State:</h2>
            {filterState && (
              <pre className={styles.stateDisplay}>
                {JSON.stringify(filterState, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
