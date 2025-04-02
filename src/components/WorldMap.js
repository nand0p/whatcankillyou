import React, { useState, useCallback } from "react";
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// World map topojson data - using local file instead of external URL
const geoUrl = "/data/topojson/world-countries.json";

const WorldMap = ({ deadlyWildlifeData }) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [activeRegion, setActiveRegion] = useState(null);

  // Helper function to match geography to our region data
  const findRegionData = useCallback((geo) => {
    if (!deadlyWildlifeData || !deadlyWildlifeData.regions) return null;
    
    const geoName = geo.properties.name;
    
    // Try to find an exact match first
    let regionData = deadlyWildlifeData.regions.find(
      region => region.name === geoName
    );
    
    // If no exact match, try to find a partial match
    if (!regionData) {
      // Match continents
      if (geoName === "United States of America") {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "North America");
      } else if (["Brazil", "Argentina", "Colombia", "Peru", "Chile", "Venezuela"].includes(geoName)) {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "South America");
      } else if (["South Africa", "Egypt", "Nigeria", "Kenya", "Morocco", "Ethiopia"].includes(geoName)) {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "Africa");
      } else if (["China", "India", "Japan", "Russia", "Indonesia", "Thailand"].includes(geoName)) {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "Asia");
      } else if (["Germany", "France", "United Kingdom", "Italy", "Spain", "Poland"].includes(geoName)) {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "Europe");
      } else if (geoName === "Australia") {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "Australia");
      } else if (geoName === "Antarctica") {
        regionData = deadlyWildlifeData.regions.find(region => region.name === "Antarctica");
      }
    }
    
    return regionData;
  }, [deadlyWildlifeData]);

  const handleMouseEnter = (geo) => {
    const regionData = findRegionData(geo);
    
    if (regionData) {
      setTooltipContent(`
        <h3>${regionData.name}</h3>
        <p>Click for details about deadly wildlife in this region</p>
      `);
    } else {
      setTooltipContent(`
        <h3>${geo.properties.name}</h3>
        <p>No data available for this region</p>
      `);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleClick = (geo) => {
    const regionData = findRegionData(geo);
    
    if (regionData) {
      setActiveRegion(regionData);
    } else {
      setActiveRegion(null);
    }
  };

  return (
    <div className="world-map-container">
      <ComposableMap data-tooltip-id="map-tooltip">
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const regionData = findRegionData(geo);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(geo)}
                    style={{
                      default: {
                        fill: regionData ? "#D6D6DA" : "#F5F5F5",
                        outline: "none"
                      },
                      hover: {
                        fill: regionData ? "#F53" : "#D6D6DA",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      <Tooltip 
        id="map-tooltip" 
        html={true}
        className="map-tooltip"
      />

      {/* Display detailed information about the active region */}
      {activeRegion && (
        <div className="region-details">
          <h2>{activeRegion.name}</h2>
          <h3>Deadly Wildlife:</h3>
          <ul>
            {activeRegion.deadliest_animals.map((animal, index) => (
              <li key={index}>
                <h4>{animal.name}</h4>
                <p><strong>Danger Type:</strong> {animal.danger_type}</p>
                <p>{animal.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
