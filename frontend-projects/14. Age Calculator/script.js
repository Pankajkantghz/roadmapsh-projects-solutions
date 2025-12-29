const { DateTime } = luxon;

let selectedDate = null;

const birthdateInput = document.getElementById("birthdate");
const form = document.getElementById("ageForm");
const result = document.getElementById("result");

const picker = datepicker("#birthdate", {
  showOnFocus: true,
  maxDate: new Date(),

  onSelect: (instance, date) => {
    selectedDate = date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getMonth()).padStart(2, "0");
    birthdateInput.value = `${yyyy}-${mm}-${dd}`;
  },
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedDate) {
    result.style.color = "red";
    result.textContent = "Please select your birthdate";
    return;
  }

  const birthDate = DateTime.fromJSDate(selectedDate);
  const today = DateTime.now();
  if (birthDate > today) {
    result.style.color = "red";
    result.textContent = "Birthdate cannot be in the future.";
    return;
  }
  const diff = today.diff(birthDate, ["years", "months", "days"]).toObject();
  result.style.color = "green";
  result.textContent = `You are ${Math.floor(diff.years)} years, ${Math.floor(
    diff.months
  )} months, and ${Math.floor(diff.days)} days old.`;
});
