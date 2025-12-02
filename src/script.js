async function updateNowPlaying() {
  const res = await fetch("/api/now-playing");
  const data = await res.json();
  const el = document.getElementById("now-playing");

  if (data.isPlaying) {

    el.innerHTML = `
      <div>
        <div>I'm listening to</div>
        <a class="now-playing-green" href="${data.url}">${data.artist} - ${data.track}</a>
        <div>right now on spotify :3</div>
      </div>
    `;
  } else {
    el.innerHTML = `Im not listening to anything right now :c`;
  }
}

async function fetchPfp() {
  const p = document.getElementById("pfp");

  p.addEventListener("click", ()=> {
  p.classList.add("rot");
  setTimeout(()=> {
    p.classList.remove("rot");
  }, 1000);
  });
}

fetchPfp();
updateNowPlaying();
setInterval(updateNowPlaying, 10000);

