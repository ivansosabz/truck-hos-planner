from typing import List, Dict, Any
import math


DAY_DRIVE_LIMIT = 11
BREAK_AFTER_DRIVING_HOURS = 8
BREAK_DURATION = 0.5
OFF_DUTY_HOURS = 10
PICKUP_DURATION = 1
DROPOFF_DURATION = 1
FUEL_STOP_DURATION = 0.5
FUEL_STOP_EVERY_MILES = 1000
CYCLE_LIMIT_HOURS = 70


def calculate_fuel_stops(total_distance_miles: float) -> int:
    if total_distance_miles <= FUEL_STOP_EVERY_MILES:
        return 0

    return math.floor(total_distance_miles / FUEL_STOP_EVERY_MILES)


def generate_hos_plan(
    total_drive_hours: float,
    total_distance_miles: float,
    current_cycle_used_hours: float,
) -> Dict[str, Any]:
    remaining_drive = round(total_drive_hours, 2)
    fuel_stops_remaining = calculate_fuel_stops(total_distance_miles)

    days = []
    day_number = 1
    pickup_done = False

    total_on_duty_hours_for_trip = 0.0

    while remaining_drive > 0:
        day = {"day": day_number, "segments": []}

        driving_used_today = 0.0
        break_taken = False

        if not pickup_done:
            day["segments"].append(
                {
                    "type": "on_duty_not_driving",
                    "hours": PICKUP_DURATION,
                    "label": "Pickup",
                }
            )
            total_on_duty_hours_for_trip += PICKUP_DURATION
            pickup_done = True

        available_drive_today = min(remaining_drive, DAY_DRIVE_LIMIT)

        if available_drive_today > BREAK_AFTER_DRIVING_HOURS:
            first_block = BREAK_AFTER_DRIVING_HOURS
            second_block = round(available_drive_today - BREAK_AFTER_DRIVING_HOURS, 2)

            day["segments"].append(
                {"type": "driving", "hours": first_block, "label": "Driving"}
            )
            driving_used_today += first_block
            total_on_duty_hours_for_trip += first_block

            day["segments"].append(
                {"type": "break", "hours": BREAK_DURATION, "label": "30-minute break"}
            )

            break_taken = True

            if fuel_stops_remaining > 0:
                day["segments"].append(
                    {
                        "type": "on_duty_not_driving",
                        "hours": FUEL_STOP_DURATION,
                        "label": "Fuel Stop",
                    }
                )
                total_on_duty_hours_for_trip += FUEL_STOP_DURATION
                fuel_stops_remaining -= 1

            if second_block > 0:
                day["segments"].append(
                    {"type": "driving", "hours": second_block, "label": "Driving"}
                )
                driving_used_today += second_block
                total_on_duty_hours_for_trip += second_block
        else:
            day["segments"].append(
                {"type": "driving", "hours": available_drive_today, "label": "Driving"}
            )
            driving_used_today += available_drive_today
            total_on_duty_hours_for_trip += available_drive_today

            if fuel_stops_remaining > 0 and available_drive_today >= 6:
                day["segments"].append(
                    {
                        "type": "on_duty_not_driving",
                        "hours": FUEL_STOP_DURATION,
                        "label": "Fuel Stop",
                    }
                )
                total_on_duty_hours_for_trip += FUEL_STOP_DURATION
                fuel_stops_remaining -= 1

        remaining_drive = round(remaining_drive - driving_used_today, 2)

        if remaining_drive <= 0:
            day["segments"].append(
                {
                    "type": "on_duty_not_driving",
                    "hours": DROPOFF_DURATION,
                    "label": "Dropoff",
                }
            )
            total_on_duty_hours_for_trip += DROPOFF_DURATION

        day["segments"].append(
            {"type": "off_duty", "hours": OFF_DUTY_HOURS, "label": "Off Duty"}
        )

        day["summary"] = {
            "driving_hours": round(
                sum(
                    seg["hours"] for seg in day["segments"] if seg["type"] == "driving"
                ),
                2,
            ),
            "on_duty_not_driving_hours": round(
                sum(
                    seg["hours"]
                    for seg in day["segments"]
                    if seg["type"] == "on_duty_not_driving"
                ),
                2,
            ),
            "break_hours": round(
                sum(seg["hours"] for seg in day["segments"] if seg["type"] == "break"),
                2,
            ),
            "off_duty_hours": round(
                sum(
                    seg["hours"] for seg in day["segments"] if seg["type"] == "off_duty"
                ),
                2,
            ),
            "break_taken": break_taken,
        }

        days.append(day)
        day_number += 1

    available_cycle_hours = round(CYCLE_LIMIT_HOURS - current_cycle_used_hours, 2)
    projected_cycle_used = round(
        current_cycle_used_hours + total_on_duty_hours_for_trip, 2
    )
    cycle_violation = projected_cycle_used > CYCLE_LIMIT_HOURS

    return {
        "days": days,
        "fuel_stops_planned": calculate_fuel_stops(total_distance_miles),
        "cycle_summary": {
            "cycle_limit_hours": CYCLE_LIMIT_HOURS,
            "current_cycle_used_hours": round(current_cycle_used_hours, 2),
            "available_cycle_hours": available_cycle_hours,
            "trip_on_duty_hours": round(total_on_duty_hours_for_trip, 2),
            "projected_cycle_used_hours": projected_cycle_used,
            "within_cycle_limits": not cycle_violation,
        },
    }
