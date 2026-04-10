import React from "react";
import { HosDayPlan, HosSegment } from "../types/trip";

interface ELDLogProps {
    dayPlan: HosDayPlan;
}

const SVG_WIDTH = 900;
const SVG_HEIGHT = 260;
const LEFT_MARGIN = 140;
const RIGHT_MARGIN = 30;
const TOP_MARGIN = 30;
const ROW_HEIGHT = 40;
const HOURS_TOTAL = 24;

const STATUS_Y: Record<string, number> = {
    off_duty: TOP_MARGIN + ROW_HEIGHT * 0,
    sleeper_berth: TOP_MARGIN + ROW_HEIGHT * 1,
    driving: TOP_MARGIN + ROW_HEIGHT * 2,
    on_duty_not_driving: TOP_MARGIN + ROW_HEIGHT * 3,
    break: TOP_MARGIN + ROW_HEIGHT * 0,
};

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
    const pathParts: string[] = [];

    dayPlan.segments.forEach((segment, index) => {
        const status = getSegmentStatus(segment);
        const y = STATUS_Y[status];
        const startX = LEFT_MARGIN + currentTime * hourWidth;
        const endTime = currentTime + segment.hours;
        const endX = LEFT_MARGIN + endTime * hourWidth;

        if (index === 0) {
            pathParts.push(`M ${startX} ${y}`);
        } else {
            pathParts.push(`L ${startX} ${y}`);
        }

        pathParts.push(`L ${endX} ${y}`);
        currentTime = endTime;
    });

    const pathData = pathParts.join(" ");

    return (
        <div style={{ marginTop: "24px", overflowX: "auto" }}>
            <h4>ELD Log - Day {dayPlan.day}</h4>

            <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ background: "white", border: "1px solid #d1d5db" }}>
                <text x={20} y={STATUS_Y.off_duty + 5} fontSize="14">Off Duty</text>
                <text x={20} y={STATUS_Y.sleeper_berth + 5} fontSize="14">Sleeper Berth</text>
                <text x={20} y={STATUS_Y.driving + 5} fontSize="14">Driving</text>
                <text x={20} y={STATUS_Y.on_duty_not_driving + 5} fontSize="14">On Duty</text>

                {Array.from({ length: 25 }).map((_, hour) => {
                    const x = LEFT_MARGIN + hour * hourWidth;
                    return (
                        <g key={hour}>
                            <line
                                x1={x}
                                y1={TOP_MARGIN - 10}
                                x2={x}
                                y2={TOP_MARGIN + ROW_HEIGHT * 4}
                                stroke="#d1d5db"
                                strokeWidth={1}
                            />
                            {hour < 24 && (
                                <text x={x + 2} y={TOP_MARGIN - 14} fontSize="12" fill="#374151">
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
                            stroke="#d1d5db"
                            strokeWidth={1}
                        />
                    );
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