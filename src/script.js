function nodeFactory(node) {
  return function(children, props) {
    if(!Array.isArray(children)) children = [children];
    const el = document.createElement(node);
    if (props) Object.assign(el, props);
    for(const child of children) {
      if(!child) continue;
      el.appendChild(typeof child === "object" ? child : document.createTextNode("" + child));
    }
    return el;
  }
}

const div = nodeFactory("div");
const link = nodeFactory("a");
const img = nodeFactory("img");

function clearEl(el) {
  el.textContent = "";
}

async function updateNowPlaying() {
  const res = await fetch("https://nesiexe.xyz/api/now-playing");
  const data = await res.json();
  const el = document.getElementById("now-playing");

  if (data.isPlaying) {
    clearEl(el);

    el.appendChild(
      div([
        div("I'm listening to"),
        link(`${data.artist} - ${data.track}`, {
          className: "now-playing-green",
          href: data.url
        }),
        div("right now on spotify :3"),
        img("", {
          src: data.albumArt,
          alt: `${data.artist} - ${data.track}`,
          className: "album-art"
        }),
      ], { className: "now-playing-container" })
    );
  } else {
    clearEl(el);
    el.appendChild(div("I'm not listening to anything right now :c", { className: "nothing-playing" }));
  }
}

async function fetchPfp() {
  const p = document.getElementById("pfp");

  p.addEventListener("click", () => {
    p.classList.add("rot");
    setTimeout(() => {
      p.classList.remove("rot");
    }, 1000);
  });
}

fetchPfp();
updateNowPlaying();
setInterval(updateNowPlaying, 10000);

