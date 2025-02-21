import { NavLink, Outlet } from "react-router-dom";
import { useGlobal } from "./GlobalContext.jsx";
import "./Layout.css";

export default function Layout() {
    return (
        <>
            <header className="main-header">
                <nav className="main-nav">
                    <NavLink to="/" className="nav-link">Hem</NavLink>
                    <NavLink to="/match" className="nav-link">Match</NavLink>
                    <NavLink to="/players" className="nav-link">Spelare</NavLink>
                    <NavLink to="/statistics" className="nav-link">Statistik</NavLink>
                </nav>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </>
    );
}