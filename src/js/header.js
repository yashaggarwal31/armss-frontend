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

let clickedButton = "";

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
    console.log("error for notification: ", i, " ", i[6]);
    const status = i[6].status;

    const tempJson = i[2];
    const formattedDate = formatDateTimeString(i[4]);
    console.log(i[2]);
    const notificationJson = JSON.parse(tempJson);

    const fileCount = notificationJson.fileCount;

    const notificationDiv = document.createElement("div");
    notificationDiv.classList.add("sec");

    const txtDiv = document.createElement("div");
    txtDiv.classList.add("txt");
    txtDiv.textContent = `A new upload session of ${fileCount} file${
      fileCount == 1 ? "" : "s"
    } was created!`;

    notificationDiv.appendChild(txtDiv);

    const subDiv = document.createElement("div");
    subDiv.classList.add("txt", "sub", "flex-span");

    const dateSpan = document.createElement("span");
    dateSpan.textContent = formattedDate;

    const statusSpan = document.createElement("span");
    statusSpan.setAttribute("data-values", JSON.stringify(i[6]));

    if (status == "error") {
      statusSpan.classList.add("errorSpan");

      statusSpan.addEventListener("click", (event) => {
        const dataValues = event.target.getAttribute("data-values");
        console.log("onclick ", dataValues);
        viewUploadErrorDetails(dataValues);
      });
      statusSpan.textContent = "Error";
    } else if (status == "inProgress") {
      statusSpan.textContent = "InProgress";
    } else if (status == "success") {
      statusSpan.textContent = "Success";
    }
    // statusSpan.addEventListener('click', () => {
    //   viewUploadErrorDetails();
    // })

    statusSpan.classList.add("UploadinProgress");

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
  const uploadErrorDialog = document.getElementById("uploadDialog");

  const singleResumeViewer = document.getElementById("viewResumesection");
  const multipleResumeViewer = document.getElementById("compareViewResume");

  // console.log('single viewer ', singleResumeViewer)
  // console.log('multiple viewer ', multipleResumeViewer)

  if (
    !notificationContainer.contains(event.target) &&
    !icon.contains(event.target) &&
    !uploadErrorDialog.contains(event.target) &&
    !singleResumeViewer.contains(event.target) &&
    !multipleResumeViewer.contains(event.target)
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

function viewUploadErrorDetails(errorDetailsObj) {
  document.getElementById("duplicate-records").textContent = "";
  errors = JSON.parse(errorDetailsObj);
  console.log("these are error details: ", errors.errors);
  for (error of errors.errors) {
    files = error.split(",");
    console.log("error: ", error);
    console.log("these are files: ", files);
    if (files.length < 2) {
      console.log("file length less than 2??");
      continue;
    }
    createDuplicateRecord(files[0], files[1]);
  }

  uploadDialog.showModal();
}

async function createDuplicateRecord(file1, file2) {
  // filename1 = file1;
  // filename2 = file2;

  // fetch('getLinkAndDateFromFileName', { method: 'POST', body: { 'file1': `${filename1}`, 'file2': `${filename2}` } })
  filename1 = file1.split("!@&")[1];
  filename2 = file2.split("!@&")[1];
  filename1Display = filename1.slice(0, 18);
  filename2Display = filename2.slice(0, 18);
  filename1Display += "...";
  filename2Display += "...";

  let data;
  try {
    const response = await fetch(
      "https://armss-be.exitest.com/getLinkAndDateFromFileName",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file1: file1, file2: file2 }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    data = await response.json();
  } catch (error) {
    console.log(error);
  }

  filelink1 = data.filelink1;
  filelink2 = data.filelink2;
  datetime1 = formatDateTimeString(data.filetime1);
  datetime2 = formatDateTimeString(data.filetime2);

  console.log("response from error api****", data);

  // Create main container div

  const duplicateRecord = document.createElement("div");
  duplicateRecord.className = "duplicate-record";

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.width = "1.5rem";
  checkbox.style.height = "1.5rem";
  checkbox.style.background = "blue";
  checkbox.autocomplete = "off";
  checkbox.name = "checkbox";
  checkbox.setAttribute(
    "data-values",
    JSON.stringify({ file1: file1, file2: file2 })
  );

  duplicateRecord.appendChild(checkbox);

  // Create grid container
  const bothFilesGrid = document.createElement("div");
  bothFilesGrid.className = "both-files-grid";
  duplicateRecord.appendChild(bothFilesGrid);

  // Create first file div
  const fileDiv1 = document.createElement("div");
  fileDiv1.className = "duplicate-record-file-div";
  bothFilesGrid.appendChild(fileDiv1);

  // Create first file details
  const fileDetails1 = document.createElement("div");
  fileDetails1.className = "duplicate-record-file-details";
  fileDiv1.appendChild(fileDetails1);

  const fileName1 = document.createElement("span");
  fileName1.className = "duplicate-record-file-details-name";
  fileName1.textContent = filename1Display;
  fileDetails1.appendChild(fileName1);

  const fileDateTime1 = document.createElement("span");
  fileDateTime1.className = "duplicate-record-file-details-datetime";
  fileDateTime1.textContent = datetime1;
  fileDetails1.appendChild(fileDateTime1);

  // Create first file action
  const flex1 = document.createElement("div");
  flex1.className = "flex items-center";
  fileDiv1.appendChild(flex1);

  const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg1.classList.add("duplicate-action");
  const use1 = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use1.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "./Icons/icons.svg#ActionIcon"
  );
  svg1.appendChild(use1);
  flex1.appendChild(svg1);

  svg1.setAttribute("data-values", JSON.stringify(filelink1));
  svg1.style.cursor = "pointer";

  svg1.addEventListener("click", (event) => {
    const dataValues = event.target.getAttribute("data-values");
    const dataValueslink = JSON.parse(dataValues);
    openSingleFileViewer(dataValueslink);
  });

  // Create second file div
  const fileDiv2 = document.createElement("div");
  fileDiv2.className = "duplicate-record-file-div";
  bothFilesGrid.appendChild(fileDiv2);

  // Create second file details
  const fileDetails2 = document.createElement("div");
  fileDetails2.className = "duplicate-record-file-details";
  fileDiv2.appendChild(fileDetails2);

  const fileName2 = document.createElement("span");
  fileName2.className = "duplicate-record-file-details-name";
  fileName2.textContent = filename2Display;
  fileDetails2.appendChild(fileName2);

  const fileDateTime2 = document.createElement("span");
  fileDateTime2.className = "duplicate-record-file-details-datetime";
  fileDateTime2.textContent = datetime2;
  fileDetails2.appendChild(fileDateTime2);

  // Create second file actions
  const secondActions = document.createElement("div");
  secondActions.className = "second-duplicate-cta-actions";
  fileDiv2.appendChild(secondActions);

  const flex2 = document.createElement("div");
  flex2.className = "flex items-center";
  secondActions.appendChild(flex2);

  const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg2.classList.add("duplicate-action");
  const use2 = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use2.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "./Icons/icons.svg#ActionIcon"
  );
  svg2.appendChild(use2);
  flex2.appendChild(svg2);

  svg2.setAttribute("data-values", JSON.stringify(filelink2));
  svg2.style.cursor = "pointer";

  svg2.addEventListener("click", (event) => {
    const dataValues = event.target.getAttribute("data-values");
    const dataValueslink = JSON.parse(dataValues);
    openSingleFileViewer(dataValueslink);
  });

  const compareSpan = document.createElement("span");
  compareSpan.style.color = "blue";
  compareSpan.style.textDecoration = "underline";
  compareSpan.textContent = "Compare";
  secondActions.appendChild(compareSpan);

  compareSpan.style.cursor = "pointer";

  compareSpan.setAttribute(
    "data-values",
    JSON.stringify(`${filelink1}]!@&[${filelink2}`)
  );

  compareSpan.addEventListener("click", (event) => {
    const dataValues = event.target.getAttribute("data-values");
    const dataValueslink = JSON.parse(dataValues);

    firstDataValueLink = dataValueslink.split("]!@&[")[0];
    secondDataValueLink = dataValueslink.split("]!@&[")[0];

    console.log(
      "compare button clicked: ",
      firstDataValueLink,
      " ",
      secondDataValueLink
    );
    openResumeComparer(firstDataValueLink, secondDataValueLink);
  });

  // Append the complete structure to the container
  document.getElementById("duplicate-records").appendChild(duplicateRecord);
}

document.getElementById("discardBtn").addEventListener("click", (event) => {
  clickedButton = "discard";
});

document.getElementById("replaceBtn").addEventListener("click", (event) => {
  clickedButton = "replace";
});

document
  .getElementById("replaceOrDiscard")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var selectedCheckboxes = document.querySelectorAll(
      'input[name="checkbox"]:checked'
    );
    var dataValues = [];

    selectedCheckboxes.forEach(function (checkbox) {
      dataValues.push(checkbox.dataset.values);
    });

    console.log(dataValues);

    console.log("clickedButton", clickedButton);
  });

// createDuplicateRecord();
// createDuplicateRecord();

// fetchviewdata = async (filename) => {
//   let data = "";

//   let url = new URL("https://armss-be.exitest.com/view-resume");
//   url.search = new URLSearchParams(idvalue).toString();
//   let response = await fetch(url);
//   data = await response.json();
//   if (data) {
//     viewcandidatedata.src = getFileViewerUrl(data);
//   }
//   viewsection.style.display = "flex";
// };

function getFileViewerUrl(fileUrl) {
  const decodedUrl = decodeURIComponent(fileUrl);
  console.log("decoded url: ", decodedUrl);
  const fileExtension = getFileExtension(decodedUrl);
  console.log("extension after decoding: ", fileExtension);

  switch (fileExtension) {
    case "pdf":
      return fileUrl;
    case "doc":
    case "docx":
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        fileUrl
      )}`;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return fileUrl;
    default:
      return fileUrl;
      alert("File type not supported!");
      return "";
  }
}

function getFileExtension(url) {
  const parts = url.split(".");
  console.log("moon", parts);
  if (parts.length > 1) {
    return parts.pop().toLowerCase().split("?")[0];
  }
  return "";
}

function openSingleFileViewer(fileLink) {
  console.log(fileLink);
  console.log("before src: ", fileLink.length);

  document.getElementById("viewresssdata").src = getFileViewerUrl(fileLink);
  console.log("html view resume", document.getElementById("viewresssdata"));
  document.getElementById("viewResumesection").style.display = "flex";
}

document.getElementById("viewdatacloseicon").addEventListener("click", () => {
  document.getElementById("viewResumesection").style.display = "none";
  document.getElementById("viewcandidatedata").src = "";
});

function openResumeComparer(filelink1, filelink2) {
  document.getElementById("resumeViewOne").src = getFileViewerUrl(filelink1);
  document.getElementById("resumeViewTwo").src = getFileViewerUrl(filelink2);

  document.getElementById("compareViewResume").style.display = "flex";
}

document.getElementById("CompareViewClose").addEventListener("click", () => {
  document.getElementById("resumeViewOne").src = "";
  document.getElementById("resumeViewTwo").src = "";
  document.getElementById("compareViewResume").style.display = "none";
});
