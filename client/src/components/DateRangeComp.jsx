import { useContext, useEffect, useRef, useState } from "react";
import format from "date-fns/format";
import { addDays } from "date-fns";
import 'react-date-range/dist/styles.css'; // import styles
import 'react-date-range/dist/theme/default.css'; // import theme styles
import { DateRange } from 'react-date-range';
import { DateRangeContext } from './Contexts';

const DateRangeComp = () => {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date, 7),
            color: "rgba(250, 0, 0, 0.8)",
            key: 'selection'
        }
    ]);
    const { dates, setDates } = useContext(DateRangeContext);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        setDates([...dates, format(range[0].startDate, "yyyy-MM-dd"), format(range[0].endDate, "yyyy-MM-dd")])
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
                value={`${format(range[0].startDate, "dd.MM.yyyy")} - ${format(range[0].endDate, "dd.MM.yyyy")}`}
                readOnly
                className="inputBox"
                onClick={() => setOpen(open => !open)}
            />
            <div ref={ref}>
                {open &&
                    <DateRange
                        onChange={item => setRange([item.selection])}
                        editableDateInputs={true}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        months={2}
                        direction="vertical"
                        minDate={new Date(Date.now())}
                        className="calendarElement"
                    />}
            </div>
        </div>
    )
}

export default DateRangeComp;