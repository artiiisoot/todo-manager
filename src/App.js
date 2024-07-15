import { Routes, Route } from "react-router-dom";

import { AppLayout } from "./layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { WritePage } from "./pages/WritePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/write" element={<WritePage />} />
    </Routes>
  );
}

export default App;
