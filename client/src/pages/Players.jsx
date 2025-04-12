import { useEffect, useState } from "react";
import { useGlobal } from "../GlobalContext.jsx";

export default function Players() {
    const { players, fetchPlayers } = useGlobal();
    const [newPlayer, setNewPlayer] = useState({ firstName: "", lastName: "" });

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlayer),
            });
            if (response.ok) {
                setNewPlayer({ firstName: "", lastName: "" });
                fetchPlayers();
            }
        } catch (error) {
            console.error('Failed to add player:', error);
        }
    };

    return (
        <div className="players-container">
            <h1>Spelarlista</h1>
            
            <form onSubmit={handleAddPlayer} className="add-player-form">
                <h2>Lägg till spelare</h2>
                <div className="form-group">
                    <label htmlFor="firstName">Förnamn:</label>
                    <input 
                        type="text" 
                        id="firstName"
                        value={newPlayer.firstName}
                        onChange={(e) => setNewPlayer({...newPlayer, firstName: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Efternamn:</label>
                    <input 
                        type="text" 
                        id="lastName"
                        value={newPlayer.lastName}
                        onChange={(e) => setNewPlayer({...newPlayer, lastName: e.target.value})}
                        required
                    />
                </div>
                <button type="submit" className="add-player-button">Lägg till</button>
            </form>
            
            <div className="players-list">
                <h2>Alla spelare</h2>
                {players.length === 0 ? (
                    <p>Inga spelare tillagda ännu.</p>
                ) : (
                    <ul className="player-items">
                        {players.map(player => (
                            <li key={player.id} className="player-item">
                                {player.firstName} {player.lastName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}