import React, {Component} from 'react';

import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

import UserView from './UserView'

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";



class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      airports: [
        {
          name: "Berlin (Schoenefeld)",
          id: "SXF",
          coordinates: [13.508611111111, 52.502777777778], // lon, lat
          destinations: [
            {id: "LHR", emissions: 2000},
            {id: "MEB", emissions: 2000},
            {id: "ANC", emissions: 2000}
          ]
        },
        {
          name: "London (Heathrow)",
          id: "LHR",
          coordinates: [-0.45, 51.466666666667], // lon, lat
          destinations: [
            {id: "MEB", emissions: 2000}
          ]
        },
        {
          name: "Melbourne",
          id: "MEB",
          coordinates: [144.86666666667, -37.7], // lon, lat
          destinations: [
            {id: "ANC", emissions: 2000}
          ]
        },
        {
          name: "Anchorage",
          id: "ANC",
          coordinates: [-149.98333333333, 61.166666666667], // lon, lat
          destinations: [
            {id: "SXF", emissions: 2000},
            {id: "MEB", emissions: 2000}
          ]
        }
      ],
      users: [
        {
          id: "Good 1",
          visible: true,
          airport: "SXF"
        },
        {
          id: "Good 2",
          visible: true,
          airport: "MEB"
        },
        {
          id: "Good 3",
          visible: true,
          airport: "MEB"
        },
        {
          id: "Evil",
          visible: false,
          evil: true,
          airport: "MEB"
        }
      ],
      activeUser: "Evil",
      totalEmissions: 0,
      showOverlay: true
    }
  }

  travel (user, destination) {
    const newState = {
      ...this.state,
      totalEmissions: this.state.totalEmissions + destination.emissions,
      users: this.state.users.map(u => u.id === user.id ? {...u, airport: destination.id, moved: true} : u),
    }
    this.setState(newState, () => user.evil && this.nextUser())
  }

  searchAirport (userId) {
    const user = this.state.users.find(user => user.id === userId)
    const evilUser = this.state.users.find(user => user.evil)
    if (evilUser.airport === user.airport) {
      this.setState({gameOver: true})
    } else {
      this.nextUser(true)
    }
  }

  nextUser (searching) {
    const next = this.state.users[(this.state.users.findIndex(user => user.id === this.state.activeUser) + 1) % this.state.users.length].id
    this.setState({
      ...this.state,
      users: this.state.users.map(user => {
        if (user.id === next) { return {...user, moved: false}}
        if (user.id === this.state.activeUser) { return {...user, searching} }
        return user
      }),
      showOverlay: true,
      activeUser: next
    })
  }

  render () {
    const { showOverlay, airports, users } = this.state
    const activeUser = users.find(user => user.id === this.state.activeUser)

    const percentEmissions = this.state.totalEmissions / 200

    if (this.state.gameOver) {
      return <div style={{textAlign: "center"}}>
        <h1>GAME OVER - GOOD WINS</h1>
      </div>
    }

    if (percentEmissions >= 100) {
      return <div style={{textAlign: "center"}}>
        <h1>GAME OVER - EVIL WINS</h1>
      </div>
    }

    if (showOverlay) {
      return <div style={{textAlign: "center"}}>
        <h1>Pass to Player "{activeUser.id}".</h1>
        <button onClick={() => this.setState({...this.state, showOverlay: false})}>Done</button>
      </div>
    }

    const airportMarkers = airports.map(airport => (
      <Marker coordinates={airport.coordinates}>
        <circle r={4} fill="#CCC" />
      </Marker>
    ))

    const userMarkers = users.filter(user => user.visible).map(user => (
      <Marker coordinates={airports.find(airport => airport.id === user.airport).coordinates}>
        <circle r={4} fill="#4ECDC4" />
      </Marker>
    ))

    const activeUserMarker = activeUser.visible && (
      <Marker coordinates={airports.find(airport => airport.id === activeUser.airport).coordinates}>
        <circle r={4} fill="#C44D58" />
      </Marker>
    )


    const _activeUserAirport = airports.find(airport => airport.id === activeUser.airport)
    const activeUserDestinations = airports
      .filter(airport => _activeUserAirport.destinations.find(destination => destination.id === airport.id))
    const activeUserDestinationMarkers = activeUser.visible && activeUserDestinations.map(destination => <Line
        from={_activeUserAirport.coordinates}
        to={destination.coordinates}
        stroke="#FF6B6B"
        strokeWidth={2}
        strokeLinecap="round"
      />)

    return <>
      <ComposableMap width={600} height={300} projectionConfig={{ scale: 50 }}  projection="geoMercator" style={{background: "#556270"}}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => <Geography key={geo.rsmKey} stroke="none" fill="#AACCB1" geography={geo} />)
          }
        </Geographies>
        {activeUserDestinationMarkers}
        {airportMarkers}
        {userMarkers}
        {activeUserMarker}
      </ComposableMap>
      <div style={{position: "relative", width: "100%", background: "gray", margin: "20px 0px"}}>
        <div style={{width: percentEmissions+"%", height: "20px", background: "#FF6B6B"}} />
        <div style={{position: "absolute", top: 0, width: "100%", textAlign: "center"}}>CO2</div>
      </div>
      <div style={{display: "flex"}}>
        {users.map(user => (
          <UserView
            user={user}
            active={activeUser.id === user.id}
            airports={this.state.airports}
            onSearch={() => this.searchAirport(user.id)}
            onSkip={() => this.nextUser()}
            onSelect={destination => this.travel(user, destination)}
          />
        ))}
      </div>
    </>
  }
}

export default App;
