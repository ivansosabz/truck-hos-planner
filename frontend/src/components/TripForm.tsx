import React, { useState } from "react";
import { planTrip } from "../api/tripApi";
import { TripFormData, TripPlanResponse } from "../types/trip";
import TripMap from "./TripMap";
import ELDLog from "./ELDLog";

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
                        <strong>Total Distance:</strong> {result.route_summary.total_distance_miles} miles
                    </p>
                    <p>
                        <strong>Estimated Drive Hours:</strong> {result.route_summary.estimated_drive_hours}
                    </p>

                    <TripMap tripResult={result} />

                    <h3>HOS Plan</h3>
                    {result.hos_plan.map((day) => (
                        <div key={day.day} style={{ marginTop: "20px" }}>
                            <h4>Day {day.day}</h4>

                            <ul>
                                {day.segments.map((seg, index) => (
                                    <li key={index}>
                                        {seg.label} - {seg.hours} hours
                                    </li>
                                ))}
                            </ul>

                            <p><strong>Driving:</strong> {day.summary.driving_hours} h</p>
                            <p><strong>On Duty (Not Driving):</strong> {day.summary.on_duty_not_driving_hours} h</p>
                            <p><strong>Break:</strong> {day.summary.break_hours} h</p>
                            <p><strong>Off Duty:</strong> {day.summary.off_duty_hours} h</p>

                            <ELDLog dayPlan={day} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TripForm;