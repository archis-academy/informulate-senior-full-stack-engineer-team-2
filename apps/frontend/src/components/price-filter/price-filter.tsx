import { useState, useCallback, useEffect, useRef } from "react";
import styles from "./price-filter.module.scss";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  initialMin?: number;
  initialMax?: number;
  currency?: string;
   /**
   * Called whenever the price filter state changes.
   * Must be memoized with useCallback to avoid unnecessary re-renders.
   */
  onFilterChange?: (filter: PriceFilterState) => void;
}

export interface PriceFilterState {
  minValue: number;
  maxValue: number;
  isPaid: boolean;
  isFree: boolean;
}

export default function PriceFilter({
  minPrice = 0,
  maxPrice = 1000,
  initialMin = 0,
  initialMax = 1000,
  currency = "$",
  onFilterChange,
}: PriceFilterProps) {
  const [minValue, setMinValue] = useState<number>(initialMin);
  const [maxValue, setMaxValue] = useState<number>(initialMax);

  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [isFree, setIsFree] = useState<boolean>(false);

  const [minInputValue, setMinInputValue] = useState<string>(
    initialMin.toString()
  );
  const [maxInputValue, setMaxInputValue] = useState<string>(
    initialMax.toString()
  );

  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const MIN_GAP = Math.round((maxPrice - minPrice) * 0.05);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        minValue,
        maxValue,
        isPaid,
        isFree,
      });
    }
  }, [minValue, maxValue, isPaid, isFree, onFilterChange]);

  useEffect(() => {
    setMinInputValue(minValue.toString());
    setMaxInputValue(maxValue.toString());
  }, [minValue, maxValue]);

  const getPercentage = useCallback(
    (value: number) => {
      return ((value - minPrice) / (maxPrice - minPrice)) * 100;
    },
    [minPrice, maxPrice]
  );

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value <= maxValue - MIN_GAP) {
      setMinValue(value);
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= minValue + MIN_GAP) {
      setMaxValue(value);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMinInputValue(inputValue);

    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      if (numValue >= minPrice && numValue <= maxValue - MIN_GAP) {
        setMinValue(numValue);
      }
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMaxInputValue(inputValue);

    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      if (numValue <= maxPrice && numValue >= minValue + MIN_GAP) {
        setMaxValue(numValue);
      }
    }
  };

  const handleMinInputBlur = () => {
    const numValue = parseInt(minInputValue, 10);
    if (isNaN(numValue) || numValue < minPrice) {
      setMinValue(minPrice);
      setMinInputValue(minPrice.toString());
    } else if (numValue > maxValue - MIN_GAP) {
      const correctedValue = maxValue - MIN_GAP;
      setMinValue(correctedValue);
      setMinInputValue(correctedValue.toString());
    } else {
      setMinValue(numValue);
      setMinInputValue(numValue.toString());
    }
  };

  const handleMaxInputBlur = () => {
    const numValue = parseInt(maxInputValue, 10);
    if (isNaN(numValue) || numValue > maxPrice) {
      setMaxValue(maxPrice);
      setMaxInputValue(maxPrice.toString());
    } else if (numValue < minValue + MIN_GAP) {
      const correctedValue = minValue + MIN_GAP;
      setMaxValue(correctedValue);
      setMaxInputValue(correctedValue.toString());
    } else {
      setMaxValue(numValue);
      setMaxInputValue(numValue.toString());
    }
  };

  const handlePaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsPaid(checked);

    if (!checked && !isFree) {
      setIsFree(true);
    }
  };

  const handleFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsFree(checked);

    if (!checked && !isPaid) {
      setIsPaid(true);
    }
  };

  const handleReset = () => {
    setMinValue(minPrice);
    setMaxValue(maxPrice);
    setMinInputValue(minPrice.toString());
    setMaxInputValue(maxPrice.toString());
    setIsPaid(true);
    setIsFree(false);
  };

  const isSliderDisabled = isFree && !isPaid;

  return (
    <div className={styles.priceFilter}>
      <div className={styles.header}>
        <h3 className={styles.title}>Price</h3>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
          aria-label="Reset price filter"
        >
          Reset
        </button>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isPaid}
            onChange={handlePaidChange}
            className={styles.checkbox}
          />
          <span className={styles.checkboxCustom}>
            {isPaid && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <span className={styles.checkboxText}>Paid</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isFree}
            onChange={handleFreeChange}
            className={styles.checkbox}
          />
          <span className={styles.checkboxCustom}>
            {isFree && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <span className={styles.checkboxText}>Free</span>
        </label>
      </div>

      <div
        className={`${styles.priceRangeSection} ${
          isSliderDisabled ? styles.disabled : ""
        }`}
      >
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <label htmlFor="minPrice" className={styles.inputLabel}>
              Min
            </label>
            <div className={styles.inputContainer}>
              <span className={styles.currencySymbol}>{currency}</span>
              <input
                type="number"
                id="minPrice"
                value={minInputValue}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                min={minPrice}
                max={maxPrice}
                disabled={isSliderDisabled}
                className={styles.priceInput}
                aria-label="Minimum price"
              />
            </div>
          </div>

          <span className={styles.inputSeparator}>—</span>

          <div className={styles.inputWrapper}>
            <label htmlFor="maxPrice" className={styles.inputLabel}>
              Max
            </label>
            <div className={styles.inputContainer}>
              <span className={styles.currencySymbol}>{currency}</span>
              <input
                type="number"
                id="maxPrice"
                value={maxInputValue}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                min={minPrice}
                max={maxPrice}
                disabled={isSliderDisabled}
                className={styles.priceInput}
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        <div className={styles.sliderContainer}>
          <div className={styles.sliderTrack} ref={sliderTrackRef}>
            <div
              className={styles.sliderRange}
              style={{
                left: `${getPercentage(minValue)}%`,
                width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
              }}
            />
          </div>

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={minValue}
            onChange={handleMinSliderChange}
            disabled={isSliderDisabled}
            className={`${styles.sliderThumb} ${styles.sliderThumbMin}`}
            aria-label="Minimum price slider"
          />

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={maxValue}
            onChange={handleMaxSliderChange}
            disabled={isSliderDisabled}
            className={`${styles.sliderThumb} ${styles.sliderThumbMax}`}
            aria-label="Maximum price slider"
          />
        </div>

        <div className={styles.priceLabels}>
          <span className={styles.priceLabel}>
            {currency}
            {minPrice}
          </span>
          <span className={styles.priceLabel}>
            {currency}
            {maxPrice}
          </span>
        </div>
      </div>

      <div className={styles.selectedRange}>
        <span className={styles.selectedRangeText}>
          {isSliderDisabled ? (
            "Showing free courses only"
          ) : (
            <>
              Selected: {currency}
              {minValue} — {currency}
              {maxValue}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
