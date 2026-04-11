# Truck HOS Planner

Full-stack application that plans truck trips, calculates Hours of Service (HOS), validates cycle usage, and renders ELD-style daily logs.

## Live Demo

- Frontend: [https://truck-hos-planner.vercel.app/]
- Backend: [https://truck-hos-backend.onrender.com/api/health/]

## Overview

This application takes trip inputs and produces:

- Route visualization on a map
- Distance and estimated driving time
- Fuel stop planning
- Multi-day HOS breakdown
- Cycle usage validation (70h / 8 days)
- ELD-style log visualization

---

## Inputs

- Current location
- Pickup location
- Dropoff location
- Current cycle used (hours)

---

## Location Input Methodology

Locations must be entered as structured geographic text.

### Required format

```
City, State/Department, Country
```

### Valid examples

**Paraguay**

```
Coronel Oviedo, Caaguazú, Paraguay
San Lorenzo, Central, Paraguay
Encarnación, Itapúa, Paraguay
```

**United States**

```
Dallas, TX
Houston, TX
Atlanta, GA
```

### Rules

- Always include country for international locations
- Avoid ambiguous names (e.g., "Oviedo")
- Prefer full names over abbreviations
- More specific input improves routing accuracy

---

## Example Test Case

```
Current:     Coronel Oviedo, Caaguazú, Paraguay
Pickup:      San Lorenzo, Central, Paraguay
Dropoff:     Encarnación, Itapúa, Paraguay
Cycle Used:  12
```

---

## Core Logic

- Max 11 driving hours per day
- 30-minute break after 8 driving hours
- 10-hour off-duty reset
- Pickup and dropoff counted as on-duty time
- Fuel stops every 1,000 miles
- Cycle validation based on 70h / 8-day rule

---

## Tech Stack

- Frontend: React, TypeScript, Leaflet
- Backend: Django, Django REST Framework
- APIs: OpenRouteService, OpenStreetMap

---

## Notes

This project implements a simplified but operational HOS model designed for clarity, correctness, and demonstration within a coding assessment context.

---

## Author

Jesús Iván Sosa Báez