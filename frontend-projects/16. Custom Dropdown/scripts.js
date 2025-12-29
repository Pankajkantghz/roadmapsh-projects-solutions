document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".dropdown-button");
  const buttonText = document.querySelector(".dropdown-text");
  const arrow = document.querySelector(".dropdown-arrow");
  const list = document.querySelector(".dropdown-list");
  const items = document.querySelectorAll(".dropdown-item");

  let isOpen = false;

  
  button.addEventListener("click", () => {
    isOpen = !isOpen;

    list.style.display = isOpen ? "block" : "none";
    arrow.textContent = isOpen ? "▲" : "▼";
  });

  // Select item
  items.forEach((item) => {
    item.addEventListener("click", () => {
      buttonText.textContent = item.textContent;
      arrow.textContent = "▼";
      list.style.display = "none";
      isOpen = false;
    });
  });
});
