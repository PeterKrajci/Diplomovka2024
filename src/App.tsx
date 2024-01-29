import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GPXMapPage from "./components/GPXMapPage";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gpxmap/:document_id" element={<GPXMapPage />} />
            <Route path="/gpxmap" element={<NotFoundPage />} />
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
