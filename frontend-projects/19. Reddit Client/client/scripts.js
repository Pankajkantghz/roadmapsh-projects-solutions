console.log("SCRIPT LOADED");

const laneContainer = document.getElementById("laneContainer");
const modal = document.getElementById("modal");
const addLaneBtn = document.getElementById("addLaneBtn");
const confirmAdd = document.getElementById("confirmAdd");
const subredditInput = document.getElementById("subredditInput");

let lanes = JSON.parse(localStorage.getItem("lanes")) || [];

async function fetchSubreddit(subreddit) {
  const res = await fetch(`http://localhost:5000/api/reddit/${subreddit}`);
  if (!res.ok) throw new Error("Subreddit not found");
  const data = await res.json();
  return data.data.children;
}

/* UI */
function createLane(subreddit, insertFirst = false) {
  const lane = document.createElement("div");
  lane.className = "lane";

  lane.innerHTML = `
    <div class="lane-header">
      <strong>/r/${subreddit}</strong>
      <span class="menu">⋮</span>
      <div class="menu-dropdown">
        <button class="refresh">Refresh</button>
        <button class="delete">Delete</button>
      </div>
    </div>
    <div class="posts loading">Loading...</div>
  `;

  const dropdown = lane.querySelector(".menu-dropdown");
  const menu = lane.querySelector(".menu");
  const posts = lane.querySelector(".posts");

  menu.onclick = () => {
    const isOpen = getComputedStyle(dropdown).display === "block";

    dropdown.style.display = isOpen ? "none" : "block";
    menu.innerHTML = isOpen ? "⋮" : "X";
    menu.style.color = isOpen ? "white" : "red";
  };

  lane.querySelector(".delete").onclick = () => {
    lanes = lanes.filter((l) => l !== subreddit);
    localStorage.setItem("lanes", JSON.stringify(lanes));
    lane.remove();
  };

  lane.querySelector(".refresh").onclick = () => loadPosts(subreddit, posts);

  loadPosts(subreddit, posts);
  if (insertFirst) {
    laneContainer.prepend(lane);
  } else {
    laneContainer.appendChild(lane);
  }
}

async function loadPosts(subreddit, container) {
  container.textContent = "Loading...";
  try {
    const posts = await fetchSubreddit(subreddit);
    container.className = "posts";
    container.innerHTML = posts
      .slice(0, 10)
      .map(
        (p) => `
        <div class="post">
  <div class="about">
    <div class="name">
      <span>👤</span>
      <small>u/${p.data.author}</small>
    </div>
  </div>

  <div class="heading">
    <strong>${p.data.title}</strong>
  </div>

  <div class="informations">
    <div class="upvote">⬆️ ${p.data.ups}</div>
    <div class="comments">💬 ${p.data.num_comments}</div>
  </div>
</div>

      `
      )
      .join("");
  } catch {
    container.className = "posts error";
    container.textContent = "Failed to load subreddit";
  }
}

addLaneBtn.onclick = () => {
  modal.classList.remove("hidden");
  subredditInput.value = "";
};

confirmAdd.onclick = () => {
  const subreddit = subredditInput.value.trim();
  if (!subreddit || lanes.includes(subreddit)) return;

  lanes.unshift(subreddit);
  localStorage.setItem("lanes", JSON.stringify(lanes));
  createLane(subreddit, true);

  modal.classList.add("hidden");
};

modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

lanes.forEach(createLane);
