const headers = document.querySelectorAll(".accordion-header");

headers.forEach((header) => {
  header.addEventListener("click", () => {
    const currentContent = header.nextElementSibling;

    document.querySelectorAll(".accordion-content").forEach((content) => {
      if (content !== currentContent) {
        content.classList.remove("active");
      }
    });

    currentContent.classList.toggle("active");
  });
});
