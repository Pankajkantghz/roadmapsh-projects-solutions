document.addEventListener("DOMContentLoaded", () => {
  const cookieConsent = document.getElementById("cookieConsent");
 


  const cookieChoice = localStorage.getItem("cookieConsent");

  if (cookieChoice) {
    cookieConsent.style.display = "none";
  } else {
    cookieConsent.style.display = "flex";
  }

 const acceptBtn = document.getElementById("acceptBtn");
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    cookieConsent.style.display = "none";
  });
const declineBtn = document.getElementById("declineBtn");
  declineBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    cookieConsent.style.display = "none";
  });
});
