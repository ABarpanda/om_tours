"use client"
import React, { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { z } from "zod"
import ForestIcon from "@mui/icons-material/Forest"
import  FlightTakeoff  from "@mui/icons-material/FlightTakeoff"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import FlightIcon from "@mui/icons-material/Flight"
import TrainIcon from "@mui/icons-material/Train"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import EventIcon from "@mui/icons-material/Event"
import PlaceIcon from "@mui/icons-material/Place"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"

const TripPlannerPage = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [itineraryData, setItineraryData] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [newRequest, setNewRequest] = useState({
    destination: "",
    budget: "",
    startDate: "",
    endDate: "",
    noOfPeople: "",
    purpose: "",
    modeOfTravel: "road",
    yourLocation: "",
  })

  const InputSchema = z.object({
    destination: z.string().min(1, "Destination is required"),
    budget: z.string().min(1, "Budget is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    noOfPeople: z.string().min(1, "Number of people is required"),
    purpose: z.string().min(1, "Purpose is required"),
    modeOfTravel: z.string().min(1, "Mode of travel is required"),
    yourLocation: z.string().min(1, "Your location is required"),
  })

  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getTransportIcon = (mode) => {
    switch (mode.toLowerCase()) {
      case "car":
        return <DirectionsCarIcon className="text-orange-600" />
      case "flight":
        return <FlightIcon className="text-orange-600" />
      case "train":
        return <TrainIcon className="text-orange-600" />
      case "bus":
        return <DirectionsBusIcon className="text-orange-600" />
      default:
        return <DirectionsCarIcon className="text-orange-600" />
    }
  }

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const generateItinerary = async () => {
    setLoading(true)
    try {
      InputSchema.parse(newRequest)

      const apiUrl = `https://march-cohort-kr64.onrender.com/itinerary/?destination=${encodeURIComponent(
        newRequest.destination
      )}&start_date=${encodeURIComponent(
        newRequest.startDate
      )}&end_date=${encodeURIComponent(
        newRequest.endDate
      )}&number_of_people=${encodeURIComponent(
        newRequest.noOfPeople
      )}&purpose=${encodeURIComponent(
        newRequest.purpose
      )}&budget=${encodeURIComponent(
        newRequest.budget
      )}&location=${encodeURIComponent(
        newRequest.yourLocation
      )}&mode_of_transport=${encodeURIComponent(newRequest.modeOfTravel)}`

      const res = await fetch(apiUrl)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to fetch itinerary")

      setItineraryData(data)
      setFormSubmitted(true)
    } catch (err) {
      setError(err.errors ? err.errors[0].message : err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    generateItinerary()
  }

  const handleReset = () => {
    setFormSubmitted(false)
  }

  if (formSubmitted && itineraryData) {
    console.log(itineraryData)
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center p-6 md:p-10 text-black">
        <div className="flex items-center justify-center mb-6">
          <ForestIcon className="text-orange-600 text-4xl mr-2" />
          <h1 className="text-3xl font-bold text-orange-800">
            Your Travel Itinerary
          </h1>
        </div>

        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-orange-600 text-white font-medium rounded-xl shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all absolute right-4 top-4"
        >
          Log out
        </button>

        {/* Trip Summary Card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 border-b pb-2">
            Trip Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <PlaceIcon className="text-orange-600 mr-2" />
              <div>
                <p className="text-gray-600 text-sm">From</p>
                <p className="font-semibold">
                  {itineraryData.trip_summary.from}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <PlaceIcon className="text-orange-600 mr-2" />
              <div>
                <p className="text-gray-600 text-sm">To</p>
                <p className="font-semibold">{itineraryData.trip_summary.to}</p>
              </div>
            </div>

            <div className="flex items-center">
              <EventIcon className="text-orange-600 mr-2" />
              <div>
                <p className="text-gray-600 text-sm">Travel Dates</p>
                <p className="font-semibold">
                  {formatDate(itineraryData.trip_summary.travel_dates[0])} to{" "}
                  {formatDate(itineraryData.trip_summary.travel_dates[1])}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <AccountBalanceWalletIcon className="text-orange-600 mr-2" />
              <div>
                <p className="text-gray-600 text-sm">Total Budget</p>
                <p className="font-semibold">
                  {formatCurrency(
                    itineraryData.trip_summary.total_budget,
                    itineraryData.trip_summary.currency
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Options Card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 border-b pb-2">
            Transport Options
          </h2>
          <div className="mb-4">
            <p className="font-medium mb-2">
              Selected:{" "}
              <span className="font-bold capitalize">
                {itineraryData.transport.selected}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {itineraryData.transport.options.map((option, index) => (
              <div
                key={index}
                className={`border p-4 rounded-xl ${
                  option.mode === itineraryData.transport.selected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center mb-2">
                  {getTransportIcon(option.mode)}
                  <p className="ml-2 font-semibold capitalize">{option.mode}</p>
                </div>
                <p className="text-gray-700">
                  Cost: {formatCurrency(option.cost)}
                </p>
                <p className="text-gray-700">Duration: {option.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Breakdown Card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 border-b pb-2">
            Budget Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(itineraryData.budget).map(
              ([category, amount], index) => (
                <div key={index} className="flex flex-col">
                  <p className="text-gray-600 capitalize">{category}</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(amount)}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-600 h-full"
                      style={{
                        width: `${
                          (amount / itineraryData.trip_summary.total_budget) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Day-by-Day Itinerary Card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 border-b pb-2">
            Day-by-Day Itinerary
          </h2>

          <div className="space-y-6">
            {itineraryData.itinerary.map((day, index) => (
              <div
                key={index}
                className="border-l-4 border-orange-500 pl-4 py-2"
              >
                <h3 className="text-xl font-bold text-orange-700">
                  Day {day.day} - {formatDate(day.date)}
                </h3>
                <p className="text-gray-600 mb-2 mt-1">
                  Transport:{" "}
                  <span className="capitalize">{day.transport_used}</span>
                </p>
                <ul className="space-y-2 mt-4">
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2"></span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-4xl flex justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-orange-600 text-white font-medium rounded-xl shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all"
          >
            Generate New Itinerary
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-orange-600 text-white font-medium rounded-xl shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all"
          >
            Print Itinerary
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center text-black p-4">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Om Tours</h1>
        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-orange-600 text-white font-medium rounded-xl shadow-md hover:bg-orange-700 transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="w-full rounded-xl p-6 flex flex-col justify-center items-center ">
        <h2 className="text-xl font-semibold mb-4">Plan Your Trip</h2>

        {error && (
          <div className="max-w-4xl items-center justify-center flex mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-5xl flex flex-col justify-center items-center"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex flex-col">
              <label
                className="font-medium text-gray-700"
                htmlFor="destination"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={newRequest.destination}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                className="font-medium text-gray-700"
                htmlFor="yourLocation"
              >
                Your Location
              </label>
              <input
                type="text"
                id="yourLocation"
                name="yourLocation"
                value={newRequest.yourLocation}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700" htmlFor="startDate">
                Start Date (DD-MM-YYYY)
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={newRequest.startDate}
                onChange={handleInputChange}
                placeholder="DD-MM-YYYY"
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700" htmlFor="endDate">
                End Date (DD-MM-YYYY)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={newRequest.endDate}
                onChange={handleInputChange}
                placeholder="DD-MM-YYYY"
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700" htmlFor="budget">
                Budget (₹)
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={newRequest.budget}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700" htmlFor="noOfPeople">
                Number of People
              </label>
              <input
                type="number"
                id="noOfPeople"
                name="noOfPeople"
                value={newRequest.noOfPeople}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                min="1"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-medium text-gray-700" htmlFor="purpose">
                Purpose of Trip
              </label>
              <textarea
                id="purpose"
                name="purpose"
                rows="3"
                value={newRequest.purpose}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Describe the purpose of your trip..."
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-medium text-gray-700">
                Mode of Travel
              </label>
              <div className="flex space-x-6 mt-2">
                {["car", "train", "flight"].map((mode) => (
                  <label key={mode} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="modeOfTravel"
                      value={mode}
                      checked={newRequest.modeOfTravel === mode}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-600 text-white font-medium rounded-xl shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TripPlannerPage
