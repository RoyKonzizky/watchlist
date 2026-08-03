import type {ScriptableContext} from "chart.js";

export function createAreaGradient(
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