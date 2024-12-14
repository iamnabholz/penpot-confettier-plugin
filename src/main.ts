import "./style.css";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const sizeSelector = document.querySelector(".size-selector")!;
let sizeSelectedValue = "Small";

sizeSelector.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;

  if (target.tagName === "P") {
    // Remove current selection
    const currentSelected = sizeSelector.querySelector(".choice-selected");
    currentSelected?.classList.remove("choice-selected");

    // Add selection to clicked item
    target.classList.add("choice-selected");
    sizeSelectedValue = target.textContent || "Small";
  }
});

const styleSelect = document.getElementById(
  "style-select",
) as HTMLSelectElement;
let selectedValue = "all"; // default value

styleSelect.addEventListener("change", (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedValue = target.options[target.selectedIndex].value.toLowerCase();
});

document
  .querySelector("[data-handler='generate-confetti']")
  ?.addEventListener("click", () => {
    const widthInput = document.getElementById("width") as HTMLInputElement;
    const heightInput = document.getElementById("height") as HTMLInputElement;
    // send message to plugin.ts
    parent.postMessage(
      {
        msg: "generate",
        width: widthInput.value,
        height: heightInput.value,
        style: selectedValue,
        size: sizeSelectedValue,
      },
      "*",
    );
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
