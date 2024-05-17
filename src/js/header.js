// let downicon1 = document.getElementById("DownIcon1");
// let downicon2 = document.getElementById("DownIcon2");
// let Locationdropdown = document.getElementById("Locationdropdown");
// let ExperienceDropdown = document.getElementById("ExperienceDropdown");
// let ExperienceHeader = document.getElementById("Experience-Header");

// let LocationdropdownFunction = () => {
//   if (Locationdropdown.style.display === "block") {
//     Locationdropdown.classList.remove("dropdownVisible");
//     Locationdropdown.style.display = "none";
//     downicon1.classList.remove("IconStyles");
//   } else {
//     Locationdropdown.classList.add("dropdownVisible");
//     Locationdropdown.style.display = "block";
//     downicon1.classList.add("IconStyles");
//   }
// };
// let ExperienceDropdownFunction = () => {
//   if (ExperienceDropdown.style.display === "block") {
//     ExperienceDropdown.classList.remove("dropdownVisible");
//     ExperienceDropdown.style.display = "none";
//     downicon2.classList.remove("IconStyles");
//   } else {
//     ExperienceDropdown.classList.add("dropdownVisible");
//     ExperienceDropdown.style.display = "block";
//     ExperienceDropdown.style.right = "12%";
//     downicon2.classList.add("IconStyles");
//   }
// };
// downicon1.addEventListener("click", LocationdropdownFunction);
// downicon2.addEventListener("click", ExperienceDropdownFunction);
// ExperienceHeader.addEventListener("click", ExperienceDropdownFunction);

// SubCategories

let MainSuggestionData = {
  SubCategoriesData: [],
};

let SubCategoriesSuggestions = document.getElementById(
  "SubCategoriesSuggestions"
);
toAppendSuggestionData = (data) => {
  data = data.sort((a, b) => a.localeCompare(b));
  SubCategoriesSuggestions.innerHTML = "";
  for (let i of data) {
    let li = document.createElement("li");
    li.textContent = i;
    li.id = i;
    li.addEventListener("click", () => {
      let items = [...SearchItems.childNodes];

      items = items.find((item) => item.id === "Search" + li.id);
      if (!items) {
        toAppendSearchItems(li.textContent);
        toDisplayClear();
      }
    });
    SubCategoriesSuggestions.appendChild(li);
  }
};

// remove SearchItem

SearchremoveFunction = (data) => {
  let li = document.getElementById(data);
  li.remove();
  toDisplayClear();
};

// Append Search History
let SearchItems = document.getElementById("SearchItems");

toAppendSearchItems = (data) => {
  let li = document.createElement("li");
  li.textContent = data;
  li.id = "Search" + data;

  let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("width", "12");
  icon.setAttribute("height", "12");
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "6");
  circle.setAttribute("cy", "6");
  circle.setAttribute("r", "6");
  circle.setAttribute("fill", "white");
  icon.appendChild(circle);
  icon.style.marginLeft = "0.4rem";
  li.addEventListener("click", () => {
    SearchremoveFunction(li.id);
  });
  li.appendChild(icon);
  SearchItems.appendChild(li);
};

FetchingSubcategories = () => {
  fetch("./assets/Data/Subcategories.json")
    .then((response) => response.json())
    .then((data) => {
      MainSuggestionData.SubCategoriesData = data.AllSubcategory;
      toAppendSuggestionData(data.AllSubcategory);
    });
};

// SuggestionContainer
const HoverSuggestionListContainer = () => {
  if (SearchFilters.value.length > 0) {
    SuggestionContainer.style.display = "block";
  } else {
    SuggestionContainer.style.display = "none";
  }
};
const HideHoverSuggestionListContainer = () => {
  SuggestionContainer.style.display = "none";
  SearchFilters.value = "";
};
FetchingSubcategories();

// Search Filter
let SearchFilters = document.getElementById("SearchFilters");

SearchFilters.addEventListener("focus", HoverSuggestionListContainer);
SearchFilters.addEventListener("blur", HideHoverSuggestionListContainer);

SearchFilters.addEventListener("input", function (event) {
  HoverSuggestionListContainer();
  if (event.target.value.length > 0) {
    data = MainSuggestionData.SubCategoriesData.filter((item) =>
      item.toLowerCase().includes(event.target.value.toLowerCase())
    );
    toAppendSuggestionData(data);
  }
});

SearchFilters.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.target.value.length > 0) {
    let data = event.target.value.toLowerCase();
    let items = [...SearchItems.childNodes];

    items = items.find((item) => item.id === "Search" + data);
    if (!items) {
      toAppendSearchItems(data);
    }
    SearchFilters.value = "";
    FetchingSubcategories();
    toDisplayClear();
  }
});

// searchButton

SearchButton.addEventListener("click", async function () {
  let Value = SearchItems.childNodes;
  let data = [];
  for (let i of Value) {
    data.push(i.id.replace("Search", ""));
  }
  if (MainSuggestionData.SubCategoriesData.find((item) => item === data[0])) {
    FilteringData.onFolderValue = true;
    FilteringData.chatbotData = false;
  } else {
    FilteringData.onFolderValue = false;
    FilteringData.chatbotData = false;
  }

  data = data.join(" & ");
  FilteringData.onSelectSubFolder = data;
  if (data.length > 0) {
    FilteringData.page = "data";
    await triggerDOMContentLoaded();
  }

  // SearchItems.innerHTML = "";
});

// ClearFunction
let ClearFunction = document.getElementById("ClearFunction");

ClearFunction.addEventListener("click", function () {
  SearchItems.innerHTML = "";
  toDisplayClear();
});

// ClearDisplay
function toDisplayClear() {
  let Header_SearchItemsContainer = document.getElementById(
    "Header_SearchItemsContainer"
  );
  let Value = SearchItems.childNodes;
  if (Value.length > 0) {
    Header_SearchItemsContainer.style.display = "flex";
  } else {
    Header_SearchItemsContainer.style.display = "none";
  }
}
toDisplayClear();

// Logout
function Logout() {
  window.location.replace("index.html");
  setCookie(localStorage.getItem("Rsession_name"), " ", -1);
  localStorage.removeItem("Rsession_name");
}

// Logo

let Logo = document.getElementById("Logo");

Logo.addEventListener("click", function () {
  FilteringData.page = "main";
  triggerDOMContentLoaded();
});
