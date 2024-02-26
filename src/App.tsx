import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GPXMapPage from "./components/GPXMapPage";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import { ProtectedRoute } from "./Auth/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import PublicRoute from "./Auth/PublicRoute";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Wrap all routes that require authentication with ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/gpxmap/:document_id" element={<GPXMapPage />} />
              <Route path="/gpxmap" element={<NotFoundPage />} />
              {/* Add other protected routes here */}
            </Route>

            {/* This catch-all route can stay outside the ProtectedRoute if you want it to be accessible without authentication */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

const Home = () => {
  return (
    <div>
      <HomePage />
    </div>
  );
};

export default App;
