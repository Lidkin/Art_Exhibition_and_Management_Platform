import { useEffect, useRef, useState, useContext } from "react";
import { Calendar } from 'react-date-range';
import format from "date-fns/format";
import 'react-date-range/dist/styles.css'; // import styles
import 'react-date-range/dist/theme/default.css'; // import theme styles
import { DateContext } from "./Contexts";

const CalendarComp = () => {
    const { dateValue, setDateValue } = useContext(DateContext);
    const [calendar, setCalendar] = useState('');
    const [open, setOpen] = useState(false);
    const ref = useRef();

    const handleSelect = (date) => {
        setCalendar(format(date, "dd.MM.yyyy"));
        setDateValue(format(date, "yyyy-MM-dd"));
    }

    useEffect(() => {
        setCalendar(format(new Date(), "dd.MM.yyyy"));
        document.addEventListener("keydown", hideOnEscape, true);
        document.addEventListener("click", hideOnClickOutside, true);
    }, [])

    const hideOnEscape = (e) => {
        if (e.key === "Escape") setOpen(false);
    }

    const hideOnClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }

    return (
        <div className="calendarWrap">
            <input
                value={calendar}
                readOnly
                className="inputBox"
                onClick={() => setOpen(open => !open)}
                onChange={() => setDateValue(calendar)}
            />
            <div ref={ref}>
                {open && <Calendar
                    date={new Date()}
                    minDate={new Date(Date.now())}
                    onChange={handleSelect}
                    className="calendarElement" />}
            </div>
        </div>
    )
}

export default CalendarComp;