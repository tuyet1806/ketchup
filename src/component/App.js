import React from "react";
import { useState, useEffect } from "react";
import Splash from "../pages/Splash";
import Main from "../pages/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuList from "../pages/MenuList";
import MenuDetail from "../pages/MenuDetail";
import BottomNav from "./Common/BottomNav";
import GoogleMap from "../pages/GoogleMap";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route index element={<Main />} />
            <Route path="/googleMap" element={<GoogleMap />} /> {/* GoogleMap 컴포넌트 라우트 추가 */}
            <Route path="/menulist/:id" element={<MenuList />} />
            <Route path="/menulist/:id/:Food_id" element={<MenuDetail />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;