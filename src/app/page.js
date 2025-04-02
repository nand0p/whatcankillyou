"use client";

import React, { useState, useEffect } from 'react';
import WorldMap from '../components/WorldMap';
import ErrorComponent from '../components/ErrorComponent';
import '../styles/globals.css';

export default function Home() {
  const [deadlyWildlifeData, setDeadlyWildlifeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the wildlife data
    fetch('/data/deadly_wildlife_by_region.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data loaded successfully:", data);
        setDeadlyWildlifeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading wildlife data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <header>
        <h1>What Can Kill You</h1>
        <p className="subtitle">An interactive guide to deadly wildlife around the world</p>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading wildlife data...</div>
        ) : error ? (
          <ErrorComponent error={error} />
        ) : deadlyWildlifeData ? (
          <div className="map-container">
            <p className="instructions">Hover over a region to see a summary. Click for detailed information about deadly wildlife.</p>
            <WorldMap deadlyWildlifeData={deadlyWildlifeData} />
          </div>
        ) : (
          <div className="error">Failed to load wildlife data. Please try again later.</div>
        )}
      </main>

      <footer>
        <p>Data sourced from various wildlife research organizations. Created for educational purposes.</p>
      </footer>
    </div>
  );
}
