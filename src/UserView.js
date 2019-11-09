import React from 'react';

const UserView = ({id, active, destinations}) => {
  return <div style={{display: 'inline-block', width: "25%", border: "1px solid black"}}>
    <h1 style={{color: active ? 'red' : 'black'}}>{id}</h1>
    Pick your destination:
    {destinations.map(destination => <div>{destination.id}</div>)}
  </div>
}

export default UserView
