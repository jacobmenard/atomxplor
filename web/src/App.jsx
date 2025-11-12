import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Activities from "./components/Activities";
import Index from "./components";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Index />} />
          <Route path="index" element={<Index />} />
          <Route path="activities" element={<Activities />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
