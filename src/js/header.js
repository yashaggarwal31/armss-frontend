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
  SubCategoriesSuggestions.innerHTML = "";
  for (let i of data) {
    let li = document.createElement("li");
    li.textContent = i;
    li.id = i;
    li.addEventListener("click", () => {
      toAppendSearchItems(li.textContent);
    });
    SubCategoriesSuggestions.appendChild(li);
  }
};

// remove SearchItem

removeFunction = (data) => {
  let li = document.getElementById(data);
  li.remove();
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
    removeFunction(li.id);
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
  SuggestionContainer.style.display = "block";
  FetchingSubcategories();
};
const HideHoverSuggestionListContainer = () => {
  setTimeout(() => {
    SuggestionContainer.style.display = "none";
    SearchFilters.value = "";
  }, 280);
};

// Search Filter
let SearchFilters = document.getElementById("SearchFilters");

SearchFilters.addEventListener("focus", HoverSuggestionListContainer);
SearchFilters.addEventListener("blur", HideHoverSuggestionListContainer);

SearchFilters.addEventListener("input", function (event) {
  data = MainSuggestionData.SubCategoriesData.filter((item) =>
    item.toLowerCase().includes(event.target.value.toLowerCase())
  );
  toAppendSuggestionData(data);
});

// searchButton

SearchButton.addEventListener("click", function () {
  let Value = SearchItems.childNodes;
  let data = [];
  for (let i of Value) {
    data.push(i.id.replace("Search", ""));
  }
  data = data.join(" & ");

  if (window.location.href === "http://127.0.0.1:5501/src/welcome.html") {
    const encodedData = encodeURIComponent(JSON.stringify(data));
    window.location.href = `data.html?data=${encodedData}`;
  } else {
    // toget();
    console.log(window.location.href);
  }

  // SearchItems.innerHTML = "";
});

// ClearFunction
let ClearFunction = document.getElementById("ClearFunction");

ClearFunction.addEventListener("click", function () {
  SearchItems.innerHTML = "";
});

// Logout
function Logout() {
  window.location.replace("index.html");
  setCookie(localStorage.getItem("Rsession_name"), " ", -1);
  localStorage.removeItem("Rsession_name");
}
