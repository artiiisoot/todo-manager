import { Routes, Route } from "react-router-dom";

import { AppLayout } from "./layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { CalendarPage } from "./pages/CalendarPage";
import { WritePage } from "./pages/WritePage";
import { TasksPage } from "./pages/TasksPage";
import { DetailPage } from "./pages/DetailPage";
import { DataBase } from "./pages/DataBase";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Route>

      <Route path="write" element={<WritePage />} />
      <Route path="detail" element={<DetailPage />} />
      <Route path="test" element={<DataBase />} />
    </Routes>
  );
}

export default App;
