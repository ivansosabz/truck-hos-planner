export interface TripFormData {
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used_hours: number;
}

export interface TripPlanResponse {
    message: string;
    received_data: {
        current_location: string;
        pickup_location: string;
        dropoff_location: string;
        current_cycle_used_hours: number;
    };
    mock_result: {
        total_distance_miles: number;
        estimated_drive_hours: number;
        fuel_stops: number;
        rest_breaks: number;
        daily_logs_needed: number;
    };
}