const Skills = document.getElementById("skills");
const Experience = document.getElementById("experience");
const Locations = document.getElementById("location");
const Degree = document.getElementById("degree");
const listItems = document.getElementById("listContainer");
const CandidateDetails = document.getElementById("CandidateDetails");
const InputDetais = document.getElementById("details");
const Submit = document.getElementById("Submit");
const skillstext = document.getElementById("Skills_Text");
const Spinner = document.getElementById("Spinner");
const DegreeText = document.getElementById("Degree_lst");
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

function toShow(data) {
  if (data.length !== 0) {
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
        item.Role = new Set([i[5]]);
        items[i[0]] = item;
      }
    }

    Spinner.classList.add("d-none");

    lst2 = Object.keys(items);
    for (i of lst2) {
      console.log(items[i]);
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
      SkillName.textContent = Array.from(items[i].SkillName).join(", ");
      let Role = document.createElement("p");
      Role.textContent = Array.from(items[i].Role)[0];

      li.appendChild(ResumeId);
      li.appendChild(FirstName);
      li.appendChild(Contact_type);
      li.appendChild(Contact_value);
      li.appendChild(SkillName);
      li.appendChild(Role);

      li.classList.add("listItem");
      listItems.appendChild(li);
    }
  } else {
    let li = document.createElement("li");
    li.textContent = "No data";
    listItems.appendChild(li);
    Spinner.classList.add("d-none");
  }
}

toget = async (Filterdata) => {
  Spinner.classList.remove("d-none");
  data = tocheck(Filterdata);
  await fetch("https://armss-be.exitest.com/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => toShow(data));
};

// CandidateDetails.addEventListener("change", function (event) {
//   if (event.target.value !== "None") {
//     Filterdata.Candidate["check"].push(event.target.value);
//   }
//   console.log(Filterdata);
// });

function generateUniqueId() {
  const randomNumber = Math.random().toString(16).slice(2);
  const timestamp = Date.now().toString(16);
  const uniqueId = timestamp + randomNumber;
  return uniqueId;
}

// Skills.addEventListener("change", function (e) {
//   console.log(e.target.value);
// });

Locations.addEventListener("change", function (event) {
  Filterdata.WorkExperience.Location = [];
  data = {
    uniqueId: generateUniqueId(),
    Location: event.target.value,
  };

  if (event.target.value === "All") {
    Filterdata.WorkExperience.Location = [];
  } else {
    Filterdata.WorkExperience.Location.push(data);
  }
});

Skills.addEventListener("keydown", function (event) {
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
      skillstext.appendChild(para);
      Filterdata.Skill.SkillName.push(data);
    }
    Skills.value = "";
  }
});

Degree.addEventListener("change", function (event) {
  Filterdata.Education.Degree = [];

  data = {
    uniqueId: generateUniqueId(),
    Degree: event.target.value,
  };
  // DegreeText.textContent = DegreeText.textContent + event.target.value + " X ";
  if (event.target.value === "All") {
    Filterdata.Education.Degree = [];
  } else {
    Filterdata.Education.Degree.push(data);
  }
});

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

Experience.addEventListener("change", function (event) {
  Filterdata.Candidate.experience = [];

  data = {
    uniqueId: generateUniqueId(),
    experience: event.target.value,
  };
  if (event.target.value === "All") {
    Filterdata.Candidate.experience = [];
  } else {
    Filterdata.Candidate.experience.push(data);
  }
});

Submit.addEventListener("click", function () {
  toget(Filterdata);
  console.log(Filterdata);
  listItems.innerHTML = "";
});

window.onload = () => {
  toget(Filterdata);
};
