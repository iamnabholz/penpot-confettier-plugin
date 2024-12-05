import "./style.css";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

document.querySelector("[data-handler='generate-confetti']")?.addEventListener("click", () => {
  const widthInput = document.getElementById("width") as HTMLInputElement;
  const heightInput = document.getElementById("height") as HTMLInputElement;
  // send message to plugin.ts
  parent.postMessage({ msg: 'generate', width: widthInput.value, height: heightInput.value }, "*");
});

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
