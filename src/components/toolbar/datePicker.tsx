import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useLocationStore } from "@/store/location/locationStore";
import { setUrlParams } from "@/lib/helpers/urlParamsUpdate";

const DateRangePicker = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { location, setStartDate, setEndDate, locationList, saveLocation } =
    useLocationStore();
  const [dates, setDates] = useState(
    () => `${location.start_date} to ${location.end_date}`,
  );

  useEffect(() => {
    let fp;
    if (inputRef.current) {
      fp = flatpickr(inputRef.current, {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: [location.start_date, location.end_date],
        closeOnSelect: false,
        onChange: (selectedDates, dateStr) => {
          setDates(dateStr.replace(", ", " to "));
          // Use local date to avoid off-by-one UTC bug
          const formatLocal = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };
          let start, end;
          if (Array.isArray(selectedDates) && selectedDates.length > 0) {
            if (selectedDates.length === 1) {
              start = formatLocal(selectedDates[0]);
              end = formatLocal(selectedDates[0]);
              setStartDate(start);
              setEndDate(end);
            } else {
              start = formatLocal(selectedDates[0]);
              end = formatLocal(selectedDates[1]);
              setStartDate(start);
              setEndDate(end);
            }
            // Update URL params
            setUrlParams({ start_date: start, end_date: end });

            if (locationList.find((loc) => loc.active)) {
              console.log(location.latitude);
              saveLocation();
            }
          }
        },
      });
    }
    return () => {
      if (fp) fp.destroy();
    };
    // Only run on mount
  }, []);

  return (
    <div className="max-w-md w-full flex flex-col">
      <input
        ref={inputRef}
        id="flatpickr-range"
        type="text"
        className="input max-w-sm block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
        placeholder="YYYY-MM-DD to YYYY-MM-DD"
        value={dates}
        onChange={(e) => setDates(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
};
export default DateRangePicker;
