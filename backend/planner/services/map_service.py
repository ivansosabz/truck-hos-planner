import os
import requests


ORS_API_KEY = os.getenv("ORS_API_KEY")
print("Loaded ORS_API_KEY", ORS_API_KEY)  # Debugging line to confirm key is loaded

GEOCODE_URL = "https://api.openrouteservice.org/geocode/search"
# DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions/driving-car"
DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"


def geocode_location(location: str):
    headers = {"Authorization": ORS_API_KEY}

    params = {"text": location, "size": 1}

    response = requests.get(GEOCODE_URL, headers=headers, params=params, timeout=20)
    response.raise_for_status()

    data = response.json()

    features = data.get("features", [])
    if not features:
        raise ValueError(f"No coordinates found for location: {location}")

    coordinates = features[0]["geometry"]["coordinates"]  # [lng, lat]

    return {
        "longitude": coordinates[0],
        "latitude": coordinates[1],
        "label": features[0]["properties"].get("label", location),
    }


def get_route(start_coords, end_coords):
    headers = {
        "Authorization": ORS_API_KEY,
        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        "Content-Type": "application/json; charset=utf-8",
    }

    body = {
        "coordinates": [
            [start_coords["longitude"], start_coords["latitude"]],
            [end_coords["longitude"], end_coords["latitude"]],
        ]
    }

    response = requests.post(DIRECTIONS_URL, headers=headers, json=body, timeout=30)
    response.raise_for_status()

    data = response.json()

    features = data.get("features", [])
    if not features:
        raise ValueError(f"No route found. ORS response: {data}")

    route = features[0]
    summary = route["properties"]["summary"]
    geometry = route["geometry"]

    return {
        "distance_meters": summary["distance"],
        "duration_seconds": summary["duration"],
        "geometry": geometry,
    }
