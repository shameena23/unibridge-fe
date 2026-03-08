import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyDownload from "./pages/MyDownloads";
import UploadPage from './pages/Upload';
import ResourceViewPage from "./pages/ResourceView";
import ProfilePage from "./pages/ProfilePage";
import DownloadsPage from "./pages/Downloadspage";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myuploads" element={<MyDownload />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/resourcereview/:id" element={<ResourceViewPage />} />

        <Route path="/profile" element={<ProfilePage onBack={() => window.history.back()} />} />
        <Route path="/downloads" element={<DownloadsPage />} />

        <Route path="/profile/:id" element={<ProfilePage onBack={() => window.history.back()} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;