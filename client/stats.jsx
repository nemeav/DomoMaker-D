const helper = require('./helper.js');
const React = require('react');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const StatsList = (props) => {
  const [stats, setStats] = useState(props.stats);

  useEffect(() => {
    const loadStatsFromServer = async () => {
        const response = await fetch('/stats');
        const data = await response.json();
        setStats(data.stats);
    };
    loadStatsFromServer();
  }, [props.stats]);

  if (stats.length === 0) {
    return (
        <div className='statsList'>No stats yet!</div> //unsure about error
    );
  }

  return (
    <div className="statsDiv">
        <ul>
          <li>Age 1-10: {(stats.stat1 * 100).toFixed(2)}%</li>
          <li>Age 11-20: {(stats.stat2 * 100).toFixed(2)}%</li>
          <li>Age 21-30: {(stats.stat3 * 100).toFixed(2)}%</li>
          <li>Age 31-40: {(stats.stat4 * 100).toFixed(2)}%</li>
          <li>Age 41-50: {(stats.stat5 * 100).toFixed(2)}%</li>
          <li>Age 51+: {(stats.stat6 * 100).toFixed(2)}%</li>
        </ul>
    </div>
  );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<StatsList />);
}

window.onload = init;

/**
 * //Dev note: attempts were made but i am tired and i
 * dont understand how to route between 20M files and all
 * the imported services.
 */