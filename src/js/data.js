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
  url = "https://armss-be.exitest.com/filter/",
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
  if (data.length !== 0) {
    data = data[1];
    lst = [];
    items = {};
    for (let i of data) {
      if (i[0] in items) {
        if (!items[i[0]].SkillName) {
          items[i[0]].SkillName = new Set();
        }
        items[i[0]].SkillName.add(i[4]);
      } else {
        item = {};
        item.ResumeId = i[0];
        item.FirstName = i[1];
        item.Contact = new Set([[i[2], i[3]]]);
        item.SkillName = new Set([i[4]]);
        item.Experience = new Set([i[5]]);
        items[i[0]] = item;
      }
    }

    lst2 = Object.keys(items);
    for (i of lst2) {
      // console.log(i);
      let li = document.createElement("li");
      let ResumeId = document.createElement("p");
      ResumeId.textContent = items[i]["ResumeId"];
      let FirstName = document.createElement("p");
      FirstName.textContent = items[i].FirstName;
      let contactvalue = Array.from(items[i].Contact);
      let Contact_type = document.createElement("p");
      Contact_type.textContent = contactvalue[0][1];
      let Contact_value = document.createElement("p");
      Contact_value.textContent = contactvalue[0][0];
      let SkillName = document.createElement("p");
      SkillName.textContent = Array.from(items[i].SkillName)
        .slice(0, 10)
        .join(", ");
      let Experience = document.createElement("p");
      Experience.style.paddingLeft = "10px";
      Experience.textContent = Array.from(items[i].Experience)[0];

      li.appendChild(ResumeId);
      li.appendChild(FirstName);
      li.appendChild(Contact_value);
      li.appendChild(SkillName);
      li.appendChild(Experience);

      li.classList.add("headingContainer");
      listItems.appendChild(li);
    }

    if (method === "GET") {
      Filterdata.ResumeIdList.ResumeIdValue.push({ ResumeIdValue: lst2 });
      // console.log(Filterdata);
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

function setIds() {
  SearchFilters = document.getElementById("SearchFilters");
  // SearchInput = document.getElementById("SearchInput");
  SearchItems = document.getElementById("SearchItems");
  SearchButton = document.getElementById("SearchButton");
  chatbot = document.getElementById("Chatbot")
  // listItems = document.getElementById("listItems");

  SearchFilters.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let value = event.target.value;
      value = value.split(",");
      for (let i of value) {
        const data = {
          uniqueId: generateUniqueId(),
          SkillName: i,
        };
        let para = document.createElement("p");
        para.textContent = i + " X ";
        para.id = data.uniqueId;
        para.onclick = function () {
          removeFunction(data.uniqueId);
        };
        SearchItems.appendChild(para);
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

  chatbot.addEventListener("click", function () {

  })
}
