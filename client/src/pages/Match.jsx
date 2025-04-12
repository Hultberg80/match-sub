import { useState, useEffect } from 'react';
import { useGlobal } from '../GlobalContext.jsx';

const Match = () => {
  const { players, updatePlayerStatistic, currentMatch, startMatch, updatePlayerTime } = useGlobal();
  const [matchTime, setMatchTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState(1);
  const [activePlayers, setActivePlayers] = useState([]);
  const [benchPlayers, setBenchPlayers] = useState([]);
  const [isSubstituting, setIsSubstituting] = useState(false);
  const [opponent, setOpponent] = useState('');
  
  // Ladda spelare från GlobalContext när komponenten mountas
  useEffect(() => {
    if (players.length > 0 && activePlayers.length === 0 && benchPlayers.length === 0) {
      // Sätt de första 7 spelarna som aktiva (eller färre om det finns färre spelare), resten på bänken
      const maxActive = Math.min(7, players.length);
      const active = players.slice(0, maxActive).map(p => ({ ...p, status: 'green' }));
      const bench = players.slice(maxActive).map(p => ({ ...p, status: 'yellow' }));
      setActivePlayers(active);
      setBenchPlayers(bench);
    }
  }, [players, activePlayers.length, benchPlayers.length]);

  // Hantera matchklockan
  useEffect(() => {
    let interval;
    if (isRunning && matchTime > 0) {
      interval = setInterval(() => {
        setMatchTime(prev => prev - 1);
      }, 1000);
    } else if (matchTime === 0) {
      // Perioden är slut
      handlePeriodEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, matchTime]);

  // Formatera tiden för visning (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Starta en ny match
  const handleStartNewMatch = () => {
    if (opponent.trim()) {
      startMatch(opponent);
      setPeriod(1);
      setMatchTime(25 * 60); // 25 minuter
    }
  };

  // Hantera spelarbyte
  const handlePlayerSubstitution = (player, isActive) => {
    if (!isSubstituting) return;
    
    if (isActive) {
      // Flytta spelare från aktiv till bänk
      setActivePlayers(prev => prev.filter(p => p.id !== player.id));
      setBenchPlayers(prev => [...prev, { ...player, status: 'yellow' }]);
      
      // Uppdatera spelarens tid om en match pågår
      if (currentMatch) {
        updatePlayerTime(player.id, currentMatch.id, period, matchTime);
      }
    } else {
      // Flytta spelare från bänk till aktiv om det finns plats (max 7 aktiva)
      if (activePlayers.length < 7) {
        setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
        setActivePlayers(prev => [...prev, { ...player, status: 'green' }]);
      }
    }
  };

  // Hantera när en period är slut
  const handlePeriodEnd = () => {
    setIsRunning(false);
    if (period < 2) {
      // Gå till nästa period
      setPeriod(prev => prev + 1);
      setMatchTime(25 * 60); // Återställ tiden till 25 minuter
    } else {
      // Matchen är slut
      alert('Matchen är slut!');
      // Här kan du lägga till kod för att avsluta matchen i databasen
    }
  };

  // Växla timer (start/paus)
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Växla byteläge
  const toggleSubstituting = () => {
    setIsSubstituting(!isSubstituting);
  };

  // Hantera byte av period manuellt
  const handlePeriodChange = () => {
    if (period < 2) {
      setPeriod(prev => prev + 1);
      setMatchTime(25 * 60); // Återställ tiden till 25 minuter
      setIsRunning(false);
    }
  };

  return (
    <div className="match-container">
      {!currentMatch ? (
        <div className="match-setup">
          <h2>Starta ny match</h2>
          <div className="opponent-input">
            <label htmlFor="opponent">Motståndare:</label>
            <input 
              type="text" 
              id="opponent" 
              value={opponent} 
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Ange motståndarlag" 
            />
          </div>
          <button 
            onClick={handleStartNewMatch}
            className="start-match-button"
            disabled={!opponent.trim()}
          >
            Starta match
          </button>
        </div>
      ) : (
        <>
          <div className="match-info">
            <h2>Match mot {currentMatch.opponent}</h2>
            <div className="period-display">Period: {period}/2</div>
            <button onClick={handlePeriodChange} disabled={period >= 2} className="period-button">
              Nästa period
            </button>
          </div>

          <div className="timer-section">
            <div className="timer-display">{formatTime(matchTime)}</div>
            <div className="timer-controls">
              <button 
                onClick={toggleTimer}
                className="timer-button"
              >
                {isRunning ? 'Paus' : 'Start'}
              </button>
              <button 
                onClick={toggleSubstituting}
                className={`substitute-button ${isSubstituting ? 'active' : ''}`}
              >
                Byt Spelare
              </button>
            </div>
          </div>

          <div className="active-players-section">
            <h2 className="section-title">Aktiva Spelare ({activePlayers.length}/7)</h2>
            <div className="players-grid">
              {activePlayers.map(player => (
                <PlayerCard 
                  key={player.id}
                  player={player}
                  isActive={true}
                  onClick={() => handlePlayerSubstitution(player, true)}
                  isSubstituting={isSubstituting}
                  period={period}
                  currentMatch={currentMatch}
                />
              ))}
            </div>
          </div>

          <div className="bench-players-section">
            <h2 className="section-title">Avbytare ({benchPlayers.length})</h2>
            <div className="players-grid">
              {benchPlayers.map(player => (
                <PlayerCard 
                  key={player.id}
                  player={player}
                  isActive={false}
                  onClick={() => handlePlayerSubstitution(player, false)}
                  isSubstituting={isSubstituting}
                  period={period}
                  currentMatch={currentMatch}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PlayerCard = ({ player, isActive, onClick, isSubstituting, period, currentMatch }) => {
  return (
    <div 
      className={`player-card ${player.status} ${isSubstituting ? 'substituting' : ''}`}
      onClick={isSubstituting ? onClick : undefined}
    >
      <h3 className="player-name">{player.firstName} {player.lastName}</h3>
      <div className="statistics-buttons">
        <StatisticButtons 
          player={player} 
          isActive={isActive} 
          period={period}
          currentMatch={currentMatch}
        />
      </div>
    </div>
  );
};

const StatisticButtons = ({ player, isActive, period, currentMatch }) => {
  const { updatePlayerStatistic } = useGlobal();

  const handleStatistic = (type) => {
    if (currentMatch && isActive) {
      updatePlayerStatistic(player.id, currentMatch.id, type, period);
      console.log(`${type} for player ${player.id} in period ${period}`);
    }
  };

  return (
    <div className="stat-buttons-container">
      <button 
        onClick={() => handleStatistic('goal')}
        className="stat-button goal"
        disabled={!isActive || !currentMatch}
      >
        Mål
      </button>
      <button 
        onClick={() => handleStatistic('miss')}
        className="stat-button miss"
        disabled={!isActive || !currentMatch}
      >
        Miss
      </button>
      <button 
        onClick={() => handleStatistic('technical')}
        className="stat-button technical"
        disabled={!isActive || !currentMatch}
      >
        Tekniskt
      </button>
    </div>
  );
};

export default Match;