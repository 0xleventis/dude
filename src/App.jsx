import "./App.css";
import bgDesktop from "./assets/images/background.png";
import bgMobile from "./assets/images/background-mobile.png";
import SpotifyPlayer from "./components/SpotifyPlayer";

export default function App() {
  return (
    <div className="page">
      <div className="card">
        <div className="bg bg-desktop" style={{ backgroundImage: `url(${bgDesktop})` }} />
        <div className="bg bg-mobile" style={{ backgroundImage: `url(${bgMobile})` }} />

        <a
          className="hit hit-join"
          href="https://x.com/leventiscrypto"
          target="_blank"
          aria-label="Join us"
          rel="noopener noreferrer"
        />
        <a className="hit hit-buy" href="#" aria-label="Buy $DUDES" rel="noopener noreferrer" />
        <a className="hit hit-chart" href="#" aria-label="View chart" rel="noopener noreferrer" />

        <SpotifyPlayer />
      </div>
    </div>
  );
}
