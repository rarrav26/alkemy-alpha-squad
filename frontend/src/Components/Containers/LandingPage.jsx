import { useNavigate } from "react-router-dom";
import SpaceCanvas from "../SpaceCanvas";

/* ─────────────────────────────────────────────────────────────────────
   LandingPage — main welcome screen
───────────────────────────────────────────────────────────────────── */
function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Animated space background */}
      <SpaceCanvas />

      {/* Inline styles — scoped to landing only */}
      <style>{`
        /* ── Layout ─────────────────────────────────────────────── */
        .landing-root {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* ── Hero ───────────────────────────────────────────────── */
        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 999px;
          padding: 8px 20px;
          margin-bottom: 32px;
          backdrop-filter: blur(8px);
          animation: fadeSlideDown 0.7s ease both;
        }
        .logo-badge__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }
        .logo-badge__text {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #34d399;
        }

        .hero__title {
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 12px;
          animation: fadeSlideDown 0.8s 0.1s ease both;
        }
        .hero__title--highlight {
          background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .hero__subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.62);
          max-width: 540px;
          margin: 0 auto 48px;
          line-height: 1.65;
          animation: fadeSlideDown 0.8s 0.2s ease both;
        }

        /* ── Buttons ─────────────────────────────────────────────── */
        .cta-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeSlideDown 0.8s 0.3s ease both;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 36px;
          border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          outline: none;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }
        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .btn:hover::before { opacity: 1; }
        .btn:active        { transform: scale(0.97); }

        .btn--primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          box-shadow: 0 4px 24px rgba(16, 185, 129, 0.5);
          min-width: 180px;
        }
        .btn--primary::before {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        }
        .btn--primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 36px rgba(16, 185, 129, 0.65), 0 0 0 4px rgba(16,185,129,0.15);
        }

        .btn--outline {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(10px);
          min-width: 180px;
        }
        .btn--outline::before {
          background: rgba(255, 255, 255, 0.08);
        }
        .btn--outline:hover {
          transform: translateY(-3px) scale(1.02);
          border-color: rgba(52, 211, 153, 0.55);
          box-shadow: 0 8px 28px rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .btn__icon {
          font-size: 1.15rem;
          transition: transform 0.25s;
        }
        .btn:hover .btn__icon { transform: translateX(3px); }

        /* ── Stats strip ─────────────────────────────────────────── */
        .stats-strip {
          display: flex;
          gap: 40px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 64px;
          padding: 28px 40px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          width: 100%;
          max-width: 680px;
          animation: fadeSlideDown 0.8s 0.45s ease both;
        }
        .stat { text-align: center; }
        .stat__value {
          font-size: 1.9rem;
          font-weight: 800;
          color: #34d399;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .stat__label {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.45);
          margin-top: 4px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .stat-divider {
          width: 1px;
          background: rgba(255, 255, 255, 0.1);
          align-self: stretch;
        }

        /* ── Footer ─────────────────────────────────────────────── */
        .landing-footer {
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding: 28px 24px;
          text-align: center;
          color: rgba(255, 255, 255, 0.28);
          font-size: 0.82rem;
          letter-spacing: 0.02em;
        }
        .landing-footer a {
          color: rgba(52, 211, 153, 0.7);
          text-decoration: none;
          transition: color 0.2s;
        }
        .landing-footer a:hover { color: #34d399; }

        /* ── Navbar ─────────────────────────────────────────────── */
        .landing-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: rgba(2, 6, 23, 0.6);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .landing-nav__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .landing-nav__brand-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          box-shadow: 0 4px 14px rgba(16,185,129,0.4);
        }
        .landing-nav__actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .btn--nav {
          padding: 9px 22px;
          font-size: 0.88rem;
          border-radius: 10px;
          min-width: unset;
        }

        /* ── Keyframes ───────────────────────────────────────────── */
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #10b981; opacity: 1; }
          50%       { box-shadow: 0 0 18px #10b981, 0 0 30px rgba(16,185,129,0.4); opacity: 0.7; }
        }

        /* ── Responsive ──────────────────────────────────────────── */
        @media (max-width: 640px) {
          .landing-nav         { padding: 16px 20px; }
          .landing-nav__brand  { font-size: 1.1rem; }
          .btn--nav            { padding: 8px 14px; font-size: 0.82rem; }
          .hero                { padding: 100px 20px 60px; }
          .stats-strip         { gap: 24px; padding: 22px 24px; }
          .stat-divider        { display: none; }
          .cta-group           { flex-direction: column; align-items: center; }
          .btn                 { width: 100%; max-width: 320px; justify-content: center; }
        }
      `}</style>

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__brand-icon">💱</div>
          DigitalArs
        </div>
        <div className="landing-nav__actions">
          <button
            id="nav-login-btn"
            className="btn btn--outline btn--nav"
            onClick={() => navigate("/auth")}
          >
            Iniciar Sesión
          </button>
          <button
            id="nav-register-btn"
            className="btn btn--primary btn--nav"
            onClick={() => navigate("/auth")}
          >
            Crear Cuenta
          </button>
        </div>
      </nav>

      {/* ── Main content ──────────────────────────────────────────── */}
      <main className="landing-root">
        <section className="hero">
          {/* Badge */}
          <div className="logo-badge">
            <div className="logo-badge__dot" />
            <span className="logo-badge__text">Tu billetera digital en pesos</span>
          </div>

          {/* Title */}
          <h1 className="hero__title">
            <span className="hero__title--highlight">Digital·Ars</span>
          </h1>

          {/* Subtitle */}
          <p className="hero__subtitle">
            Gestioná tus fondos en pesos argentinos de forma simple, segura y al instante.
            Transferí, recibí y organizá tu plata desde cualquier lugar.
          </p>

          {/* CTA Buttons */}
          <div className="cta-group">
            <button
              id="hero-login-btn"
              className="btn btn--outline"
              onClick={() => navigate("/auth")}
            >
              Iniciar Sesión
              <span className="btn__icon">→</span>
            </button>
            <button
              id="hero-register-btn"
              className="btn btn--primary"
              onClick={() => navigate("/auth")}
            >
              Crear mi cuenta gratis
              <span className="btn__icon">→</span>
            </button>
          </div>

          {/* Stats strip */}
          <div className="stats-strip">
            <div className="stat">
              <div className="stat__value">0$</div>
              <div className="stat__label">Costo de apertura</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat__value">24/7</div>
              <div className="stat__label">Disponible</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat__value">ARS</div>
              <div className="stat__label">Pesos argentinos</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>
            © {new Date().getFullYear()}{" "}
            <strong style={{ color: "rgba(255,255,255,0.5)" }}>DigitalArs</strong>
            &nbsp;·&nbsp; Todos los derechos reservados
            &nbsp;·&nbsp; <a href="#">Términos y condiciones</a>
            &nbsp;·&nbsp; <a href="#">Privacidad</a>
          </p>
        </footer>
      </main>
    </>
  );
}

export default LandingPage;
