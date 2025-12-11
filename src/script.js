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

function clearEl(el) {
  el.textContent = "";
}

async function updateNowPlaying() {
  const res = await fetch("/api/now-playing");
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
        div("right now on spotify :3")
      ])
    );
  } else {
    el.textContent = `Im not listening to anything right now :c`;
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

