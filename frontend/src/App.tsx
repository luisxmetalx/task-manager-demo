import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import TaskForm from "./pages/TaskForm";
import { getToken } from "./auth";

function Private({ children }: { children: JSX.Element }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Private>
              <Tasks />
            </Private>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <Private>
              <TaskForm mode="create" />
            </Private>
          }
        />
        <Route
          path="/tasks/:id/edit"
          element={
            <Private>
              <TaskForm mode="edit" />
            </Private>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}