import React from 'react';

const UserView = ({user, active, airports, onSearch, onSkip, onSelect}) => {
  const currentAirport = airports.find(airport => airport.id === user.airport)

  const destinations = currentAirport.destinations.map(destination => <div onClick={() => onSelect(destination)}>{destination.id} ({destination.emissions})</div>)
  let actionText = <span>Pick your destination: {destinations}</span>
    if (user.moved) {
      actionText = <span>
        Search airport (miss out next turn)?
        <button onClick={() => onSearch()}>Yes</button>
        <button onClick={() => onSkip()}>No</button>
      </span>
    }
    if (user.searching) {
      actionText = <span>
        You missed your plane searching the airport...
        <button onClick={() => onSkip()}>Ok</button>
      </span>
    }
  return <div style={{display: 'inline-block', width: "25%", border: "1px solid black", background: !user.visible && '#B094BE'}}>
    <h1 style={{color: active ? 'red' : (user.visible ? 'black' : 'grey')}}>{user.id} {(!user.visible && !active) || <small>({user.airport})</small>}</h1>
    {active && actionText}
  </div>
}

export default UserView
