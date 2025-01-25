"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useSearchParams, usePathname,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string"

const SearchForm = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTitle = searchParams.get("title") || ""; 
  const [value, setValue] = useState(initialTitle);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const currentParams = qs.parse(searchParams.toString());
    const updatedParams = { ...currentParams, title: debouncedValue };
    const url = qs.stringifyUrl(
      { url: pathname, query: updatedParams },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, [debouncedValue, searchParams, pathname, router]);

  useEffect(() => {
    setValue(initialTitle);
  }, [initialTitle]);


  return (
    <div className="flex items-center justify-center w-full h-[60px]">
      <div className="relative w-full max-w-3xl">
        <Search
          className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-slate-600"
        />
        <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 rounded-full hover:ring-green-600 hover:bg-green-100 focus-visible:ring-green-600 focus:bg-green-100 transition"
        placeholder="Szukaj..."
        />
      </div>
    </div>
  );
};

export default SearchForm;
