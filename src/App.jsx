// import "./App.css";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Dashboard from "./components/Dashboard/Dashboard";
// import MyOrders from "./components/MyOrders/MyOrders";
// import Login from "./components/Login/Login";
// import Register from "./components/Register/Register";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/my-orders" element={<MyOrders />} />
//     </Routes>
//   );
// }

// export default App;






import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import MyOrders from "./components/MyOrders/MyOrders";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Analytics from "./components/Analytics/Analytics";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;