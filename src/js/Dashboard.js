let containerList = document.getElementById("ContainerList");
let Categorysvalue = document.getElementById("Categorys");
let SubCategoryHeadingValue = document.getElementById(
  "SubCategoryHeadingValue"
);
let SubCategoryHeading = document.getElementById("SubCategoryHeading");
let SubContainerList = document.getElementById("SubContainerList");
let SubCategorySection = document.getElementById("SubCategorySection");
let CloseSubContainer = document.getElementById("CloseSubContainer");

// Category and SubCategory Data

Folders = {
  MainCategory: "",
  SubCategory: "",
};

// Filter Api JSon

const Filterdata = {
  Candidate: {
    check: [],
    FirstName: [],
    LastName: [],
    experience: [],
  },

  WorkExperience: {
    check: [],
    Location: [],
  },

  Education: {
    check: [],
    Degree: [],
    Score: [],
    YearOfPassing: [],
    Branch: [],
    Institution: [],
  },
  Contact: {
    check: [],
    Contact_type: [],
    Contact_value: [],
  },
  Skill: {
    check: [],
    // SkillName: ["Java", "Python"],
    SkillName: [],
  },
  ResumeIdList: {
    check: [],
    ResumeIdValue: [],
  },
};

// UniqueId
function generateUniqueId() {
  const randomNumber = Math.random().toString(16).slice(2);
  const timestamp = Date.now().toString(16);
  const uniqueId = timestamp + randomNumber;
  return uniqueId;
}

// Remove Function
removeFunction = (id) => {
  const para1 = document.getElementById(id);
  console.log(para1);
  para1.parentNode.removeChild(para1);
  Filterdata.Skill.SkillName = Filterdata.Skill.SkillName.filter(
    (item) => item.uniqueId !== id
  );
};

toDataPage = async (value) => {
  const encodedData = encodeURIComponent(JSON.stringify(value));
  window.location.href = `data.html?data=${encodedData}`;
};

createListitems = (data, List, functions) => {
  let li = document.createElement("li");
  li.classList.add("listItem");
  let MainDiv = document.createElement("div");

  for (let i = 0; i < 2; i++) {
    let idValue =
      i == 0
        ? "./Icons/icons.svg#categoryicon"
        : "./Icons/icons.svg#DeleteIcon";
    let classValue = i == 0 ? "DashboardFolderIcon" : "DashboardFolderIcon2";
    let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let div = document.createElement("div");
    let useElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", idValue);
    icon.appendChild(useElement);
    div.appendChild(icon);
    // icon.setAttribute("class", iconClass);
    div.setAttribute("class", classValue);
    MainDiv.appendChild(div);
  }

  let h4 = document.createElement("h4");
  // icon.setAttribute("class", "DashboardFolderIcon");

  h4.textContent = data;

  li.appendChild(MainDiv);
  li.appendChild(h4);

  li.id = i;

  li.addEventListener("click", () => {
    functions(data);
  });
  List.append(li);
};

toDisplayFloder = (data) => {
  Categorysvalue.textContent = data.length;
  for (i of data) {
    createListitems(i, containerList, toShowSubCategory);
  }
};

let toShowSubCategory = (id) => {
  SubCategoryHeading.textContent = id;
  SubCategorySection.style.display = "flex";
  SubContainerList.innerHTML = "";
  togetSubcategory(id);
};

togetSubcategory = async (data) => {
  data = {
    category: data,
  };
  let url = new URL("https://armss-be.exitest.com/skillmapCategory/");
  url.search = new URLSearchParams(data).toString();
  await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((responseData) => {
      Folders.SubCategory = responseData;
      toDisplaySubCategory(responseData);
    });
};

// SubCategory

toDisplaySubCategory = (data) => {
  console.log(data);
  SubContainerList.innerHTML = "";
  SubCategoryHeadingValue.textContent = data.length;
  for (let i of data) {
    createListitems(i, SubContainerList, togetdata);
  }
};

function togetdata(id) {
  toDataPage(id);
  document
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("ContainerListactive"));
  this.classList.add("ContainerListactive");
}

togetFolders = async () => {
  let url = new URL("https://armss-be.exitest.com/SkillMappers");
  await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((responseData) => {
      Folders.MainCategory = responseData;
      toDisplayFloder(responseData);
    });
};

togetFolders();

// Close SubContainer

CloseSubContainer.onclick = () => {
  SubCategorySection.style.display = "none";
  SubCategorySearchFilters.value = "";
};

window.onload = () => {
  isLogout();
};

function setIds() {
  SearchFilters = document.getElementById("SearchFilters");
  // SearchInput = document.getElementById("SearchInput");
  SearchItems = document.getElementById("SearchItems");
  SearchButton = document.getElementById("SearchButton");
  // ExperienceList = document.getElementById("ExperienceList");
  LocationSuggestions = document.getElementById("LocationSuggestions");
  SuggestionContainer = document.getElementById("SuggestionContainer");
  // ExperienceHeader = document.getElementById("Experience-Header");

  // listItems = document.getElementById("listItems");
  // ExperienceHeader.style.display = "none";

  // SearchFilters.addEventListener("keydown", function (event) {
  //   if (event.key === "Enter") {
  //     let value = event.target.value;
  //     value = value.split(",");
  //     for (let i of value) {
  //       const data = {
  //         uniqueId: generateUniqueId(),
  //         SkillName: i,
  //       };
  //       let li = document.createElement("li");
  //       li.textContent = i;
  //       li.id = data.uniqueId;
  //       li.onclick = function () {
  //         removeFunction(data.uniqueId);
  //       };
  //       SearchItems.appendChild(li);
  //       Filterdata.Skill.SkillName.push(data);
  //     }
  //   }
  // });

  // SearchFilters.addEventListener("text", HoverSuggestionListContainer);
}

document.addEventListener("DOMContentLoaded", async () => {
  await getHtml();
  setIds();
});

//  settingSuggestionData
tosetSuggestionData = (data) => {
  for (let i of data.SkillList) {
    let li = document.createElement("li");

    li.textContent = i;
    li.id = i;
    li.setAttribute("onclick", () => {
      console.log(this.id);
    });
    SkillSuggestions.appendChild(li);
  }
};

//  Search Functionality of Folders

let SubCategorySearchFilters = document.getElementById(
  "SubCategorySearchFilters"
);

SubCategorySearchFilters.addEventListener("input", function (event) {
  Data = Folders.SubCategory.filter((item) =>
    item.toLowerCase().includes(event.target.value.toLowerCase())
  );
  toDisplaySubCategory(Data);
});
