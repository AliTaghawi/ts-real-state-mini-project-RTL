"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterInput from "@/elements/propertyFilesPageSidebar/FilterInput";
import FilterItems from "@/elements/propertyFilesPageSidebar/FilterItems";
import PriceRangeFilter from "@/elements/propertyFilesPageSidebar/PriceRangeFilter";
import FiltersDisplayField from "@/elements/propertyFilesPageSidebar/FiltersDisplayField";
import { categoryText, fileTypesText } from "@/utils/constants";
import { FiltersType } from "@/types/types";

const PropertyFilesPageSidebar = () => {
  const [filters, setFilters] = useState<FiltersType>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const init: any = {};
    const keys = [
      "fileType",
      "category",
      "areaMeterStart",
      "areaMeterEnd",
      "minPrice",
      "maxPrice",
      "minRent",
      "maxRent",
      "search",
      "page",
      "sort"
    ];
    for (const [key, value] of searchParams.entries()) {
      if (keys.includes(key)) {
        init[key] = value;
      }
    }
    setFilters(init);
  }, [searchParams]);

  const buildQuery = (filters: FiltersType) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (!!value) {
        params.append(key, String(value));
      }
    });
    return params.toString();
  };

  useEffect(() => {
    const query = buildQuery(filters);
    const urlQuery = searchParams.toString();
    if (query === urlQuery) return;

    const timeout = setTimeout(() => {
      console.log("set filters");
      const query = buildQuery(filters);
      router.replace(`/property-files${query ? `?${query}` : ""}`);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [filters]);

  const categoryKeys = Object.keys(categoryText) as Array<
    keyof typeof categoryText
  >;
  const fileTypesKeys = Object.keys(fileTypesText) as Array<
    keyof typeof fileTypesText
  >;

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <aside className="border-2 border-sky-400 dark:border-sky-800 rounded-lg w-[200px] min-h-[400px] p-1.5">
      <h3 className="text-center my-2 text-lg font-semibold">فیلترها</h3>
      <FiltersDisplayField filters={filters} setFilters={setFilters} />
      <div className="bg-sky-100 dark:bg-sky-950 rounded-md p-1.5">
        <FilterItems title="نوع آگهی">
          {fileTypesKeys.map((item) => (
            <FilterInput
              key={item}
              title={fileTypesText[item]}
              type="radio"
              name="fileType"
              value={item}
              data={filters}
              checking={true}
              onChange={changeHandler}
            />
          ))}
        </FilterItems>
        <FilterItems title="نوع ملک">
          {categoryKeys.map((item) => (
            <FilterInput
              key={item}
              title={categoryText[item]}
              type="radio"
              name="category"
              value={item}
              data={filters}
              checking={true}
              onChange={changeHandler}
            />
          ))}
        </FilterItems>
        <FilterItems title="متراژ">
          <FilterInput
            title="از (متر):"
            className="bg-white dark:bg-gray-950 py-0.5 px-1.5 rounded-md border border-sky-400 dark:border-sky-700 w-full"
            type="number"
            name="areaMeterStart"
            value={filters.areaMeterStart ?? ""}
            onChange={changeHandler}
          />
          <FilterInput
            title="تا (متر):"
            className="bg-white dark:bg-gray-950 py-0.5 px-1.5 rounded-md border border-sky-400 dark:border-sky-700 w-full"
            type="number"
            name="areaMeterEnd"
            value={filters.areaMeterEnd ?? ""}
            onChange={changeHandler}
          />
        </FilterItems>
        <FilterItems title="قیمت">
          <PriceRangeFilter filters={filters} setFilters={setFilters} />
        </FilterItems>
      </div>
    </aside>
  );
};

export default PropertyFilesPageSidebar;
