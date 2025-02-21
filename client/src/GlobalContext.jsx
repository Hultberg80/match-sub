import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

function GlobalProvider({ children }) {
    const [players, setPlayers] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matchStatistics, setMatchStatistics] = useState({});

    // Hämta alla spelare när appen startar
    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await fetch('api/players');
            const data = await response.json();
            setPlayers(data);
        } catch (error) {
            console.error('Failed to fetch players:', error);
        }
    };

    const startMatch = async (opponent) => {
        try {
            const response = await fetch('api/matches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ opponent }),
            });
            const match = await response.json();
            setCurrentMatch(match);
        } catch (error) {
            console.error('Failed to start match:', error);
        }
    };

    const updatePlayerStatistic = async (playerId, matchId, statisticType, period) => {
        try {
            await fetch('api/statistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerMatchId: playerId,
                    type: statisticType,
                    period: period
                }),
            });

            // Uppdatera lokal statistik
            setMatchStatistics(prev => ({
                ...prev,
                [playerId]: {
                    ...prev[playerId],
                    [statisticType]: (prev[playerId]?.[statisticType] || 0) + 1
                }
            }));
        } catch (error) {
            console.error('Failed to update statistics:', error);
        }
    };

    const updatePlayerTime = async (playerId, matchId, period, time) => {
        try {
            await fetch(`api/playertime/${playerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    period,
                    time
                }),
            });
        } catch (error) {
            console.error('Failed to update player time:', error);
        }
    };

    return (
        <GlobalContext.Provider value={{
            players,
            currentMatch,
            matchStatistics,
            startMatch,
            updatePlayerStatistic,
            updatePlayerTime,
            fetchPlayers
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

// Custom hook för enklare användning av context
const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};

export { GlobalProvider, useGlobal };