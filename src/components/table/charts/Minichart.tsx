import {useMemo} from "react";
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    type ChartData,
    type ChartOptions,
} from "chart.js";
import {Line} from "react-chartjs-2";
import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {createAreaGradient} from "../../../utils/chartUtils.ts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
);

export function MiniChart({security}: {security: WatchlistSecurity}) {
    const {
        intraday,
        dailyRange,
        previousClose,
        changePercent,
    } = security;

    const up = changePercent >= 0;
    const stroke = up ? "#12864b" : "#c0292f";
    const fillRgb = up ? "18, 134, 75" : "192, 41, 47";

    const prices = useMemo(() => {
        const values = intraday.map((point) => point.price);

        if (values.length >= 2) {
            return values;
        }

        const currentPrice = values[0] ?? previousClose;

        return [previousClose, currentPrice];
    }, [intraday, previousClose]);

    const labels = useMemo(
        () => prices.map((_, index) => String(index)),
        [prices],
    );

    const {minimum, maximum} = useMemo(() => {
        const lowestPrice = Math.min(
            dailyRange.low,
            previousClose,
            ...prices,
        );

        const highestPrice = Math.max(
            dailyRange.high,
            previousClose,
            ...prices,
        );

        const span =
            highestPrice - lowestPrice ||
            Math.max(Math.abs(highestPrice) * 0.01, 1);

        return {
            minimum: lowestPrice - span * 0.08,
            maximum: highestPrice + span * 0.08,
        };
    }, [dailyRange.high, dailyRange.low, previousClose, prices]);

    const data = useMemo<ChartData<"line", number[], string>>(
        () => ({
            labels,
            datasets: [
                {
                    data: prices,
                    borderColor: stroke,
                    backgroundColor: (context) =>
                        createAreaGradient(
                            context,
                            previousClose,
                            fillRgb,
                        ),
                    borderWidth: 1.4,
                    borderCapStyle: "round",
                    borderJoinStyle: "round",
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.2,
                    fill: {
                        target: {
                            value: previousClose,
                        },
                    },
                },
                {
                    data: prices.map(() => previousClose),
                    borderColor: "#c7cbd1",
                    borderWidth: 1,
                    borderDash: [3, 3],
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                },
            ],
        }),
        [
            fillRgb,
            labels,
            previousClose,
            prices,
            stroke,
        ],
    );

    const options = useMemo<ChartOptions<"line">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            events: [],
            layout: {
                padding: 3,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
                filler: {
                    propagate: false,
                },
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                    },
                },
                y: {
                    display: false,
                    min: minimum,
                    max: maximum,
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                    },
                },
            },
        }),
        [maximum, minimum],
    );

    return (
        <div
            dir="ltr"
            className="relative ms-auto me-0 h-8.5 w-30"
        >
            <Line data={data} options={options}/>
        </div>
    );
}
