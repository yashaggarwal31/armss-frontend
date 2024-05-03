const CategoryCreate = document.getElementById("CategoryCreate");

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

removeFunction = (id) => {
  const para1 = document.getElementById(id);
  console.log(para1);
  para1.parentNode.removeChild(para1);
  Filterdata.Skill.SkillName = Filterdata.Skill.SkillName.filter(
    (item) => item.uniqueId !== id
  );
};

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
    .then((data) => toShowData(data));
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
  if (dataString) {
    const data = JSON.parse(decodeURIComponent(dataString));
    document.getElementById("heading").textContent = data;

    let data1 = {
      category_data: data,
    };
    let url = new URL("https://armss-be.exitest.com/displayskillmap/");
    url.search = new URLSearchParams(data1).toString();
    method = "GET";
    toget(url, method);
  }
});

function toShowData(data) {
  listItems.innerHTML = "";
  lst = [];
  if (data.length !== 0) {
    data = data[1];
    TotalValue.textContent = data.length;
    for (let i in data) {
      lst.push(i);
      let li = document.createElement("li");
      let FirstName = document.createElement("p");
      FirstName.textContent = data[i].FirstName;

      let Role = document.createElement("p");
      Role.textContent = data[i].Role;

      let SkillName = document.createElement("button");
      SkillName.classList.add("SkillElement");
      SkillName.textContent = "UI";
      // SkillName.addEventListener("mouseover", () => {
      //   content = Array.from(items[i].SkillName);
      //   toUpadteSkillContainer(Array.from(items[i].SkillName).join(", "));
      //   SkillsContainer.style.display = "block";
      // });
      // SkillName.addEventListener("mouseout", () => {
      //   SkillsContainer.textContent = "";
      //   SkillsContainer.style.display = "none";
      // });

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

      li.appendChild(FirstName);
      li.appendChild(Role);
      li.appendChild(SkillName);
      li.appendChild(Experience);
      li.appendChild(Email);
      li.appendChild(Location);
      li.appendChild(Phone_no);
      li.appendChild(UploadDate);

      li.classList.add("elementStyle");
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
      ExperienceDropdownFunction();

      if (data.experience === "All") {
        Filterdata.Candidate.experience = [];
      } else {
        const [start, end] = this.getAttribute("data-value")
          .split("-")
          .map(Number);
        function range(start, end) {
          for (var i = start; i < end; i++) {
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

toUpdateSkillContainer = function (data) {
  SkillsContainer.textContent = data;
};

function setIds() {
  SearchFilters = document.getElementById("SearchFilters");
  TotalValue = document.getElementById("TotalValue");
  SkillsContainer = document.getElementById("SkillsContainer");
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
  SearchFilters.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let value = event.target.value;
      value = value.split(",");
      for (let i of value) {
        const data = {
          uniqueId: generateUniqueId(),
          SkillName: i,
        };
        let li = document.createElement("li");
        li.textContent = i;
        li.id = data.uniqueId;
        li.onclick = function () {
          removeFunction(data.uniqueId);
        };
        SearchItems.appendChild(li);
        Filterdata.Skill.SkillName.push(data);
      }
      SearchFilters.value = "";
    }
  });

  SearchButton.addEventListener("click", function () {
    toget();
    console.log(Filterdata);
    listItems.innerHTML = "";
  });

  chatbot.addEventListener("click", function () {});
}

toappendSkills = (data) => {
  for (let i of data.SkillList) {
    let li = document.createElement("li");
    li.textContent = i;
    li.id = i;
    li.setAttribute("data-value", i);
    li.addEventListener("click", () => {
      SkillValue.textContent = li.id === "All" ? "Skill" : li.id;
      if (li.id === "All") {
        Filterdata.Skill.SkillName = [];
      } else {
        Filterdata.Skill.SkillName.push({
          uniqueId: generateUniqueId(),
          SkillName: li.id,
        });
      }
      SkillDropdownFunction();
      toget();
    });
    SkillList.appendChild(li);
  }
};

toappendLocation = (data) => {
  for (let i of data.States) {
    let li = document.createElement("li");
    li.textContent = i;
    li.id = i;
    li.setAttribute("data-value", i);
    li.addEventListener("click", () => {
      Filterdata.WorkExperience.Location = [];
      LocationValue.textContent = li.id === "All" ? "Location" : li.id;
      if (li.id === "All") {
        Filterdata.WorkExperience.Location = [];
      } else {
        Filterdata.WorkExperience.Location.push({
          uniqueId: generateUniqueId(),
          Location: li.id,
        });
      }
      LocationdropdownFunction();
      toget();
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
  } else {
    Locationdropdown.classList.add("dropdownVisible");
    Locationdropdown.style.display = "block";
    downicon1.classList.add("IconStyles");
  }
};
let ExperienceDropdownFunction = () => {
  if (ExperienceDropdown.style.display === "block") {
    ExperienceDropdown.classList.remove("dropdownVisible");
    ExperienceDropdown.style.display = "none";
    downicon2.classList.remove("IconStyles");
  } else {
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
  } else {
    SkillDropdown.classList.add("dropdownVisible");
    SkillDropdown.style.display = "block";
    SkillDropdown.style.right = "14.8%";
    downicon3.classList.add("IconStyles");
  }
};

LocationHeader.addEventListener("click", LocationdropdownFunction);
ExperienceHeader.addEventListener("click", ExperienceDropdownFunction);
SkillHeader.addEventListener("click", SkillDropdownFunction);
FetchingLocation();
