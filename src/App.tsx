
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/landingpage';
import { FIRTracker } from './firtracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<FIRTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
