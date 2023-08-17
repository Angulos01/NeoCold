import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import { MissingRoute } from "./pages/MissingRoute"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AboutPage from "./pages/AboutPage"
import UserPage from "./pages/UserPage"
import TablesPage from "./pages/TablesPage"
import AlertPage from "./pages/AlertPage"
import MapView from "./pages/MapPage"

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/tables" element={<TablesPage />} />
                <Route path="/alerts" element={<AlertPage />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<MissingRoute/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router