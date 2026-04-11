from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services.hos_service import generate_hos_plan

from .services.map_service import geocode_location, get_route


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

    if not current_location or not pickup_location or not dropoff_location:
        return Response(
            {"error": "All locations are required."}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        current_coords = geocode_location(current_location)
        pickup_coords = geocode_location(pickup_location)
        dropoff_coords = geocode_location(dropoff_location)

        route_to_pickup = get_route(current_coords, pickup_coords)
        route_to_dropoff = get_route(pickup_coords, dropoff_coords)

        total_distance_meters = (
            route_to_pickup["distance_meters"] + route_to_dropoff["distance_meters"]
        )
        total_duration_seconds = (
            route_to_pickup["duration_seconds"] + route_to_dropoff["duration_seconds"]
        )

        total_distance_miles = total_distance_meters / 1609.34
        estimated_drive_hours = total_duration_seconds / 3600
        hos_result = generate_hos_plan(
            total_drive_hours=estimated_drive_hours,
            total_distance_miles=total_distance_miles,
            current_cycle_used_hours=float(current_cycle_used_hours),
        )

        return Response(
            {
                "message": "Trip planned successfully",
                "inputs": {
                    "current_location": current_location,
                    "pickup_location": pickup_location,
                    "dropoff_location": dropoff_location,
                    "current_cycle_used_hours": current_cycle_used_hours,
                },
                "locations": {
                    "current": current_coords,
                    "pickup": pickup_coords,
                    "dropoff": dropoff_coords,
                },
                "route_summary": {
                    "total_distance_miles": round(total_distance_miles, 2),
                    "estimated_drive_hours": round(estimated_drive_hours, 2),
                },
                "route_geometry": {
                    "to_pickup": route_to_pickup["geometry"],
                    "to_dropoff": route_to_dropoff["geometry"],
                },
                "hos_plan": hos_result["days"],
                "fuel_stops_planned": hos_result["fuel_stops_planned"],
                "cycle_summary": hos_result["cycle_summary"],
            },
            status=status.HTTP_200_OK,
        )

    except ValueError as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as error:
        return Response(
            {"error": f"Unexpected server error: {str(error)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
