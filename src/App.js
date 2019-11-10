import React, {Component} from 'react';

import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

import UserView from './UserView'

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


const getEmissions = (from, to) => fetch(`https://www.skyscanner.net/g/chiron/api/v1/eco/average-emissions?routes=${from},${to}`, {
    headers: new Headers({
      'api-key': 'jacobs-2019'
    })
  }).then(res => res.json()).then(json => (json && json[0] && json[0].emissions) || 0)


class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      airports: [
        {
          name: "Berlin",
          id: "SXF",
          coordinates: [13.508611111111, 52.502777777778], // lon, lat
          destinations: [
            {id: "HAM"}
          ]
        },
        {
          name: "Hamburg",
          id: "HAM",
          coordinates: [9.987996048, 53.624830834], // lon, lat
          destinations: [
            {id: "BCN"},
            {id: "FRA"}
          ]
        },
        {
          name: "London",
          id: "LHR",
          coordinates: [-0.45, 51.466666666667], // lon, lat
          destinations: [
            {id: "HAM"},
            {id: "BCN"}
          ]
        },
        {
          name: "Frankfurt",
          id: "FRA",
          coordinates: [8.5, 50], // lon, lat
          destinations: [
            {id: "HAM"},
            {id: "JFK"},
            {id: "LHR"}
          ]
        },
        {
          name: "Barcelona",
          id: "BCN",
          coordinates: [2.0833333333333, 41.3],
          destinations: [
            {id: "HAM"}
          ]
        },
        {
          name: "New York",
          id: "JFK",
          coordinates: [-73.783333333333, 40.633333333333],
          destinations: [
            {id: "FRA"}
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
          airport: "LHR"
        },
        {
          id: "Good 3",
          visible: true,
          airport: "HAM"
        },
        {
          id: "Evil",
          visible: false,
          evil: true,
          airport: "LHR"
        }
      ],
      activeUser: "Evil",
      totalEmissions: 0,
      showOverlay: true
    }

    this.state.airports.forEach(airport => {
      airport.destinations.forEach((destination, index) => {
        getEmissions(airport.id, destination.id)
          .then(emissions => this.setState(
            {
              ...this.state,
              airports: this.state.airports.map(_a => _a.id === airport.id ? ({
                ..._a,
                destinations: _a.destinations.map(_d => _d.id === destination.id ? ({
                  ..._d,
                  emissions
                }) : _d)
              }) : _a)
            }
          ))
      })
    })
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

    const percentEmissions = this.state.totalEmissions / 5000

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
      <ComposableMap width={600} height={300} projectionConfig={{ scale: 70 }}  projection="geoMercator" style={{background: "#556270"}}>
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
