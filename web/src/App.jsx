import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Activities from "./components/Activities";
import Index from "./components";
import Public from "./pages/Public";
import Question from "./components/Question";
import ActivitiesQuestions from "./components/ActivitiesQuestion";
import Students from "./components/Students";
import GradeLevel from "./components/GradeLevel";
import ParticipantList from "./components/ParticipantList";
import "./css/activitiesQuestions.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Index />} />
          <Route path="index" element={<Index />} />
          <Route path="activities" element={<Activities />} />
          <Route path="questions" element={<Question />} />
          <Route path="students" element={<Students />} />
          <Route path="grade-level" element={<GradeLevel />} />
          <Route path="participants" element={<ParticipantList />} />
        </Route>
        <Route path="/public" element={<Public />} />
        <Route path="/activity/question" element={<ActivitiesQuestions />} />
      </Routes>
    </>
  );
}

export default App;
