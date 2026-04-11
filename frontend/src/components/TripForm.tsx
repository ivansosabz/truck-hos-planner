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
        } catch (err: any) {
            console.error("Backend error:", err);

            if (err.response) {
                setError(`Backend error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
            } else if (err.request) {
                setError("No response from backend.");
            } else {
                setError(`Request error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="page-header">
                <h1>Truck HOS Planner</h1>
                <p>
                    Route planning, HOS breakdown, cycle validation, and ELD-style log visualization.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="trip-form">
                <div className="form-group">
                    <label>Current Location</label>
                    <input
                        type="text"
                        name="current_location"
                        value={formData.current_location}
                        onChange={handleChange}
                        placeholder="e.g. Dallas, TX"
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
                        placeholder="e.g. Houston, TX"
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
                        placeholder="e.g. Atlanta, GA"
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
                <div className="results-section">
                    <div className="result-card">
                        <h2>Trip Overview</h2>
                        <p><strong>Status:</strong> {result.message}</p>

                        <div className="summary-grid">
                            <div className="summary-box">
                                <span className="summary-label">Distance</span>
                                <span className="summary-value">
                                    {result.route_summary.total_distance_miles} mi
                                </span>
                            </div>

                            <div className="summary-box">
                                <span className="summary-label">Drive Time</span>
                                <span className="summary-value">
                                    {result.route_summary.estimated_drive_hours} h
                                </span>
                            </div>

                            <div className="summary-box">
                                <span className="summary-label">Fuel Stops</span>
                                <span className="summary-value">
                                    {result.fuel_stops_planned}
                                </span>
                            </div>

                            <div className="summary-box">
                                <span className="summary-label">Cycle Status</span>
                                <span
                                    className={
                                        result.cycle_summary.within_cycle_limits
                                            ? "summary-value success"
                                            : "summary-value danger"
                                    }
                                >
                                    {result.cycle_summary.within_cycle_limits ? "Within Limit" : "Over Limit"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="result-card">
                        <h2>Cycle Summary</h2>

                        <div className="cycle-grid">
                            <div><strong>Cycle Limit:</strong> {result.cycle_summary.cycle_limit_hours} h</div>
                            <div><strong>Current Used:</strong> {result.cycle_summary.current_cycle_used_hours} h</div>
                            <div><strong>Available:</strong> {result.cycle_summary.available_cycle_hours} h</div>
                            <div><strong>Trip On-Duty:</strong> {result.cycle_summary.trip_on_duty_hours} h</div>
                            <div><strong>Projected Used:</strong> {result.cycle_summary.projected_cycle_used_hours} h</div>
                        </div>
                    </div>

                    <div className="result-card">
                        <h2>Map</h2>
                        <TripMap tripResult={result} />
                    </div>

                    <div className="result-card">
                        <h2>HOS Plan</h2>

                        {result.hos_plan.map((day) => (
                            <div key={day.day} className="day-card">
                                <h3>Day {day.day}</h3>

                                <ul className="segment-list">
                                    {day.segments.map((seg, index) => (
                                        <li key={index}>
                                            <span>{seg.label}</span>
                                            <strong>{seg.hours} h</strong>
                                        </li>
                                    ))}
                                </ul>

                                <div className="day-summary-grid">
                                    <div><strong>Driving:</strong> {day.summary.driving_hours} h</div>
                                    <div><strong>On Duty:</strong> {day.summary.on_duty_not_driving_hours} h</div>
                                    <div><strong>Break:</strong> {day.summary.break_hours} h</div>
                                    <div><strong>Off Duty:</strong> {day.summary.off_duty_hours} h</div>
                                </div>

                                <ELDLog dayPlan={day} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripForm;