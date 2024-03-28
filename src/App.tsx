import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GPXMapPage from "./components/GPXMapPage";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import { ProtectedRoute } from "./Auth/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import PublicRoute from "./Auth/PublicRoute";
import SignUpPage from "./components/SignUpPage";

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
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              }
            />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/gpxmap" element={<GPXMapPage />} />
            </Route>

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
