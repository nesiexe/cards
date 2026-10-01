const byId = (id) => document.getElementById(id);
const musicEndpoint = import.meta.env.DEV
  ? "/api/now-playing"
  : "https://api.nesiexe.xyz/api/now-playing";
const musicMessage = byId("music-message");
const trackDetails = byId("track-details");
const trackLink = byId("track-link");
const trackArtist = byId("track-artist");
const albumArt = byId("album-art");
const albumBackground = byId("album-background");
const musicPlaceholder = byId("music-placeholder");
let previousTrack = "";

function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function clearArtwork() {
  albumArt.hidden = true;
  albumBackground.hidden = true;
  albumArt.removeAttribute("src");
  albumBackground.removeAttribute("src");
  musicPlaceholder.hidden = false;
}

albumArt.addEventListener("error", clearArtwork);

function showMusicMessage(message) {
  previousTrack = "";
  trackDetails.hidden = true;
  musicMessage.hidden = false;
  if (musicMessage.textContent !== message) musicMessage.textContent = message;
  trackLink.removeAttribute("href");
  clearArtwork();
}

async function updateNowPlaying() {
  try {
    const response = await fetch(musicEndpoint, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Music feed unavailable");
    const data = await response.json();
    if (!data || typeof data.isPlaying !== "boolean") throw new Error("Invalid music feed");
    if (!data.isPlaying) {
      showMusicMessage("I'm not listening to anything right now :c");
      return;
    }
    if (typeof data.track !== "string" || typeof data.artist !== "string") {
      throw new Error("Missing track details");
    }

    // Keep the same DOM and focus between polls; only announce changed tracks.
    const track = JSON.stringify([data.track, data.artist, data.url, data.albumArt]);
    if (track === previousTrack) return;
    previousTrack = track;
    trackLink.textContent = data.track;
    trackArtist.textContent = data.artist;
    const trackUrl = safeWebUrl(data.url);
    if (trackUrl) trackLink.href = trackUrl;
    else trackLink.removeAttribute("href");

    clearArtwork();
    const artUrl = safeWebUrl(data.albumArt);
    if (artUrl) {
      albumArt.src = artUrl;
      albumBackground.src = artUrl;
      albumArt.hidden = false;
      albumBackground.hidden = false;
      musicPlaceholder.hidden = true;
    }
    musicMessage.hidden = true;
    trackDetails.hidden = false;
  } catch {
    showMusicMessage("Can't check the music right now. I'll try again soon.");
  } finally {
    // Schedule after completion so slow requests never overlap.
    window.setTimeout(updateNowPlaying, 10000);
  }
}

let toastTimeout;
function showToast(message) {
  const toast = byId("toast");
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.dataset.visible = "true";
  toastTimeout = window.setTimeout(() => {
    toast.dataset.visible = "false";
    toast.textContent = "";
  }, 4000);
}

byId("discord-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("@nesiexe");
    showToast("Copied usertag!");
  } catch {
    showToast("Couldn't copy. My Discord is @nesiexe.");
  }
});

const profile = byId("pfp");
byId("profile-btn").addEventListener("click", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  profile.classList.add("motion-safe:animate-profile-spin");
});
profile.addEventListener("animationend", () => {
  profile.classList.remove("motion-safe:animate-profile-spin");
});

function updateAge() {
  const birthDate = new Date(2006, 11, 9);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  byId("age").textContent = age;
}

updateAge();
updateNowPlaying();
