"use client";

import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import DatePicker from "@/components/DatePicker";
import { ArrowRight } from "lucide-react";

const EventSearchForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentStartDate = searchParams.get("startDate");
  const currentEndDate = searchParams.get("endDate");

  const updateUrl = (key: string, value: string | null) => {
    const currentParams = qs.parse(searchParams.toString());
    const updatedParams = { ...currentParams, [key]: value };
    const url = qs.stringifyUrl({ url: pathname, query: updatedParams }, { skipNull: true, skipEmptyString: true });
    router.push(url);
  };

  const handleDatePickerClick = (key: string) => {
    updateUrl(key, null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      <div className="flex w-full max-w-md space-x-4">
        <DatePicker
          field={{
            value: currentStartDate ? new Date(currentStartDate) : null,
            onChange: (date: Date | null) => {
              updateUrl("startDate", date ? date.toISOString() : null);
            },
          }}
          onClick={() => handleDatePickerClick("startDate")}
          className={currentStartDate ? "border-green-600 bg-green-100" : "hover:ring-green-600 hover:bg-green-100"}
        />
        <ArrowRight className="w-14 h-14" />
        <DatePicker
          field={{
            value: currentEndDate ? new Date(currentEndDate) : null,
            onChange: (date: Date | null) => {
              updateUrl("endDate", date ? date.toISOString() : null);
            },
          }}
          onClick={() => handleDatePickerClick("endDate")}
          className={currentEndDate ? "border-green-600 bg-green-100" : "hover:ring-green-600 hover:bg-green-100"}
        />
      </div>
    </div>
  );
};

export default EventSearchForm;
