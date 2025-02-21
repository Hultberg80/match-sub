import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import Match from "./pages/Match.jsx";
import Players from "./pages/Players.jsx";
import Statistics from "./pages/Statistics.jsx";
import { GlobalProvider } from "./GlobalContext.jsx";

export default function App() {
    return (
        <GlobalProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="match" element={<Match />} />
                        <Route path="players" element={<Players />} />
                        <Route path="statistics" element={<Statistics />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalProvider>
    );
}