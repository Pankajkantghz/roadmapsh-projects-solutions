const UI_STATE = {
  EMPTY: "empty",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

let currentState = UI_STATE.EMPTY;
let selectedLanguage = null;

const emptyState = document.getElementById("empty-state");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const repoCard = document.getElementById("repoCard");

const selectButton = document.querySelector(".select-button");
const selectLabel = document.querySelector(".select-label");
const selectMenu = document.querySelector(".select-menu");
const listItems = document.querySelectorAll(".list-item");

const retryBtn = document.getElementById("retry-btn");
const refreshBtn = document.getElementById("refresh-btn");

const repoName = document.getElementById("repoName");
const repoInfo = document.getElementById("repo-info");
const repoLang = document.getElementById("repoLang");
const repoStars = document.getElementById("repoStars");
const repoForks = document.getElementById("repoForks");
const repoIssues = document.getElementById("repoIssues");

function renderUI(state) {
  emptyState.style.display = "none";
  loadingState.style.display = "none";
  errorState.style.display = "none";
  repoCard.style.display = "none";

  switch (state) {
    case UI_STATE.EMPTY:
      emptyState.style.display = "flex";
      break;

    case UI_STATE.LOADING:
      loadingState.style.display = "flex";
      break;

    case UI_STATE.SUCCESS:
      repoCard.style.display = "flex";
      break;

    case UI_STATE.ERROR:
      errorState.style.display = "flex";
      break;
  }
}

renderUI(UI_STATE.EMPTY);

selectButton.addEventListener("click", () => {
  selectMenu.style.display =
    selectMenu.style.display === "block" ? "none" : "block";
});

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    selectedLanguage = item.textContent;

    
    selectLabel.textContent = selectedLanguage;

   
    selectMenu.style.display = "none";

    
    currentState = UI_STATE.LOADING;
    renderUI(currentState);

    fetchRepository(selectedLanguage);
  });
});

async function fetchRepository(language) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`
    );

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error("No repositories found");
    }

    const randomIndex = Math.floor(Math.random() * data.items.length);
    const repo = data.items[randomIndex];

    // Fill repo card
    repoName.textContent = repo.name;
    repoInfo.textContent = repo.description || "No description available";
    repoLang.textContent = `🟡 ${repo.language || "N/A"}`;
    repoStars.textContent = `⭐ ${repo.stargazers_count.toLocaleString()}`;
    repoForks.textContent = `🍴 ${repo.forks_count.toLocaleString()}`;
    repoIssues.textContent = `🐞 ${repo.open_issues_count.toLocaleString()}`;

    currentState = UI_STATE.SUCCESS;
    renderUI(currentState);
  } catch (error) {
    currentState = UI_STATE.ERROR;
    renderUI(currentState);
  }
}

retryBtn.addEventListener("click", () => {
  if (!selectedLanguage) return;

  currentState = UI_STATE.LOADING;
  renderUI(currentState);

  fetchRepository(selectedLanguage);
});

refreshBtn.addEventListener("click", () => {
  if (!selectedLanguage) return;

  currentState = UI_STATE.ERROR;
  renderUI(currentState);

  fetchRepository(selectedLanguage);
});
