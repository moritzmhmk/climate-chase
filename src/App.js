import React from 'react';

import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const airports = [
  {
    name: "Berlin (Schoenefeld)",
    id: "SXF",
    coordinates: [13.508611111111, 52.502777777778], // lon, lat
    destinations: ["LHR", "MEB", "ANC"]
  },
  {
    name: "London (Heathrow)",
    id: "LHR",
    coordinates: [-0.45, 51.466666666667], // lon, lat
    destinations: []
  },
  {
    name: "Melbourne",
    id: "MEB",
    coordinates: [144.86666666667, -37.7], // lon, lat
    destinations: []
  },
  {
    name: "Anchorage",
    id: "ANC",
    coordinates: [-149.98333333333, 61.166666666667], // lon, lat
    destinations: []
  }
]

const users = [
  {
    id: "P1",
    visible: true,
    airport: "SXF"
  },
  {
    id: "P2",
    visible: true,
    airport: "MEB"
  }
]

const activeUser = "P1"

function App() {
  const airportMarkers = airports.map(airport => (
    <Marker coordinates={airport.coordinates}>
      <circle r={4} fill="#CCC" />
    </Marker>
  ))

  const userMarkers = users.filter(user => user.visible).map(user => (
    <Marker coordinates={airports.find(airport => airport.id === user.airport).coordinates}>
      <circle r={4} fill={user.id === activeUser ? "#C44D58" : "#4ECDC4"} />
    </Marker>
  ))

  const activeUserAirportId = users.find(user => user.id === activeUser).airport
  const activeUserAirport = airports.find(airport => airport.id === activeUserAirportId)
  const activeUserDestinations = airports
    .filter(airport => activeUserAirport.destinations.includes(airport.id))
    .map(destination => <Line
      from={activeUserAirport.coordinates}
      to={destination.coordinates}
      stroke="#FF6B6B"
      strokeWidth={2}
      strokeLinecap="round"
    />)


  return (
    <ComposableMap width={960} height={960} projection="geoMercator" style={{background: "#556270"}}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => <Geography key={geo.rsmKey} stroke="none" fill="#AACCB1" geography={geo} />)
        }
      </Geographies>
      {activeUserDestinations}
      {airportMarkers}
      {userMarkers}
    </ComposableMap>
  );
}

export default App;
