import { NavLink, Outlet } from "react-router";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext.jsx";

export default function Layout() {

    return <>
        <header>
            <nav>
                <NavLink to="/">Home</NavLink>
            </nav>
        </header>

        <main>
            <Outlet />
        </main>
    
    </>

}