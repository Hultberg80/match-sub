import { useState, useEffect } from 'react';


const Match = () => {
  const [matchTime, setMatchTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState(1);
  const [activePlayers, setActivePlayers] = useState([]);
  const [benchPlayers, setBenchPlayers] = useState([]);
  const [isSubstituting, setIsSubstituting] = useState(false);
  
  useEffect(() => {
    let interval;
    if (isRunning && matchTime > 0) {
      interval = setInterval(() => {
        setMatchTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, matchTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayerSubstitution = (player, isActive) => {
    if (!isSubstituting) return;
    
    if (isActive) {
      setActivePlayers(prev => prev.filter(p => p.id !== player.id));
      setBenchPlayers(prev => [...prev, { ...player, status: 'yellow' }]);
    } else {
      if (activePlayers.length < 7) {
        setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
        setActivePlayers(prev => [...prev, { ...player, status: 'green' }]);
      }
    }
  };

  return (
    <div className="match-container">
      <div className="timer-section">
        <div className="timer-display">{formatTime(matchTime)}</div>
        <div className="timer-controls">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="timer-button"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => setIsSubstituting(!isSubstituting)}
            className={`substitute-button ${isSubstituting ? 'active' : ''}`}
          >
            Byt Spelare
          </button>
        </div>
      </div>

      <div className="active-players-section">
        <h2 className="section-title">Aktiva Spelare</h2>
        <div className="players-grid">
          {activePlayers.map(player => (
            <PlayerCard 
              key={player.id}
              player={player}
              isActive={true}
              onClick={() => handlePlayerSubstitution(player, true)}
              isSubstituting={isSubstituting}
            />
          ))}
        </div>
      </div>

      <div className="bench-players-section">
        <h2 className="section-title">Avbytare</h2>
        <div className="players-grid">
          {benchPlayers.map(player => (
            <PlayerCard 
              key={player.id}
              player={player}
              isActive={false}
              onClick={() => handlePlayerSubstitution(player, false)}
              isSubstituting={isSubstituting}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlayerCard = ({ player, isActive, onClick, isSubstituting }) => {
  return (
    <div 
      className={`player-card ${player.status} ${isSubstituting ? 'substituting' : ''}`}
      onClick={isSubstituting ? onClick : undefined}
    >
      <h3 className="player-name">{player.firstName} {player.lastName}</h3>
      <div className="statistics-buttons">
        <StatisticButtons player={player} isActive={isActive} />
      </div>
    </div>
  );
};

const StatisticButtons = ({ player, isActive }) => {
  const handleStatistic = (type) => {
    console.log(`${type} for player ${player.id}`);
  };

  return (
    <div className="stat-buttons-container">
      <button 
        onClick={() => handleStatistic('goal')}
        className="stat-button goal"
      >
        Mål
      </button>
      <button 
        onClick={() => handleStatistic('miss')}
        className="stat-button miss"
      >
        Miss
      </button>
      <button 
        onClick={() => handleStatistic('technical')}
        className="stat-button technical"
      >
        Tekniskt
      </button>
    </div>
  );
};

export default Match;