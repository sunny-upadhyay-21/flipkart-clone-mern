const MESSAGES = [
  '🔥 Flash Sale — Extra 10% off on Electronics, today only',
  '🚚 Free delivery on all orders over ₹499',
  '🆕 New arrivals added every week',
  '↩️ 7-day easy returns on every order',
];

export default function AnnouncementBar() {
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="announcement-bar">
      <div className="marquee">
        <div className="marquee-track">
          {track.map((msg, i) => (
            <span className="marquee-item" key={i}>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
