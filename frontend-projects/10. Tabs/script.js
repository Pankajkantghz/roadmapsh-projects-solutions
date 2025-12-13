
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

contents[0].classList.add("active");

tabs.forEach((tab, index) =>{
    tab.addEventListener("click", () => {


        contents.forEach(c => c.classList.remove("active"));

        contents[index].classList.add("active");
    })
})