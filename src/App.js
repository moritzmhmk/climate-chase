import React from 'react';

import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

function App() {
  return (
    <ComposableMap width={960} projection="geoMercator" style={{background: "#556270"}}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => <Geography key={geo.rsmKey} stroke="none" fill="#C7F464" geography={geo} />)
        }
      </Geographies>
      <Line
        from={[2.3522, 48.8566]}
        to={[-74.006, 40.7128]}
        stroke="#4ECDC4"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Marker coordinates={[-74.006, 40.7128]}>
        <circle r={4} fill="#C44D58" />
      </Marker>
    </ComposableMap>
  );
}

export default App;
