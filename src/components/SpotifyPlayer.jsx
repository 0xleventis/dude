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
// page - no amount of JS overrides that. We attempt play() the moment the
// controller is ready (works in the rare contexts that already allow it)
// and again on the very first click/keydown anywhere on the page, so
// playback starts as close to "on arrival" as the browser will permit. The
// widget itself is visually hidden (see .player in App.css) so its own
// "Get Spotify" upsell card, if it ever shows, is never seen.
export default function SpotifyPlayer() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadSpotifyIframeApi().then((IFrameAPI) => {
      if (cancelled || !mountRef.current || mountRef.current.dataset.mounted) return;
      mountRef.current.dataset.mounted = "true";
      IFrameAPI.createController(
        mountRef.current,
        { uri: TRACK_URI, width: "100%", height: "152" },
        (controller) => {
          controller.play();
          const tryPlay = () => {
            controller.play();
            document.removeEventListener("click", tryPlay);
            document.removeEventListener("keydown", tryPlay);
          };
          document.addEventListener("click", tryPlay, { once: true });
          document.addEventListener("keydown", tryPlay, { once: true });
        }
      );
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
