import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Graphs from "./pages/Graphs.jsx";
import Explore from "./pages/Explore.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <nav className="topbar">
        <div className="brand">NYC Trips • Robust Regression</div>
        <div className="navlinks">
          <Link to="/">Home</Link>
          <Link to="/graphs">Graphs</Link>
          <Link to="/explore">Explore</Link>
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </main>
    </div>
  );
}
