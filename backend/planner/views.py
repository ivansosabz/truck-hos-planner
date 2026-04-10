from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(["GET"])
def health_check(request):
    return Response(
        {"status": "ok", "message": "Backend is working"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def plan_trip(request):
    data = request.data

    current_location = data.get("current_location")
    pickup_location = data.get("pickup_location")
    dropoff_location = data.get("dropoff_location")
    current_cycle_used_hours = data.get("current_cycle_used_hours")

    return Response(
        {
            "message": "Trip planning endpoint working",
            "received_data": {
                "current_location": current_location,
                "pickup_location": pickup_location,
                "dropoff_location": dropoff_location,
                "current_cycle_used_hours": current_cycle_used_hours,
            },
            "mock_result": {
                "total_distance_miles": 1250,
                "estimated_drive_hours": 19.5,
                "fuel_stops": 1,
                "rest_breaks": 2,
                "daily_logs_needed": 2,
            },
        },
        status=status.HTTP_200_OK,
    )
