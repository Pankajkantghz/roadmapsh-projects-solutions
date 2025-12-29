const inputText = document.getElementById("user-input");
const countDisplay = document.getElementById("charCount");
const limit = 250;

inputText.addEventListener("input", () => {
    const currentLength = inputText.value.length;
    countDisplay.textContent =`${currentLength} / ${limit}`;

    if(currentLength > limit){
        inputText.classList.add("limit-reached");
        countDisplay.classList.add("limit-reached")

    }else{
        inputText.classList.remove("limit-reached");
        countDisplay.classList.remove("limit-reached");
    }
})