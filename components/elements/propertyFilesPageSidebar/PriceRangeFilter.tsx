import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { sp } from "@/utils/replaceNumber";
import { PriceRangeFilterProps } from "@/types/types";

export const maxRent = 200000000;
export const maxPrice = 5000000000;

const PriceRangeFilter = ({ filters, setFilters }: PriceRangeFilterProps) => {
  const step = 500000;
  return (
    <>
      {!filters.fileType || filters.fileType === "rent" ? (
        <div className="mb-2">
          <p className="text-sm font-semibold mb-1.5">اجاره:</p>
          <div className="flex items-top justify-between gap-1.5 text-xs font-medium">
            <div className="flex flex-col wrap-anywhere">
              <span>
                {!filters.maxRent || +filters.maxRent > maxRent ? "+" : null}
                {sp(
                  filters.maxRent
                    ? +filters.maxRent > maxRent
                      ? maxRent
                      : filters.maxRent
                    : maxRent
                )}
              </span>{" "}
              تومان
            </div>
            <div className="flex flex-col items-end">
              <span>{sp(filters.minRent ?? "0")}</span> تومان
            </div>
          </div>
          <RangeSlider
            className="my-2.5"
            min={0}
            max={maxRent + step}
            step={step}
            value={[Number(filters.minRent ?? 0), Number(filters.maxRent ?? maxRent + step)]}
            onInput={(e) => {
              setFilters((prev) => ({
                ...prev,
                minRent: e[0],
                maxRent: e[1],
                fileType: e[0] > 0 || e[1] < maxRent ? "rent" : prev.fileType,
              }));
            }}
          />
        </div>
      ) : null}
      <div>
        <p className="text-sm font-semibold mb-1.5">قیمت/رهن:</p>
        <div className="flex items-top justify-between gap-1.5 text-xs font-medium">
          <div className="flex flex-col wrap-anywhere">
            <span>
              {!filters.maxPrice || +filters.maxPrice > maxPrice ? "+" : null}
              {sp(
                filters.maxPrice
                  ? +filters.maxPrice > maxPrice
                    ? maxPrice
                    : filters.maxPrice
                  : maxPrice
              )}
            </span>{" "}
            تومان
          </div>
          <div className="flex flex-col items-end">
            <span>{sp(filters.minPrice ?? "0")}</span> تومان
          </div>
        </div>
        <RangeSlider
          className="my-2.5"
          min={0}
          max={maxPrice + step}
          step={step}
          value={[Number(filters.minPrice ?? 0), Number(filters.maxPrice ?? maxPrice + step)]}
          onInput={(e) => {
            setFilters((prev) => ({
              ...prev,
              minPrice: e[0],
              maxPrice: e[1],
            }));
          }}
        />
      </div>
    </>
  );
};

export default PriceRangeFilter;
