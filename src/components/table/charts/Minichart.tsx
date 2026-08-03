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
    type ScriptableContext,
} from "chart.js";
import {Line} from "react-chartjs-2";
import type {WatchlistSecurity} from "../../../types/watchlist.ts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
);

function createAreaGradient(
    context: ScriptableContext<"line">,
    previousClose: number,
    rgb: string,
) {
    const {chart} = context;
    const {chartArea, ctx, scales} = chart;
    const yScale = scales.y;

    if (!chartArea || !yScale) {
        return `rgba(${rgb}, 0.18)`;
    }

    const chartHeight = chartArea.bottom - chartArea.top;
    const baselineY = yScale.getPixelForValue(previousClose);

    const baselineStop = Math.max(
        0,
        Math.min(1, (baselineY - chartArea.top) / chartHeight),
    );

    const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom,
    );

    const color = `rgba(${rgb}, 0.3)`;
    const transparent = `rgba(${rgb}, 0)`;

    if (baselineStop <= 0) {
        gradient.addColorStop(0, transparent);
        gradient.addColorStop(1, color);

        return gradient;
    }

    if (baselineStop >= 1) {
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, transparent);

        return gradient;
    }

    gradient.addColorStop(0, color);
    gradient.addColorStop(baselineStop, transparent);
    gradient.addColorStop(1, color);

    return gradient;
}

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
            style={{
                position: "relative",
                width: 120,
                height: 34,
                marginInline: "auto",
            }}
        >
            <Line data={data} options={options}/>
        </div>
    );
}