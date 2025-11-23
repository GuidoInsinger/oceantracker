import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Sea Background */}
      <div className="sea-background"></div>
      <div className="waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Header */}
      <header>
        <div className="logo">SeaSee</div>
        <nav>
          <div className="dropdown">
            <a href="#usecases">Use cases</a>
            <div className="dropdown-content">
              <a href="#surveillance">Surveillance</a>
              <a href="#oil-platforms">Oil platforms</a>
              <a href="#wind-farms">Wind farms</a>
            </div>
          </div>
          <Link to="/pricing">Pricing</Link>
          <Link to="/console" className="login-link">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Save lives,<br />and budget</h1>
        <p className="subtitle">Get eyes in the sky, to support your search and rescue operations</p>
        <div className="cta-buttons">
          <Link to="/console" className="btn btn-primary">Get a demo</Link>
          <Link to="/console" className="btn btn-secondary">Login</Link>
        </div>
      </section>

      {/* Partners */}
      <section className="partners">
        <div className="partner-logos">
          {/* SNSM Logo */}
          <img 
            src="/new_stuff/snsm.png" 
            alt="SNSM" 
            style={{ height: '60px', width: 'auto', opacity: 0.7, transition: 'all 0.3s' }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          
          {/* US Coast Guard Logo */}
          <img 
            src="/new_stuff/US Coast Guard Flag.svg" 
            alt="US Coast Guard" 
            style={{ height: '60px', width: 'auto', opacity: 0.7, transition: 'all 0.3s' }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        </div>
      </section>

      {/* Feature: Autonomous Drones */}
      <section className="feature-section">
        <div className="feature-content">
          <h2>Autonomous drones</h2>
          <p>Install a launchpad on the coast. Drones will take off automatically without needing to pilot them. We'll manage that part.</p>
        </div>
        <div className="feature-image">
          <svg viewBox="0 0 400 400" style={{ width: '100%' }}>
            {/* Launchpad base */}
            <rect x="100" y="280" width="200" height="15" rx="3" fill="#334155"/>
            <rect x="90" y="295" width="220" height="8" rx="2" fill="#475569"/>
            
            {/* Platform */}
            <ellipse cx="200" cy="280" rx="90" ry="15" fill="#64748b"/>
            <circle cx="200" cy="280" r="70" fill="#475569"/>
            <circle cx="200" cy="280" r="50" fill="#334155"/>
            
            {/* Landing markers */}
            <circle cx="200" cy="280" r="5" fill="#fbbf24"/>
            <circle cx="170" cy="280" r="3" fill="#fbbf24" opacity="0.6"/>
            <circle cx="230" cy="280" r="3" fill="#fbbf24" opacity="0.6"/>
            <circle cx="200" cy="250" r="3" fill="#fbbf24" opacity="0.6"/>
            <circle cx="200" cy="310" r="3" fill="#fbbf24" opacity="0.6"/>
            
            {/* Drone hovering above */}
            <g transform="translate(200, 150)">
              <ellipse cx="0" cy="0" rx="40" ry="20" fill="#e2e8f0"/>
              <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#ffffff"/>
              
              {/* Arms */}
              <line x1="0" y1="0" x2="-40" y2="-25" stroke="#cbd5e1" strokeWidth="5"/>
              <line x1="0" y1="0" x2="40" y2="-25" stroke="#cbd5e1" strokeWidth="5"/>
              <line x1="0" y1="0" x2="-40" y2="25" stroke="#cbd5e1" strokeWidth="5"/>
              <line x1="0" y1="0" x2="40" y2="25" stroke="#cbd5e1" strokeWidth="5"/>
              
              {/* Propellers */}
              <circle cx="-40" cy="-25" r="18" fill="#cbd5e1" opacity="0.4"/>
              <circle cx="40" cy="-25" r="18" fill="#cbd5e1" opacity="0.4"/>
              <circle cx="-40" cy="25" r="18" fill="#cbd5e1" opacity="0.4"/>
              <circle cx="40" cy="25" r="18" fill="#cbd5e1" opacity="0.4"/>
            </g>
            
            {/* Take-off indicator */}
            <path d="M 200 220 L 195 240 M 200 220 L 205 240" stroke="#3b82f6" strokeWidth="2" opacity="0.5"/>
            <path d="M 200 200 L 195 220 M 200 200 L 205 220" stroke="#3b82f6" strokeWidth="2" opacity="0.4"/>
            <path d="M 200 180 L 195 200 M 200 180 L 205 200" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
            
            {/* Ground */}
            <ellipse cx="200" cy="310" rx="100" ry="10" fill="#94a3b8" opacity="0.3"/>
          </svg>
        </div>
      </section>

      {/* Feature: Fast Response */}
      <section className="feature-section">
        <div className="feature-content">
          <h2>Get 2x faster on scene</h2>
          <p>Drones are flying in 15 mins per hour allowing you to find your target before arriving on scene.</p>
          <Link to="/console" className="btn btn-primary">Get a demo</Link>
        </div>
        <div className="feature-image">
          <svg viewBox="0 0 400 400" style={{ width: '100%' }}>
            <defs>
              <radialGradient id="thermal" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
              </radialGradient>
            </defs>
            
            <ellipse cx="200" cy="150" rx="50" ry="25" fill="#f1f5f9"/>
            <rect x="175" y="135" width="50" height="30" rx="3" fill="#ffffff"/>
            <line x1="200" y1="150" x2="130" y2="110" stroke="#cbd5e1" strokeWidth="6"/>
            <line x1="200" y1="150" x2="270" y2="110" stroke="#cbd5e1" strokeWidth="6"/>
            <line x1="200" y1="150" x2="130" y2="190" stroke="#cbd5e1" strokeWidth="6"/>
            <line x1="200" y1="150" x2="270" y2="190" stroke="#cbd5e1" strokeWidth="6"/>
            <circle cx="130" cy="110" r="25" fill="#e2e8f0"/>
            <circle cx="270" cy="110" r="25" fill="#e2e8f0"/>
            <circle cx="130" cy="190" r="25" fill="#e2e8f0"/>
            <circle cx="270" cy="190" r="25" fill="#e2e8f0"/>
            <rect x="185" y="140" width="30" height="20" rx="2" fill="url(#thermal)"/>
            <circle cx="200" cy="320" r="30" fill="url(#thermal)" opacity="0.8"/>
            <ellipse cx="200" cy="340" rx="15" ry="25" fill="#ef4444" opacity="0.6"/>
            <line x1="200" y1="170" x2="200" y2="290" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.4"/>
          </svg>
        </div>
      </section>

      {/* Feature: Predict Location */}
      <section className="feature-section">
        <div className="feature-content">
          <h2>Predict location</h2>
          <p>Leverage streams and wind data to predict position of your target and fix evolution over time.</p>
        </div>
        <div className="feature-image">
          <svg viewBox="0 0 400 400">
            <defs>
              <linearGradient id="current" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <path d="M 50 200 Q 100 150, 150 180 T 250 160 T 350 200" stroke="url(#current)" strokeWidth="8" fill="none" opacity="0.6" strokeLinecap="round"/>
            <path d="M 30 250 Q 80 220, 140 240 T 260 220 T 370 250" stroke="url(#current)" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round"/>
            <path d="M 60 300 Q 120 270, 180 290 T 280 280 T 360 300" stroke="url(#current)" strokeWidth="8" fill="none" opacity="0.4" strokeLinecap="round"/>
            <circle cx="150" cy="180" r="50" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.3"/>
            <circle cx="150" cy="180" r="35" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.4"/>
            <circle cx="150" cy="180" r="20" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5"/>
            <circle cx="280" cy="260" r="40" stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.3"/>
            <circle cx="280" cy="260" r="28" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.4"/>
            <circle cx="320" cy="200" r="8" fill="#ef4444" opacity="0.8"/>
            <circle cx="320" cy="200" r="15" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.5"/>
            <circle cx="320" cy="200" r="22" stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.3"/>
          </svg>
        </div>
      </section>

      {/* Feature: Drop Life Jackets */}
      <section className="feature-section">
        <div className="feature-content">
          <h2>Drop life jackets</h2>
          <p>Drop life jackets to your target to boost their survival chances while you're on the way.</p>
        </div>
        <div className="feature-image">
          <svg viewBox="0 0 400 400" style={{ width: '100%' }}>
            <ellipse cx="200" cy="80" rx="50" ry="25" fill="#f1f5f9"/>
            <rect x="175" y="65" width="50" height="30" rx="3" fill="#ffffff"/>
            <line x1="200" y1="80" x2="150" y2="50" stroke="#cbd5e1" strokeWidth="6"/>
            <line x1="200" y1="80" x2="250" y2="50" stroke="#cbd5e1" strokeWidth="6"/>
            <line x1="200" y1="80" x2="150" y2="110" stroke="#cbd5e1" strokeWidth="6"/>
            <line x1="200" y1="80" x2="250" y2="110" stroke="#cbd5e1" strokeWidth="6"/>
            <circle cx="150" cy="50" r="20" fill="#e2e8f0"/>
            <circle cx="250" cy="50" r="20" fill="#e2e8f0"/>
            <circle cx="150" cy="110" r="20" fill="#e2e8f0"/>
            <circle cx="250" cy="110" r="20" fill="#e2e8f0"/>
            <line x1="200" y1="110" x2="200" y2="180" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5,5"/>
            <g transform="translate(200, 220)">
              <ellipse cx="0" cy="0" rx="30" ry="35" fill="#ef4444"/>
              <ellipse cx="0" cy="-5" rx="25" ry="30" fill="#f97316"/>
              <circle cx="0" cy="-10" r="12" fill="#ffffff" opacity="0.3"/>
              <rect x="-8" y="15" width="16" height="8" rx="2" fill="#fbbf24"/>
            </g>
            <line x1="200" y1="200" x2="195" y2="170" stroke="#cbd5e1" strokeWidth="2" opacity="0.4"/>
            <line x1="200" y1="210" x2="205" y2="180" stroke="#cbd5e1" strokeWidth="2" opacity="0.4"/>
            <ellipse cx="200" cy="350" rx="80" ry="15" fill="#3b82f6" opacity="0.3"/>
          </svg>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial">
          <img src="/new_stuff/SNSM testimonial.png" alt="SNSM Head" className="testimonial-image" />
          <div className="testimonial-content">
            <p className="testimonial-text">"We tried quadcopter drones launched from boat but that wasn't successful to land afterwards and was struggling within strong winds. We would love a better solution as our station covers 110 km of coast over 12 miles of deep sea."</p>
            <div className="testimonial-author">Jean-Pierre Martin</div>
            <div className="testimonial-role">Head of SNSM Capbreton, France</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-links">
          <div style={{ fontWeight: 800, marginRight: '16px', fontSize: '20px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SeaSee</div>
          <div className="dropdown">
            <a href="#usecases">Use cases</a>
            <div className="dropdown-content">
              <a href="#surveillance">Surveillance</a>
              <a href="#oil-platforms">Oil platforms</a>
              <a href="#wind-farms">Wind farms</a>
            </div>
          </div>
          <Link to="/pricing">Pricing</Link>
          <Link to="/console">Login</Link>
        </div>
        <div className="social-links">
          <a href="#" title="Twitter">𝕏</a>
          <a href="#" title="LinkedIn">in</a>
          <a href="#" title="Instagram">⚡</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

