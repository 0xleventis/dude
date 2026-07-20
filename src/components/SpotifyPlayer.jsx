import { useEffect, useRef } from "react";

const TRACK_URI = "spotify:track:0Hv5csiUhbfzO6VLFv4wtY";

// Module-scoped so React StrictMode's dev-time double effect invocation
// (mount -> cleanup -> mount) can't load the script or create the
// controller twice on the same node.
let apiPromise = null;
function loadSpotifyIframeApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.SpotifyIframeApi) {
      resolve(window.SpotifyIframeApi);
      return;
    }
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.SpotifyIframeApi = IFrameAPI;
      resolve(IFrameAPI);
    };
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return apiPromise;
}

// Browsers block real audio autoplay until the visitor interacts with the
// page, and forcing controller.play() without a genuine user gesture makes
// Spotify show its own "Get Spotify" upsell card instead of playing - so we
// don't call play() at all. The widget renders its native play button and
// the visitor starts it themselves.
export default function SpotifyPlayer() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadSpotifyIframeApi().then((IFrameAPI) => {
      if (cancelled || !mountRef.current || mountRef.current.dataset.mounted) return;
      mountRef.current.dataset.mounted = "true";
      IFrameAPI.createController(mountRef.current, { uri: TRACK_URI, width: "100%", height: "152" }, () => {});
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // The Spotify API replaces this inner node's contents with its own
  // <iframe>, so positioning lives on the stable outer wrapper instead.
  return (
    <div className="player">
      <div ref={mountRef} />
    </div>
  );
}
