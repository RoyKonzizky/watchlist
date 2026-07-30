import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatAmount, formatSignedAmount, unitOf} from "../../../utils/formatters.ts";

interface AmountProps {
    security: WatchlistSecurity;
    value: number;
    signed?: boolean;
}

export function Amount({security, value, signed = false}: AmountProps) {
    const text = signed ? formatSignedAmount(security, value) : formatAmount(security, value);

    return (
        <span style={{whiteSpace: 'nowrap'}}>
            <bdi dir="ltr">{text}</bdi> {unitOf(security)}
        </span>
    );
}