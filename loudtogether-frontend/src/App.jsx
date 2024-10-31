import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/phone-v1/Home";
import CreateSession from "./pages/phone-v1/CreateSession";
import JoinSession from "./pages/phone-v1/JoinSession";
import Session from "./pages/phone-v1/Session";
import Views from "./pages/Views";
import { ToastContainer } from "react-toastify";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState("mobile");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const getHomeComponent = () => Home;

  return (
    <Router>
      <ToastContainer />
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>
      <Routes>
        <Route
          path="/"
          element={
            <Views currentView={currentView} setCurrentView={setCurrentView} />
          }
        >
          <Route index element={React.createElement(getHomeComponent())} />
          <Route path="create" element={<CreateSession />} />
          <Route path="join" element={<JoinSession />} />
          <Route path="/:sessionId" element={<Session />} />
          <Route path="/session/:sessionName" element={<Session />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
