export interface TripFormData {
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used_hours: number;
}

export interface LocationPoint {
    longitude: number;
    latitude: number;
    label: string;
}

export interface RouteGeometry {
    type: string;
    coordinates: number[][];
}

export interface TripPlanResponse {
    message: string;
    inputs: {
        current_location: string;
        pickup_location: string;
        dropoff_location: string;
        current_cycle_used_hours: number;
    };
    locations: {
        current: LocationPoint;
        pickup: LocationPoint;
        dropoff: LocationPoint;
    };
    route_summary: {
        total_distance_miles: number;
        estimated_drive_hours: number;
    };
    route_geometry: {
        to_pickup: RouteGeometry;
        to_dropoff: RouteGeometry;
    };
    hos_plan: HosDayPlan[];
}
export interface HosSegment {
    type: string;
    hours: number;
    label: string;
}

export interface HosDaySummary {
    driving_hours: number;
    on_duty_not_driving_hours: number;
    break_hours: number;
    off_duty_hours: number;
    break_taken: boolean;
}

export interface HosDayPlan {
    day: number;
    segments: HosSegment[];
    summary: HosDaySummary;
}