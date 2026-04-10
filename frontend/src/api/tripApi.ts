import axios from "axios";
import { TripFormData, TripPlanResponse } from "../types/trip";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const planTrip = async (
    tripData: TripFormData
): Promise<TripPlanResponse> => {
    const response = await axios.post<TripPlanResponse>(
        `${API_BASE_URL}/plan-trip/`,
        tripData
    );

    return response.data;
};