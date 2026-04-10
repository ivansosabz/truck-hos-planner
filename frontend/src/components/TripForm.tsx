import React, { useState } from "react";
import { planTrip } from "../api/tripApi";
import { TripFormData, TripPlanResponse } from "../types/trip";

const TripForm = () => {
    const [formData, setFormData] = useState<TripFormData>({
        current_location: "",
        pickup_location: "",
        dropoff_location: "",
        current_cycle_used_hours: 0,
    });

    const [result, setResult] = useState<TripPlanResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]:
                name === "current_cycle_used_hours" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await planTrip(formData);
            setResult(data);
        } catch (err) {
            setError("Error connecting to backend.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Truck HOS Planner</h1>

            <form onSubmit={handleSubmit} className="trip-form">
                <div className="form-group">
                    <label>Current Location</label>
                    <input
                        type="text"
                        name="current_location"
                        value={formData.current_location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Pickup Location</label>
                    <input
                        type="text"
                        name="pickup_location"
                        value={formData.pickup_location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Dropoff Location</label>
                    <input
                        type="text"
                        name="dropoff_location"
                        value={formData.dropoff_location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Current Cycle Used (Hours)</label>
                    <input
                        type="number"
                        name="current_cycle_used_hours"
                        value={formData.current_cycle_used_hours}
                        onChange={handleChange}
                        min="0"
                        max="70"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Planning..." : "Plan Trip"}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {result && (
                <div className="result-card">
                    <h2>Response from Backend</h2>
                    <p><strong>Message:</strong> {result.message}</p>

                    <h3>Trip Summary</h3>
                    <p>
                        <strong>Total Distance:</strong> {result.mock_result.total_distance_miles} miles
                    </p>
                    <p>
                        <strong>Estimated Drive Hours:</strong> {result.mock_result.estimated_drive_hours}
                    </p>
                    <p>
                        <strong>Fuel Stops:</strong> {result.mock_result.fuel_stops}
                    </p>
                    <p>
                        <strong>Rest Breaks:</strong> {result.mock_result.rest_breaks}
                    </p>
                    <p>
                        <strong>Daily Logs Needed:</strong> {result.mock_result.daily_logs_needed}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TripForm;