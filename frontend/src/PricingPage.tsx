import { Link } from 'react-router-dom';
import './LandingPage.css';

const PricingPage = () => {
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
        <Link to="/" className="logo">SeaSee</Link>
        <nav>
          <div className="dropdown">
            <a href="/#usecases">Use cases</a>
            <div className="dropdown-content">
              <a href="/#surveillance">Surveillance</a>
              <a href="/#oil-platforms">Oil platforms</a>
              <a href="/#wind-farms">Wind farms</a>
            </div>
          </div>
          <Link to="/pricing">Pricing</Link>
          <Link to="/console" className="login-link">Login</Link>
        </nav>
      </header>

      {/* Pricing Section */}
      <section className="pricing-section" style={{ minHeight: 'calc(100vh - 200px)', padding: '120px 64px' }}>
        <div className="pricing-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '72px', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-2px' }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: '20px', color: '#64748b' }}>Choose the plan that fits your needs</p>
        </div>
        <div className="pricing-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Access Plan */}
          <div className="pricing-card" style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: '3px solid transparent', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
            <div className="pricing-card-header" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0a1929', marginBottom: '8px' }}>Access</h3>
              <div className="price" style={{ fontSize: '48px', fontWeight: 800, color: '#0a1929', marginBottom: '4px' }}>$25k</div>
              <div className="price-period" style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>per year per drone</div>
            </div>
            <Link to="/console" className="cta-button secondary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', display: 'inline-block', textAlign: 'center', margin: '32px 0', border: 'none', background: 'white', color: '#0a1929', borderStyle: 'solid', borderWidth: '2px', borderColor: '#e2e8f0' }}>Get started</Link>
            <ul className="pricing-features" style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Drone</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Launchpad</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>SAR coordination</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: 'none' }}>Courants prediction</li>
            </ul>
          </div>

          {/* Autonomous Plan */}
          <div className="pricing-card featured" style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: '3px solid #0ea5e9', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ content: "'Most Popular'", position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white', padding: '6px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>Most Popular</div>
            <div className="pricing-card-header" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0a1929', marginBottom: '8px' }}>Autonomous</h3>
              <div className="price" style={{ fontSize: '48px', fontWeight: 800, color: '#0a1929', marginBottom: '4px' }}>$35k</div>
              <div className="price-period" style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>per year per drone</div>
            </div>
            <Link to="/console" className="cta-button primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', display: 'inline-block', textAlign: 'center', margin: '32px 0', border: 'none', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)' }}>Get started</Link>
            <ul className="pricing-features" style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Piloted Drone</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Launchpad</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>SAR coordination</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Courants prediction</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: 'none' }}>Maintenance</li>
            </ul>
          </div>

          {/* Fleet Plan */}
          <div className="pricing-card" style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: '3px solid transparent', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
            <div className="pricing-card-header" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0a1929', marginBottom: '8px' }}>Fleet</h3>
              <div className="price" style={{ fontSize: '48px', fontWeight: 800, color: '#0a1929', marginBottom: '4px' }}>Custom</div>
              <div className="price-period" style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>Contact for pricing</div>
            </div>
            <Link to="/console" className="cta-button secondary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', display: 'inline-block', textAlign: 'center', margin: '32px 0', border: 'none', background: 'white', color: '#0a1929', borderStyle: 'solid', borderWidth: '2px', borderColor: '#e2e8f0' }}>Contact sales</Link>
            <ul className="pricing-features" style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Dedicated team</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Custom drones</li>
              <li style={{ padding: '16px 0', color: '#0a1929', fontSize: '16px', fontWeight: 600, borderBottom: 'none' }}>Custom system</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-links">
          <div style={{ fontWeight: 800, marginRight: '16px', fontSize: '20px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SeaSee</div>
          <div className="dropdown">
            <a href="/#usecases">Use cases</a>
            <div className="dropdown-content">
              <a href="/#surveillance">Surveillance</a>
              <a href="/#oil-platforms">Oil platforms</a>
              <a href="/#wind-farms">Wind farms</a>
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

export default PricingPage;

