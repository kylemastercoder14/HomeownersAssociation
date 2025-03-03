/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/custom-calendar";

const CalendarInput = ({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: any | null;
  onChange: (value: any) => void;
  disabled?: boolean;
  placeholder?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            disabled={disabled}
            variant={"outline"}
            className={cn("shad-input", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-4 h-4 w-4" />
            {value ? (
              format(value, "PPP")
            ) : (
              <span>{placeholder || "Select a date"}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          fromYear={1900}
          toYear={new Date().getFullYear()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarInput;
