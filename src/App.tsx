import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GPXMapPage from "./components/GPXMapPage";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gpxmap" element={<GPXMapPage />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

const Home = () => {
  return (
    <div>
      <GPXMapPage />
    </div>
  );
};

export default App;
