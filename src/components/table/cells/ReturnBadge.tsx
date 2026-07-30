import {badgeTone, formatPercent} from "../../../utils/formatters.ts";

export function ReturnBadge({value}: {value: number}) {
    return (
        <span
            dir="ltr"
            style={{
                ...badgeTone(value),
                display: 'inline-block',
                minWidth: 68,
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 13,
                textAlign: 'center',
                whiteSpace: 'nowrap',
            }}
        >
            {formatPercent(value)}
        </span>
    );
}