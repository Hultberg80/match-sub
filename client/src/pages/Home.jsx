import { useGlobal } from "../GlobalContext.jsx";

export default function Home() {
    const { currentMatch } = useGlobal();
    
    return (
        <div className="home-container">
            <h1>Välkommen till Laghanteringssystem</h1>
            <p>Använd menyn för att navigera till olika funktioner.</p>
            {currentMatch && (
                <div className="current-match">
                    <h2>Aktiv match</h2>
                    <p>Motståndare: {currentMatch.opponent}</p>
                </div>
            )}
        </div>
    );
}