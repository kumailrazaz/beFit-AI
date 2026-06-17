import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BodyScanPage from './pages/BodyScan';
import MealScanPage from './pages/MealScan';
import GroceryScanPage from './pages/GroceryScan';
import MealPlannerPage from './pages/MealPlanner';
import RecoveryPage from './pages/Recovery';
import ChatPage from './pages/Chat';
import NotFoundPage from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — no layout wrapper */}
        <Route path="/" element={<LandingPage />} />

        {/* App routes — wrapped in sidebar/header layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/body-scan" element={<BodyScanPage />} />
          <Route path="/meal-scan" element={<MealScanPage />} />
          <Route path="/grocery" element={<GroceryScanPage />} />
          <Route path="/planner" element={<MealPlannerPage />} />
          <Route path="/recovery" element={<RecoveryPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        {/* 404 */}
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
