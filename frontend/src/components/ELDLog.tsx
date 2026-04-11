import React from "react";
import { HosDayPlan, HosSegment } from "../types/trip";

interface ELDLogProps {
    dayPlan: HosDayPlan;
}

const SVG_WIDTH = 980;
const SVG_HEIGHT = 300;
const LEFT_MARGIN = 170;
const RIGHT_MARGIN = 30;
const TOP_MARGIN = 40;
const ROW_HEIGHT = 45;
const HOURS_TOTAL = 24;

const STATUS_Y: Record<string, number> = {
    off_duty: TOP_MARGIN + ROW_HEIGHT * 0.5,
    sleeper_berth: TOP_MARGIN + ROW_HEIGHT * 1.5,
    driving: TOP_MARGIN + ROW_HEIGHT * 2.5,
    on_duty_not_driving: TOP_MARGIN + ROW_HEIGHT * 3.5,
    break: TOP_MARGIN + ROW_HEIGHT * 0.5,
};

const STATUS_LABELS = [
    "Off Duty",
    "Sleeper Berth",
    "Driving",
    "On Duty (Not Driving)",
];

const getSegmentStatus = (segment: HosSegment): string => {
    if (segment.type === "break") {
        return "off_duty";
    }
    return segment.type;
};

const ELDLog = ({ dayPlan }: ELDLogProps) => {
    const chartWidth = SVG_WIDTH - LEFT_MARGIN - RIGHT_MARGIN;
    const hourWidth = chartWidth / HOURS_TOTAL;

    let currentTime = 0;
    let previousY: number | null = null;

    const pathParts: string[] = [];

    dayPlan.segments.forEach((segment, index) => {
        const status = getSegmentStatus(segment);
        const currentY = STATUS_Y[status];

        const startX = LEFT_MARGIN + currentTime * hourWidth;
        const endTime = currentTime + segment.hours;
        const endX = LEFT_MARGIN + endTime * hourWidth;

        if (index === 0) {
            pathParts.push(`M ${startX} ${currentY}`);
        } else if (previousY !== null && previousY !== currentY) {
            pathParts.push(`L ${startX} ${previousY}`);
            pathParts.push(`L ${startX} ${currentY}`);
        } else {
            pathParts.push(`L ${startX} ${currentY}`);
        }

        pathParts.push(`L ${endX} ${currentY}`);

        currentTime = endTime;
        previousY = currentY;
    });

    const pathData = pathParts.join(" ");

    return (
        <div style={{ marginTop: "24px", overflowX: "auto" }}>
            <h4>ELD Log - Day {dayPlan.day}</h4>

            <svg
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                style={{
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                }}
            >
                <text x={LEFT_MARGIN} y={22} fontSize="16" fontWeight="bold">
                    Driver&apos;s Daily Log - Day {dayPlan.day}
                </text>

                {STATUS_LABELS.map((label, index) => {
                    const y = TOP_MARGIN + ROW_HEIGHT * index + ROW_HEIGHT / 2 + 5;
                    return (
                        <text
                            key={label}
                            x={20}
                            y={y}
                            fontSize="14"
                            fontWeight="bold"
                        >
                            {label}
                        </text>
                    );
                })}

                {Array.from({ length: 25 }).map((_, hour) => {
                    const x = LEFT_MARGIN + hour * hourWidth;

                    return (
                        <g key={hour}>
                            <line
                                x1={x}
                                y1={TOP_MARGIN}
                                x2={x}
                                y2={TOP_MARGIN + ROW_HEIGHT * 4}
                                stroke="#cbd5e1"
                                strokeWidth={hour < 24 ? 1 : 1.5}
                            />

                            {hour < 24 && (
                                <text
                                    x={x + 4}
                                    y={TOP_MARGIN - 10}
                                    fontSize="12"
                                    fill="#374151"
                                >
                                    {hour}
                                </text>
                            )}
                        </g>
                    );
                })}

                {Array.from({ length: 5 }).map((_, row) => {
                    const y = TOP_MARGIN + row * ROW_HEIGHT;
                    return (
                        <line
                            key={row}
                            x1={LEFT_MARGIN}
                            y1={y}
                            x2={LEFT_MARGIN + chartWidth}
                            y2={y}
                            stroke="#94a3b8"
                            strokeWidth={1}
                        />
                    );
                })}

                {Array.from({ length: 24 }).map((_, hour) => {
                    const baseX = LEFT_MARGIN + hour * hourWidth;

                    return Array.from({ length: 3 }).map((__, quarter) => {
                        const x = baseX + ((quarter + 1) * hourWidth) / 4;
                        return (
                            <line
                                key={`${hour}-${quarter}`}
                                x1={x}
                                y1={TOP_MARGIN}
                                x2={x}
                                y2={TOP_MARGIN + ROW_HEIGHT * 4}
                                stroke="#e2e8f0"
                                strokeWidth={0.8}
                            />
                        );
                    });
                })}

                <path
                    d={pathData}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default ELDLog;