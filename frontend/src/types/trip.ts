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
    fuel_stops_planned: number;
    cycle_summary: CycleSummary;
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
export interface CycleSummary {
    cycle_limit_hours: number;
    current_cycle_used_hours: number;
    available_cycle_hours: number;
    trip_on_duty_hours: number;
    projected_cycle_used_hours: number;
    within_cycle_limits: boolean;
}