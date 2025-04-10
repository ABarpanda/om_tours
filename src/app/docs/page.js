import React from 'react'

const page = () => {
  return (
    <div>
        <h1>Travel Itinerary API Documentation</h1>
        
        <h2>Rules:</h2>
        <ul>
            <li>Dates should be in <code>YYYY-MM-DD</code> format only.</li>
        </ul>

        <h2>API Overview:</h2>
        <p>
            This API generates a travel itinerary with budget allocation based on user-provided parameters.
        </p>

        <h2>Endpoint:</h2>
        <code>GET /itinerary/</code>
        
        <h2>Parameters:</h2>
        <ul>
            <li><strong>destination</strong>: Destination city/country (string)</li>
            <li><strong>start_date</strong>: Trip start date (YYYY-MM-DD)</li>
            <li><strong>end_date</strong>: Trip end date (YYYY-MM-DD)</li>
            <li><strong>number_of_people</strong>: Number of travelers (integer)</li>
            <li><strong>purpose</strong>: Trip purpose (vacation/business/pilgrimage) (string)</li>
            <li><strong>budget</strong>: Total trip budget (float)</li>
            <li><strong>location</strong>: Current location of travelers (string)</li>
            <li><strong>mode_of_transport</strong>: Preferred transport mode (string)</li>
        </ul>

        <h2>Response:</h2>
        <p>The response is a JSON object containing the itinerary and budget allocation.</p>

        <h3>Example Response:</h3>
        <pre>
        {JSON.stringify({
            "trip_summary": {
                "from": "Mumbai",
                "to": "Goa",
                "travel_dates": ["2025-04-01", "2025-04-10"],
                "total_budget": 20000.0,
                "currency": "INR"
            },
            "transport": {
                "selected": "flight",
                "options": [{"mode": "flight", "cost": 8000, "duration": "1h30m"}]
            },
            "budget": {
                "transport": 8000.0,
                "accommodation": 6000.0,
                "activities": 4000.0,
                "food": 4000.0,
                "contingency": 2000.0,
                "remaining": 0.0
            },
            "itinerary": [
                {"day": 1, "date": "2025-04-01", "activities": ["Beach exploration", "Museum", "Waterfall"], "transport_used": "taxi"},
                {"day": 2, "date": "2025-04-02", "activities": ["Beach volleyball", "Snorkeling", "Dinner at a local restaurant"], "transport_used": "bus"}
            ]
        }, null, 2)}
        </pre>
    </div>
  )
}

export default page