import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function getTimeLeft() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function FlashSaleBanner() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flash-sale">
      <div className="flash-sale-inner">
        <div className="flash-sale-copy">
          <span className="flash-tag">LIVE NOW</span>
          <h2>⚡ Flash Sale — up to 60% off</h2>
          <p>Prices drop back to normal when the clock hits zero. Grab it before it's gone.</p>
        </div>
        <div className="countdown" role="timer" aria-live="polite">
          <div className="countdown-unit">
            <span className="countdown-value">{pad(time.hours)}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <span className="countdown-colon">:</span>
          <div className="countdown-unit">
            <span className="countdown-value">{pad(time.minutes)}</span>
            <span className="countdown-label">Mins</span>
          </div>
          <span className="countdown-colon">:</span>
          <div className="countdown-unit">
            <span className="countdown-value">{pad(time.seconds)}</span>
            <span className="countdown-label">Secs</span>
          </div>
        </div>
        <Link to="/?category=Electronics" className="btn btn-primary flash-cta">
          Shop the sale
        </Link>
      </div>
    </section>
  );
}
