import { useGlobal } from "../GlobalContext.jsx";

export default function Statistics() {
    const { players } = useGlobal();
    
    return (
        <div className="statistics-container">
            <h1>Statistik</h1>
            <p>Här kommer statistik att visas när matcher har spelats.</p>
            
            {players.length > 0 && (
                <div className="player-statistics">
                    <h2>Spelarstatistik</h2>
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Spelare</th>
                                <th>Mål</th>
                                <th>Missar</th>
                                <th>Tekniska fel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player.id}>
                                    <td>{player.firstName} {player.lastName}</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}