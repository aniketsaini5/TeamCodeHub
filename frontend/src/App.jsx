"use client";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoginPopup from "./pages/LoginPage";
import CreateProject from "./pages/CreateProject";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        {!user && <LoginPopup onLogin={handleLogin} />}
        {user && <AuthenticatedApp />}
      </div>
    </Router>
  );
}

function AuthenticatedApp() {
  const location = useLocation(); // Get the current route

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/create-project" && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <main>
                <section id="Hero">
                  <Hero />
                </section>
                <section id="Features">
                  <Features />
                </section>
                <section id="About">
                  <About />
                </section>
                <section id="HowItWorks">
                  <HowItWorks />
                </section>
                <section id="Contact">
                  <Contact />
                </section>
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/create-project" element={<CreateProject />} />
      </Routes>
    </>
  );
}

export default App;