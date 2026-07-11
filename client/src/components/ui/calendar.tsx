import * as React from "react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import classNames from "@daypicker/react/style.module.css";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={classNames}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
