from typing import List, Dict, Any


DAY_DRIVE_LIMIT = 11
BREAK_AFTER_DRIVING_HOURS = 8
BREAK_DURATION = 0.5
OFF_DUTY_HOURS = 10
PICKUP_DURATION = 1
DROPOFF_DURATION = 1


def generate_hos_plan(total_drive_hours: float) -> List[Dict[str, Any]]:
    remaining_drive = round(total_drive_hours, 2)
    days = []
    day_number = 1
    pickup_done = False

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
            pickup_done = True

        available_drive_today = min(remaining_drive, DAY_DRIVE_LIMIT)

        if available_drive_today > BREAK_AFTER_DRIVING_HOURS:
            first_block = BREAK_AFTER_DRIVING_HOURS
            second_block = round(available_drive_today - BREAK_AFTER_DRIVING_HOURS, 2)

            day["segments"].append(
                {"type": "driving", "hours": first_block, "label": "Driving"}
            )
            driving_used_today += first_block

            day["segments"].append(
                {"type": "break", "hours": BREAK_DURATION, "label": "30-minute break"}
            )
            break_taken = True

            if second_block > 0:
                day["segments"].append(
                    {"type": "driving", "hours": second_block, "label": "Driving"}
                )
                driving_used_today += second_block
        else:
            day["segments"].append(
                {"type": "driving", "hours": available_drive_today, "label": "Driving"}
            )
            driving_used_today += available_drive_today

        remaining_drive = round(remaining_drive - driving_used_today, 2)

        if remaining_drive <= 0:
            day["segments"].append(
                {
                    "type": "on_duty_not_driving",
                    "hours": DROPOFF_DURATION,
                    "label": "Dropoff",
                }
            )

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

    return days
