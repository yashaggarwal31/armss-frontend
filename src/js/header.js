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
      let value = SearchFilters.value.split(" ");
      if (value.lastIndexOf("and") !== -1) {
        newvalue = value.slice(0, value.lastIndexOf("and") + 1);
        newvalue.push(li.textContent);
        SearchFilters.value = newvalue.join(" ");
        SearchFilters.focus();
      } else if (value.lastIndexOf("and") === -1) {
        SearchFilters.value = li.textContent;
        SearchFilters.focus();
      }
      // console.log(SearchFilters.value);
      // items = items.find((item) => item.id === "Search" + li.id);
      // if (!items) {
      //   toAppendSearchItems(li.textContent);
      //   toDisplayClear();
      // }
    });
    SubCategoriesSuggestions.appendChild(li);
  }
};

// // remove SearchItem

// SearchremoveFunction = (data) => {
//   let li = document.getElementById(data);
//   li.remove();
//   toDisplayClear();
// };

// // Append Search History
// let SearchItems = document.getElementById("SearchItems");

// toAppendSearchItems = (data) => {
//   let li = document.createElement("li");
//   li.textContent = data;
//   li.id = "Search" + data;

//   let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   icon.setAttribute("width", "12");
//   icon.setAttribute("height", "12");
//   let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//   circle.setAttribute("cx", "6");
//   circle.setAttribute("cy", "6");
//   circle.setAttribute("r", "6");
//   circle.setAttribute("fill", "white");
//   icon.appendChild(circle);
//   icon.style.marginLeft = "0.4rem";
//   li.addEventListener("click", () => {
//     SearchremoveFunction(li.id);
//   });
//   li.appendChild(icon);
//   SearchItems.appendChild(li);
// };

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
  if (
    SearchFilters.value.split(" ").slice(-1)[0].trim() !== "" &&
    SubCategoriesSuggestions.querySelectorAll("li").length > 0
  ) {
    SuggestionContainer.style.display = "block";
    console.log(SubCategoriesSuggestions.innerHTML);
  } else {
    SuggestionContainer.style.display = "none";
  }
};
const HideHoverSuggestionListContainer = () => {
  setTimeout(() => {
    SuggestionContainer.style.display = "none";
    // SearchFilters.value = "";
  }, 280);
};
FetchingSubcategories();

// Search Filter
let SearchFilters = document.getElementById("SearchFilters");

SearchFilters.addEventListener("focus", HoverSuggestionListContainer);
SearchFilters.addEventListener("blur", HideHoverSuggestionListContainer);

SearchFilters.addEventListener("input", function (event) {
  HoverSuggestionListContainer();
  if (event.target.value.length > 0) {
    SubCategoriesSuggestions.innerHTML = "";
    clearsearchvalue.style.display = "block";
    // let targetvalue = event.target.value;
    let inputvalue = event.target.value.toLowerCase().split(" and ");
    targetvalue = inputvalue.slice(-1);
    data = MainSuggestionData.SubCategoriesData.filter((item) =>
      item.toLowerCase().includes(targetvalue[0].toLowerCase())
    );

    toAppendSuggestionData(data);
  } else {
    clearsearchvalue.style.display = "none";
  }
});

SearchFilters.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.target.value.length > 0) {
    onSubmiting();
  }
});

// searchButton

// functionality
async function onSubmiting() {
  if (SearchFilters.value.length > 0) {
    SearchFilters.blur();
    value = SearchFilters.value.replace(/\s+/g, " ").trim();

    data = value.split(" and ");
    if (
      MainSuggestionData.SubCategoriesData.find(
        (item) => item.toLowerCase() === data[0].toLowerCase()
      )
    ) {
      FilteringData.onFolderValue = true;
      FilteringData.onSelectSubFolder = data.join(" & ");
      FilteringData.chatbotData = false;
    } else {
      FilteringData.onFolderValue = false;
      FilteringData.onSelectSubFolder = data.join(" and ");

      FilteringData.chatbotData = false;
    }
    if (data.length > 0) {
      FilteringData.page = "data";
      await triggerDOMContentLoaded();
    }

    // SearchItems.innerHTML = "";
  }
}

SearchButton.addEventListener("click", onSubmiting);

// // ClearFunction
// let ClearFunction = document.getElementById("ClearFunction");

// ClearFunction.addEventListener("click", function () {
//   SearchItems.innerHTML = "";
//   toDisplayClear();
// });

// ClearDisplay
// function toDisplayClear() {
//   let Header_SearchItemsContainer = document.getElementById(
//     "Header_SearchItemsContainer"
//   );
//   let Value = SearchItems.childNodes;
//   if (Value.length > 0) {
//     Header_SearchItemsContainer.style.display = "flex";
//   } else {
//     Header_SearchItemsContainer.style.display = "none";
//   }
// }
// toDisplayClear();

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
  Filterdata.Candidate.UploadDate = [];
  Filterdata.Skill.SkillName = [];
  Filterdata.WorkExperience.Location = [];
  Filterdata.Candidate.Experience = [];
  FilteringData.TemporaryData = [];
  triggerDOMContentLoaded();
});

// clear serach value

let clearsearchvalue = document.getElementById("ClearSearchValue");
clearsearchvalue.addEventListener("click", function () {
  clearsearchvalue.style.display = "none";
  SearchFilters.value = "";
  SearchFilters.focus();
});

async function getNotifications() {
  try {
    const response = await fetch(
      "https://armss-be.exitest.com/get-notifications",
      {
        method: "POST",
      }
    );
    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.log("failed to fetch notifications: ", error);
  }
}



async function notificationsInIt() {

  document.getElementById("notification-container").style.height = "60vh";

  const data = await getNotifications();
  console.log("data:", data);
  const notificationList = document.getElementById("notifications-list");

  notificationList.innerHTML = "";

  for (i of data) {

    console.log(i[6])

    const tempJson = i[2];
    const formattedDate = formatDateTimeString(i[4]);
    console.log(i[2]);
    const notificationJson = JSON.parse(tempJson);

    const fileCount = notificationJson.fileCount;

    const notificationDiv = document.createElement("div");
    notificationDiv.classList.add("sec");

    const txtDiv = document.createElement('div');
    txtDiv.classList.add('txt');
    txtDiv.textContent = `A new upload session of ${fileCount} file${fileCount == 1 ? '' : 's'} was created!`;

    notificationDiv.appendChild(txtDiv);

    const subDiv = document.createElement('div');
    subDiv.classList.add('txt', 'sub', 'flex-span');

    const dateSpan = document.createElement('span');
    dateSpan.textContent = formattedDate;

    const statusSpan = document.createElement('span');
    // statusSpan.addEventListener('click', () => {
    //   viewUploadErrorDetails();
    // })

    statusSpan.textContent = 'InProgress';
    statusSpan.classList.add('UploadinProgress');


    subDiv.appendChild(dateSpan);
    subDiv.appendChild(statusSpan);



    notificationDiv.appendChild(subDiv);

    notificationList.appendChild(notificationDiv);
  }
}

window.addEventListener("click", function (event) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const icon = document.getElementById("icon");

  if (
    !notificationContainer.contains(event.target) &&
    !icon.contains(event.target)
  ) {
    notificationContainer.style.height = "0";
  }
});

// const formatDateTimeString = (utcDateString) => {
//   if (!utcDateString) return ''

//   const utcDate = new Date(utcDateString)

//   // Create a new Date object representing the UTC date and time
//   const utcOffsetMinutes = utcDate.getTimezoneOffset()
//   const istOffsetMinutes = utcOffsetMinutes + 330 // IST is UTC + 5:30 which is 330 minutes

//   const istDate = new Date(utcDate.getTime() + istOffsetMinutes * 60 * 1000)

//   const month = istDate.getMonth() + 1 // getMonth() is zero-based
//   const year = istDate.getFullYear()
//   const day = istDate.getDate()

//   const hours = istDate.getHours()
//   const minutes = istDate.getMinutes()
//   const seconds = istDate.getSeconds()

//   const monthNames = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December'
//   ]
//   const monthName = monthNames[month - 1]

//   const formattedDate = `${monthName} ${day}, ${year}`
//   const formattedTime = `${String(hours).padStart(2, '0')}:${String(
//     minutes
//   ).padStart(2, '0')}:${String(seconds).padStart(2, '0')} IST`

//   return `${formattedDate} ${formattedTime}`
// }

const formatDateTimeString = (utcDateString) => {
  if (!utcDateString) return "";

  const utcDate = new Date(utcDateString);

  // Convert UTC time to IST by adding 5 hours and 30 minutes (19800000 milliseconds)
  const istOffsetMilliseconds = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffsetMilliseconds);

  const month = istDate.getMonth() + 1; // getMonth() is zero-based
  const year = istDate.getFullYear();
  const day = istDate.getDate();

  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const seconds = istDate.getSeconds();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[month - 1];

  const formattedDate = `${monthName} ${day}, ${year}`;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")} IST`;

  return `${formattedDate} ${formattedTime}`;
};

// Example usage
console.log(formatDateTimeString("2024-05-21T12:00:00Z")); // Outputs: May 21, 2024 17:30:00 IST



function viewUploadErrorDetails() {
  uploadDialog.showModal();
}