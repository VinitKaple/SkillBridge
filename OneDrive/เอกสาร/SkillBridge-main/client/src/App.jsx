import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
