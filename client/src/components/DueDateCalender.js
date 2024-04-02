import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function DueDateCalendar({ onDateTimeSelected }) {
  const calendarRef = useRef(null);

  useEffect(() => {
    const flatpickrInstance = flatpickr(calendarRef.current, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i', // Format for date and time
      minDate: 'today', // Set the minimum date to today
      onChange: (selectedDates, dateStr) => {
        onDateTimeSelected(dateStr);
      },
    });

    return () => {
      // Clean up the flatpickr instance when the component unmounts
      flatpickrInstance.destroy();
    };
  }, [onDateTimeSelected]);

  return <input ref={calendarRef} style={{ background: '#f1f1f1', color: 'black' }} placeholder="addDue" />;
}

export default DueDateCalendar;
