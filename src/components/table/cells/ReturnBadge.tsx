import {badgeToneClass, formatPercent} from "../../../utils/formatters.ts";

export function ReturnBadge({value}: {value: number}) {
    return (
        <span
            dir="ltr"
            className={`inline-block min-w-[68px] whitespace-nowrap rounded-md px-2.5 py-1 text-center text-[13px] ${badgeToneClass(value)}`}
        >
            {formatPercent(value)}
        </span>
    );
}
