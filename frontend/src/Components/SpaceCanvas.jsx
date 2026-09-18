import { useEffect, useRef } from "react";

/**
 * SpaceCanvas — high-performance animated space background.
 * Shared across LandingPage and Auth pages.
 *
 * Renders:
 *  - Deep space gradient + emerald nebula glows (pre-baked to OffscreenCanvas)
 *  - 280 tiny twinkling star dots
 *  - 35 larger glow stars with soft emerald halo
 *
 * Performance notes:
 *  - Background painted once to OffscreenCanvas, GPU-blitted each frame
 *  - No shadowBlur, no per-star gradients
 *  - Single save/restore per star layer
 */
function SpaceCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    /* ── Pre-render static background ──────────────────────────────── */
    function buildBgCache(w, h) {
      const oc = new OffscreenCanvas(w, h);
      const c  = oc.getContext("2d");

      const bg = c.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0,    "#020617");
      bg.addColorStop(0.45, "#061a2e");
      bg.addColorStop(1,    "#020d18");
      c.fillStyle = bg;
      c.fillRect(0, 0, w, h);

      const n1 = c.createRadialGradient(w * 0.15, h * 0.2, 0, w * 0.15, h * 0.2, w * 0.38);
      n1.addColorStop(0, "rgba(16,185,129,0.09)");
      n1.addColorStop(1, "transparent");
      c.fillStyle = n1;
      c.fillRect(0, 0, w, h);

      const n2 = c.createRadialGradient(w * 0.85, h * 0.75, 0, w * 0.85, h * 0.75, w * 0.42);
      n2.addColorStop(0, "rgba(5,150,105,0.10)");
      n2.addColorStop(1, "transparent");
      c.fillStyle = n2;
      c.fillRect(0, 0, w, h);

      return oc;
    }

    let bgCache = buildBgCache(W, H);

    /* ── Star factory ───────────────────────────────────────────────── */
    function makeStar(w, h, large = false) {
      return {
        x:     Math.random() * w,
        y:     Math.random() * h,
        r:     large ? Math.random() * 2 + 1.2 : Math.random() * 1.4 + 0.25,
        alpha: Math.random(),
        speed: (Math.random() * 0.008 + 0.003) * (large ? 0.6 : 1),
        dir:   Math.random() > 0.5 ? 1 : -1,
      };
    }

    const dots  = Array.from({ length: 280 }, () => makeStar(W, H, false));
    const glows = Array.from({ length: 35  }, () => makeStar(W, H, true));
    const TWO_PI = Math.PI * 2;

    /* ── Draw loop ──────────────────────────────────────────────────── */
    function draw() {
      ctx.drawImage(bgCache, 0, 0);

      ctx.save();
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < dots.length; i++) {
        const s = dots[i];
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1)    { s.alpha = 1;    s.dir = -1; }
        if (s.alpha <= 0.06) { s.alpha = 0.06; s.dir =  1; }
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, TWO_PI);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      for (let i = 0; i < glows.length; i++) {
        const s = glows[i];
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 0.95) { s.alpha = 0.95; s.dir = -1; }
        if (s.alpha <= 0.10) { s.alpha = 0.10; s.dir =  1; }

        ctx.globalAlpha = s.alpha * 0.22;
        ctx.fillStyle   = "#a7f3d0";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.4, 0, TWO_PI);
        ctx.fill();

        ctx.globalAlpha = s.alpha;
        ctx.fillStyle   = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, TWO_PI);
        ctx.fill();
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    /* ── Resize ─────────────────────────────────────────────────────── */
    function onResize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      bgCache = buildBgCache(W, H);
    }

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}

export default SpaceCanvas;
