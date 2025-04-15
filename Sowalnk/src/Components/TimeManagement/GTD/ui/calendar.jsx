import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const buttonVariants = ({ variant }) => {
  switch (variant) {
    case "outline":
      return "border border-gray-300 rounded-md text-gray-700";
    case "ghost":
      return "hover:bg-gray-100";
    default:
      return "";
  }
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  modifiers = {},
  modifiersClassNames = {},
  ...props
}) {
  const [month, setMonth] = useState(new Date());

  const handlePreviousClick = () => {
    const previousMonth = new Date(month);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setMonth(previousMonth);
  };

  const handleNextClick = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setMonth(nextMonth);
  };

  return (
    <div className="flex flex-col">
      {/* Navigation controls - placed above the calendar */}
      <div className="flex justify-between items-center mb-2 px-3">
        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center"
          )}
          onClick={handlePreviousClick}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-sm font-medium">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center"
          )}
          onClick={handleNextClick}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        className={cn("p-3 pointer-events-auto", className)}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "hidden",
          nav: "hidden",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-purple-100 text-purple-900 font-medium",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => null,
          IconRight: () => null,
          DayContent: ({ date, activeModifiers }) => {
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                {date.getDate()}
                {activeModifiers.completed && (
                  <Check
                    className="absolute top-0 right-0 w-3 h-3 text-green-500"
                    strokeWidth={3}
                  />
                )}
                {activeModifiers.missed && (
                  <X
                    className="absolute top-0 right-0 w-3 h-3 text-red-500"
                    strokeWidth={3}
                  />
                )}
              </div>
            );
          },
          ...components,
        }}
        {...props}
      />
    </div>
  );
}

export { Calendar };
