import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Admin from "./Pages/Admin/Admin";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
const App = () => {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
        }
       />
      {/* Protected Admin */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Admin />
            </>
          </ProtectedRoute>
        }
      />
      {/* Unknown Route */}
      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
};
export default App;