const CategoryCreate = document.getElementById("CategoryCreate");

const FilteringData = {
  ItesmIds: [],
  LocationCities: [],
  Skills: [],
};

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

// removeFunction = (id) => {
//   const para1 = document.getElementById(id);
//   console.log(para1);
//   para1.parentNode.removeChild(para1);
//   Filterdata.Skill.SkillName = Filterdata.Skill.SkillName.filter(
//     (item) => item.uniqueId !== id
//   );
// };

tocheck = (data) => {
  data = JSON.parse(JSON.stringify(data));
  for (let i of Object.keys(data)) {
    for (let j of Object.keys(data[i])) {
      if (data[i][j].length > 0 && j !== "check") {
        data[i]["check"].push(j);
        data[i][j] = data[i][j].map((item) => item[j]);
      } else {
        if (j !== "check") {
          delete data[i][j];
        }
      }
    }
  }
  console.log(data);
  return data;
};

Filteritem = {
  ResumeId: "",
  FirstName: "",
  Contact: new Set(),
  SkillName: new Set(),
  Role: new Set(),
};

toget = async (
  url = "https://armss-be.exitest.com/displayfilter/",
  method = "POST",
  Filteringdata = Filterdata
) => {
  let data = method === "POST" ? tocheck(Filteringdata) : "";
  console.log(url, method, data);
  options =
    method === "GET"
      ? { method: method }
      : {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };

  await fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => toShowData(data, method));
};

function generateUniqueId() {
  const randomNumber = Math.random().toString(16).slice(2);
  const timestamp = Date.now().toString(16);
  const uniqueId = timestamp + randomNumber;
  return uniqueId;
}

// Skills.addEventListener("change", function (e) {
//   console.log(e.target.value);
// });

// Locations.addEventListener("change", function (event) {
//   Filterdata.WorkExperience.Location = [];
//   data = {
//     uniqueId: generateUniqueId(),
//     Location: event.target.value,
//   };

//   if (event.target.value === "All") {
//     Filterdata.WorkExperience.Location = [];
//   } else {
//     Filterdata.WorkExperience.Location.push(data);
//   }
// });

// Skills.addEventListener("keydown", function (event) {
//   if (event.key === "Enter") {
//     let value = event.target.value;
//     value = value.split(",");
//     for (let i of value) {
//       const data = {
//         uniqueId: generateUniqueId(),
//         SkillName: i,
//       };
//       let para = document.createElement("p");
//       para.textContent = i + " X ";
//       para.id = data.uniqueId;
//       para.onclick = function () {
//         removeFunction(data.uniqueId);
//       };
//       skillstext.appendChild(para);
//       Filterdata.Skill.SkillName.push(data);
//     }
//     Skills.value = "";
//   }
// });

// Degree.addEventListener("change", function (event) {
//   Filterdata.Education.Degree = [];

//   data = {
//     uniqueId: generateUniqueId(),
//     Degree: event.target.value,
//   };
//   // DegreeText.textContent = DegreeText.textContent + event.target.value + " X ";
//   if (event.target.value === "All") {
//     Filterdata.Education.Degree = [];
//   } else {
//     Filterdata.Education.Degree.push(data);
//   }
// });

// InputDetais.addEventListener("keydown", function (event) {
//   if (event.key === "Enter" && InputDetais.value !== "") {
//     if (CandidateDetails.value !== "None") {
//       const data = {
//         uniqueId: generateUniqueId(),
//         details: event.target.value,
//       };
//       Filterdata.Candidate[CandidateDetails.value].push(data);
//       console.log(Filterdata);
//       InputDetais.value = "";
//     } else {
//       alert("Please select a candidate above Option");
//     }
//   }
// });

// Experience.addEventListener("change", function (event) {
//   Filterdata.Candidate.experience = [];

//   data = {
//     uniqueId: generateUniqueId(),
//     experience: event.target.value,
//   };
//   if (event.target.value === "All") {
//     Filterdata.Candidate.experience = [];
//   } else {
//     Filterdata.Candidate.experience.push(data);
//   }
// });

// Submit.addEventListener("click", function () {
//   toget(Filterdata);
//   console.log(Filterdata);
//   listItems.innerHTML = "";
// });

// Prams from pages
function getQueryParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", async function () {
  await getHtml();
  setIds();

  const dataString = getQueryParam("data");
  const value = getQueryParam("value");

  if (dataString) {
    const data = JSON.parse(decodeURIComponent(dataString));
    document.getElementById("heading").textContent = data;

    if (value === false) {
      let data1 = {
        query: data,
      };
      let url = new URL("https://armss-be.exitest.com/search_query/");
      method = "POST";
      toget(url, method, data1);
    } else {
      let data1 = {
        category_data: data,
      };
      let url = new URL("https://armss-be.exitest.com/displayskillmap/");
      url.search = new URLSearchParams(data1).toString();
      method = "GET";
      toget(url, method);
    }
  }
});

// Show Skill Container
toUpdateSkillContainer = function (data, id, item, interval) {
  let Listid = document.getElementById(id);
  let Listitem = document.getElementById(item);

  data = data.sort((a, b) => a.length - b.length);

  Listitem.innerHTML = "";
  for (let i of data) {
    let li = document.createElement("span");
    li.textContent = i;
    Listitem.appendChild(li);
  }
  // Listid.appendChild(Listitem);
  Listitem.style.display = "flex";
  Listid.style.position = "relative";
};

toHideSkillContainer = function (id, item) {
  let Listid = document.getElementById(id);
  let Listitem = document.getElementById(item);

  // Listid.removeChild(Listitem);

  Listitem.addEventListener("mouseover", () => {
    Listitem.style.display = "flex";
    Listid.style.position = "relative";
    clearTimeout(interval);
  });

  Listitem.addEventListener("mouseout", () => {
    Listitem.style.display = "none";
    Listid.style.position = "";
  });

  interval = setTimeout(() => {
    Listitem.style.display = "none";
    Listid.style.position = "";
  }, 50);
};
let method = "";
function toShowData(data, method = method) {
  console.log(data);
  listItems.innerHTML = "";
  lst = [];
  if (data.length !== 0) {
    TotalValue.textContent = data[0];
    data = data[1];
    let interval;
    for (let i in data) {
      lst.push(i);
      let li = document.createElement("li");
      li.id = i;
      let FirstName = document.createElement("p");
      FirstName.textContent = data[i].FirstName;

      let Role = document.createElement("p");
      Role.textContent = data[i].Role;

      let SkillName = document.createElement("button");
      SkillName.id = i;
      SkillName.classList.add("SkillElement");
      SkillName.textContent = "Skills";

      SkillName.addEventListener("mouseover", () => {
        let values = data[i].SkillName;
        toUpdateSkillContainer(values, li.id, ul.id, interval);
        clearTimeout(interval);
      });

      SkillName.addEventListener("mouseout", () => {
        toHideSkillContainer(li.id, ul.id);

        // ul.addEventListener("mouseover", () => {
        //   let values = data[i].SkillName;
        //   toUpdateSkillContainer(values, li.id, ul.id, interval);
        // });
      });

      let Experience = document.createElement("p");
      Experience.textContent = data[i].Experience + " Years";

      let Email = document.createElement("p");
      Email.textContent = data[i].Contact_Email;

      let Location = document.createElement("p");
      Location.textContent = data[i].Location;

      let Phone_no = document.createElement("p");
      Phone_no.textContent = data[i].Contact_Phone;

      let UploadDate = document.createElement("p");
      UploadDate.textContent = data[i].UploadDate;

      let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      let useElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      useElement.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        "./Icons/icons.svg#ActionIcon"
      );

      let ul = document.createElement("li");
      ul.id = "SkillsContainer" + i;
      ul.classList.add("SkillsContainer");

      icon.appendChild(useElement);
      li.appendChild(FirstName);
      li.appendChild(Role);
      li.appendChild(SkillName);
      li.appendChild(Experience);
      li.appendChild(Email);
      li.appendChild(Location);
      li.appendChild(Phone_no);
      li.appendChild(UploadDate);
      li.appendChild(icon);
      li.appendChild(ul);

      className =
        toCheckRecent(data[i].UploadDate) < 3 ? "RecentElements" : "None";
      li.classList.add("elementStyle", className);

      listItems.appendChild(li);
    }

    if (method === "GET") {
      Filterdata.ResumeIdList.ResumeIdValue.push({ ResumeIdValue: lst });
      console.log(Filterdata);
    }
  } else {
    let li = document.createElement("li");
    li.textContent = "No data";
    listItems.appendChild(li);
  }
}

// Check Recent

function toCheckRecent(data) {
  if (data) {
    const [day, month, year] = data.split("-").map(Number);
    const date1 = new Date(year, month - 1, day);
    const date2 = new Date();

    const differenceMs = Math.abs(date2 - date1);

    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return differenceDays;
  }
}

// toCheckRecent("02-05-2024");
// toshowdata = async (data) => {
//   vale = {
//     data: data,
//   };
//   await fetch("https://armss-be.exitest.com/Resumeslist", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(vale),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((response) => console.log(response));
// };

// window.onload = () => {
//   document.addEventListener("DOMContentLoaded", function () {
//     console.log("Start");
//     getHtml();
//     console.log("End");
//   });
//   console.log(document.getElementById("SearchItems"));
// };
// window.onload = () => {
// document.addEventListener("DOMContentLoaded", function () {
//   // console.log("Start");
//   // getHtml();
//   // console.log("End");
//   console.log(document.getElementById("SearchFilters"));
// });
// };

// window.onload = async () => {
//   await getHtml();
//   console.log(document.getElementById("SearchItems"));
// };

// console.log(document.getElementById("SearchItems"));

// Experience

let DropdownSelectFunction = (data) => {
  var listItems = data.getElementsByTagName("li");
  let lst = ["All", "0-1", "1-2", "2-3", "3-6", "6-9", "9-10"];
  for (var i = 0; i < listItems.length; i++) {
    listItems[i].setAttribute("data-value", lst[i]);
    listItems[i].addEventListener("click", function () {
      Filterdata.Candidate.experience = [];

      let Value = document.getElementById(this.id).textContent;
      console.log(Value);
      let Experiencetitle = document.getElementById("ExperienceValue");

      Experiencetitle.textContent = Value !== "All" ? Value : "Experience";
      // ExperienceDropdownFunction();

      if (data.experience === "All") {
        Filterdata.Candidate.experience = [];
      } else {
        const [start, end] = this.getAttribute("data-value")
          .split("-")
          .map(Number);
        function range(start, end) {
          for (var i = start; i <= end; i++) {
            Filterdata.Candidate.experience.push({
              uniqueId: generateUniqueId(),
              experience: i,
            });
          }
        }
        range(start, end);
      }
      toget();
    });
  }
};

function setIds() {
  SearchFilters = document.getElementById("SearchFilters");
  TotalValue = document.getElementById("TotalValue");
  chatbot = document.getElementById("Chatbot");
  // SearchInput = document.getElementById("SearchInput");
  SearchItems = document.getElementById("SearchItems");
  SearchButton = document.getElementById("SearchButton");
  // listItems = document.getElementById("listItems");
  ExperienceList = document.getElementById("ExperienceList");
  SkillSuggestions = document.getElementById("SkillSuggestions");
  LocationSuggestions = document.getElementById("LocationSuggestions");
  SuggestionContainer = document.getElementById("SuggestionContainer");
  LocationValue = document.getElementById("LocationValue");

  console.log(SuggestionContainer);
  DropdownSelectFunction(ExperienceList);
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
  //     SearchFilters.value = "";
  //   }
  // });

  // SearchButton.addEventListener("click", function () {
  //   toget();
  //   console.log(Filterdata);
  //   listItems.innerHTML = "";
  // });

  chatbot.addEventListener("click", function () {});
}

toappendSkills = (data) => {
  SkillList.innerHTML = "";
  // data = data.SkillList !== undefined ? data.SkillList : data;
  data = data.SkillList.sort((a, b) => a.localeCompare(b));
  for (let i of data) {
    let li = document.createElement("li");
    li.textContent = i;
    li.id = i;
    li.setAttribute("data-value", i);
    li.addEventListener("click", () => {
      if (li.id === "All") {
        Filterdata.Skill.SkillName = [];
      } else {
        let values = Filterdata.Skill.SkillName.find(
          (item) => item.SkillName === li.id
        );
        if (!values) {
          let Unique_id = generateUniqueId();
          Filterdata.Skill.SkillName.push({
            uniqueId: Unique_id,
            SkillName: li.id,
          });
          toAppendHistory(li.id, Unique_id, SkillSearchHistory);
          toCheckSearchHistory();
        }
      }
      // SkillDropdownFunction();
      // toget();
    });
    SkillList.appendChild(li);
  }
};

toappendLocation = (data) => {
  Locationlist.innerHTML = "";
  data = data.States !== undefined ? data.States : data;
  for (let i of data) {
    let li = document.createElement("li");
    li.textContent = i;
    li.id = i;
    li.setAttribute("data-value", i);
    li.addEventListener("click", () => {
      // LocationValue.textContent = li.id === "All" ? "Location" : li.id;
      if (li.id === "All") {
        LocationSearchHistory.innerHTML = "";
        Filterdata.WorkExperience.Location = [];
        toCheckSearchHistory();
      } else {
        let values = Filterdata.WorkExperience.Location.find(
          (item) => item.Location === li.id
        );
        if (!values) {
          Unique_id = generateUniqueId();
          toAppendHistory(li.id, Unique_id, LocationSearchHistory);

          Filterdata.WorkExperience.Location.push({
            uniqueId: Unique_id,
            Location: li.id,
          });
          console.log(Filterdata.WorkExperience);
          toCheckSearchHistory();
        }
      }
      // LocationdropdownFunction();
      // toget();
    });
    Locationlist.appendChild(li);
  }
};

FetchingLocation = () => {
  fetch("./assets/Data/SuggestionsList.json")
    .then((response) => response.json())
    .then((data) => {
      toappendLocation(data);
      toappendSkills(data);
      FilteringData.LocationCities = [
        ...FilteringData.LocationCities,
        ...data.States,
      ];
      FilteringData.Skills = [...data.SkillList];
    });
};

// Dropdowncode
let downicon1 = document.getElementById("DownIcon1");
let downicon2 = document.getElementById("DownIcon2");
let downicon3 = document.getElementById("DownIcon3");
let Locationdropdown = document.getElementById("Locationdropdown");
let ExperienceDropdown = document.getElementById("ExperienceDropdown");
let SkillDropdown = document.getElementById("SkillDropdown");
let LocationHeader = document.getElementById("Location-Header");
let ExperienceHeader = document.getElementById("Experience-Header");
let SkillHeader = document.getElementById("Skill-Header");
let SkillList = document.getElementById("SkillList");
let SkillValue = document.getElementById("SkillValue");

let LocationdropdownFunction = () => {
  if (Locationdropdown.style.display === "block") {
    Locationdropdown.classList.remove("dropdownVisible");
    Locationdropdown.style.display = "none";
    downicon1.classList.remove("IconStyles");
    LocationHeader.style.boxShadow = "none";
  } else {
    LocationHeader.style.boxShadow = "0px 2px 2px 0px #f4f2ff";
    Locationdropdown.classList.add("dropdownVisible");
    Locationdropdown.style.display = "block";
    downicon1.classList.add("IconStyles");
    SearchLocation.value = "";
    FetchingLocation();
  }
};
let ExperienceDropdownFunction = () => {
  if (ExperienceDropdown.style.display === "block") {
    ExperienceDropdown.classList.remove("dropdownVisible");
    ExperienceDropdown.style.display = "none";
    downicon2.classList.remove("IconStyles");
    ExperienceHeader.style.boxShadow = "none";
  } else {
    ExperienceHeader.style.boxShadow = "0px 2px 2px 0px #f4f2ff";
    ExperienceDropdown.classList.add("dropdownVisible");
    ExperienceDropdown.style.display = "block";
    ExperienceDropdown.style.right = "29.8%";
    downicon2.classList.add("IconStyles");
  }
};

let SkillDropdownFunction = () => {
  if (SkillDropdown.style.display === "block") {
    SkillDropdown.classList.remove("dropdownVisible");
    SkillDropdown.style.display = "none";
    downicon3.classList.remove("IconStyles");
    SkillHeader.style.boxShadow = "none";
    document.getElementById("SearchSkills").value = "";
  } else {
    SkillHeader.style.boxShadow = "0px 2px 2px 0px #f4f2ff";
    SkillDropdown.classList.add("dropdownVisible");
    SkillDropdown.style.display = "block";
    SkillDropdown.style.right = "14.8%";
    downicon3.classList.add("IconStyles");
    FetchingLocation();
  }
};

LocationHeader.addEventListener("click", LocationdropdownFunction);
ExperienceHeader.addEventListener("click", ExperienceDropdownFunction);
SkillHeader.addEventListener("click", SkillDropdownFunction);
FetchingLocation();

//  Fetching All Cities

let FetchCities = async () => {
  let response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/cities",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: "India",
      }),
    }
  );
  let data = await response.json();

  FilteringData.LocationCities = [
    ...FilteringData.LocationCities,
    ...data.data,
  ];
};

FetchCities();

// Search Location Functionality
SearchLocation = document.getElementById("SearchLocation");
SearchLocation.addEventListener("input", (event) => {
  data = FilteringData.LocationCities.filter((item) =>
    item.toLowerCase().includes(event.target.value.toLowerCase())
  );
  data = new Set(data);
  toappendLocation([...data]);
});

// Append Loaction History

LocationSearchHistory = document.getElementById("LocationSearchHistory");

removeFunction = (id, item) => {
  const para1 = document.getElementById(id);
  para1.parentNode.removeChild(para1);

  if (item.id === "LocationSearchHistory") {
    Filterdata.WorkExperience.Location =
      Filterdata.WorkExperience.Location.filter((item) => item.uniqueId !== id);
  } else {
    Filterdata.Skill.SkillName = Filterdata.Skill.SkillName.filter(
      (item) => item.uniqueId !== id
    );
    console.log(Filterdata.Skill.SkillName);
  }

  toget();
  toCheckSearchHistory();
};

function toAppendHistory(data, id, list) {
  let li = document.createElement("li");
  li.textContent = data;
  li.id = id;
  li.addEventListener("click", () => {
    removeFunction(li.id, list);
    toCheckSearchHistory();
  });
  list.appendChild(li);
}

//  Search History
SearchHistoryContainer = document.getElementById("SearchHistoryContainer");

function toCheckSearchHistory() {
  let LocationHistory = Filterdata.WorkExperience.Location.length;
  let SkillHistory = Filterdata.Skill.SkillName.length;
  let ExperienceHistory = Filterdata.Candidate.experience.length;

  if (LocationHistory + SkillHistory + ExperienceHistory === 0) {
    SearchHistoryContainer.style.display = "none";
  } else {
    SearchHistoryContainer.style.display = "grid";
  }
}

toCheckSearchHistory();

// Clear History
document.getElementById("ClearHistory").addEventListener("click", function () {
  Filterdata.WorkExperience.Location = [];
  Filterdata.Skill.SkillName = [];
  Filterdata.Candidate.experience = [];
  ExperienceValue.textContent = "Experience";
  LocationSearchHistory.innerHTML = "";
  SearchHistoryContainer.style.display = "none";
  toget();
});

// Search Skills

document
  .getElementById("SearchSkills")
  .addEventListener("input", function (event) {
    data = FilteringData.Skills.filter((item) =>
      item.toLowerCase().includes(event.target.value.toLowerCase())
    );
    toappendSkills({ SkillList: data });
  });
