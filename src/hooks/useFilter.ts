import { useEffect, useState } from "react";
import { Filter } from "../types/Filter";

const useFilter = () => {
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    const storedFilters = localStorage.getItem("filters");
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  return { filters, setFilters };
};

export default useFilter;
