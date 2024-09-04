const logoButton = document.getElementById("logoButton");
const reloadButton = document.getElementById("reloadButton");
const websiteIFrame = document.getElementById("websiteIFrame");
const urlInput = document.getElementById("urlInput");
const addButton = document.getElementById("addButton");
const appTitle = document.getElementById("appTitle");
const loaderDiv = document.getElementById("loaderDiv");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");

function onKeyDown(event) {
  const key = event.key;

  if (key == "Enter") {
    const searchValue = urlInput.value;
    let searchIsUrl = false;
    let searchIsFile = false;

    if (searchValue.includes("https://") || searchValue.includes("http://"))
      searchIsUrl = true;

    for (let i = 0; i < topLevelDomains.length; i++) {
      const element = topLevelDomains[i];
      if (searchValue.includes(element)) {
        searchIsUrl = true;
        break;
      }
    }

    for (let i = 0; i < fileTopLevelDomains.length; i++) {
      const element = fileTopLevelDomains[i];
      if (searchValue.includes(element)) {
        searchIsFile = true;
        break;
      }
    }

    if (searchIsUrl) {
      if (searchValue.includes("https://") || searchValue.includes("http://"))
        websiteIFrame.src = searchValue;
      else websiteIFrame.src = "https://" + searchValue;
    } else {
      const newSearchValue = searchValue.replace(" ", "+");
      websiteIFrame.src = "https://www.google.com/search?q=" + newSearchValue;
    }

    if (searchIsFile) {
      if (searchValue.includes("file://"))
        websiteIFrame.src = searchValue;
      else websiteIFrame.src = "file://" + searchValue;
    }
  }
}

redoButton.onclick = () => {
  websiteIFrame.goForward();
};

undoButton.onclick = () => {
  websiteIFrame.goBack();
};

addButton.onclick = () => {
  window.windowAPI.newWindow();
};

websiteIFrame.addEventListener("did-stop-loading", () => {
  websiteIFrame.classList.remove("blur");
  appTitle.innerHTML = "Star browser - " + websiteIFrame.getTitle();
  urlInput.value = websiteIFrame.src;
  loaderDiv.hidden = true;
});

websiteIFrame.addEventListener("did-start-loading", () => {
  websiteIFrame.classList.add("blur");
  appTitle.innerHTML = "Star browser - Loading...";
  loaderDiv.hidden = false;
});

const topLevelDomains = [
  ".com",
  ".io",
  ".nl",
  ".de",
  ".org",
  ".net",
  ".int",
  ".edu",
  ".eu",
  ".amazon",
  ".app",
  ".dev",
  ".it",
  ".xyz",
  ".gov",
  ".mil",
  ".arpa",
  ".academy",
  ".accountant",
  ".accountants",
  ".active",
  ".actor",
  ".aero",
];

const fileTopLevelDomains = [
  ".html"
]

reloadButton.onclick = () => {
  websiteIFrame.reload();
};

logoButton.onclick = () => {
  websiteIFrame.src = "https://www.google.com/";
  urlInput.value = websiteIFrame.src;
};

window.windowAPI.setWindowURL((url) => {
  websiteIFrame.src = url;
});

window.windowAPI.reloadPage(reloadPage());

function reloadPage() {
  websiteIFrame.src += "";
}
