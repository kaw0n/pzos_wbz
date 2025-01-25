"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = ({ field }: { field: any }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "mt-2 w-full justify-start text-left font-normal rounded-full",
            !field.value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 " />
          {field.value ? (
            format(field.value, "PPP")
          ) : (
            <span>Wybierz datę</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          initialFocus
          disabled={(date) =>
            // @ts-ignore
            date < new Date()
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
