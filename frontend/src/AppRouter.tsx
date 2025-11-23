import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PricingPage from './PricingPage';
import SeahoakConsole from './App';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/console" element={<SeahoakConsole />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

