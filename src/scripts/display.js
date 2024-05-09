// let myVariable = window.myVariable;
let send_data_str = localStorage.getItem("send_data");
let send_data = JSON.parse(send_data_str);
let res = localStorage.getItem("resumeids");
let resumeids = JSON.parse(res);
// sendDATA["count"] = 10
// window.myVariable = sendDATA
console.log("Before change:", send_data);
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
async function onDomLoaded() {
  TotalValue = document.getElementById("TotalValue");
  await getHtml();
  // Your JavaScript code goes here
  console.log("DOM has fully loaded");
  fetchData();
  // Add any other code you want to execute
}
// Add an event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", onDomLoaded);
// let listItems = document.getElementById("listItems");
// var filterJson = require('filterLog.json')
// console.log(filterJson)
function fetchData() {
  // console.log(send_data["resume_filters"]);
  console.log("localstorage data", resumeids);
  console.log(JSON.stringify(resumeids));
  // fetch("https://armss-be.exitest.com/displayfilter", {
  fetch("https://armss-be.exitest.com/full_resume_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resumeids),
  })
    .then((response) => response.json())
    // .then((data) => {
    //     console.log(data);
    // })
    .then((data) => {
      console.log("got data", data);
      toShowData(data);
      // resumes = data[0].slice(0, 10);
      // // console.log(resumes.slice(0, 5))
      // // console.log(data[1].slice(0, 10));
      // resumes.map((record) => {
      //     const messageElement = document.createElement('p');
      //     messageElement.classList.add('left');
      //     messageElement.textContent = `${record[1]}  (${record[4].slice[0, 8]}) - ${record[5].slice[0, 8]}`;
      //     chatSpace.appendChild(messageElement);
      // });
      // send_data["resume_filters"] = data[1]
      // console.log(query)
      // console.log(send_data)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// function toShowData(data) {
//   if (data.length !== 0) {
//     // data = data[0];
//     // lst = [];
//     // items = {};
//     for (let i of data) {
//       // console.log(i);
//       let li = document.createElement("li");
//       let ResumeId = document.createElement("p");
//       ResumeId.textContent = i[0];
//       let FirstName = document.createElement("p");
//       FirstName.textContent = i[1];
//       // let contactvalue = Array.from(items[i].Contact);
//       let Contact_type = document.createElement("p");
//       Contact_type.textContent = i[2];
//       let Contact_value = document.createElement("p");
//       Contact_value.textContent = i[3];
//       let SkillName = document.createElement("button");
//       SkillName.classList.add("SkillElement");
//       SkillName.textContent = "Skills";
//       SkillName.addEventListener("mouseover", () => {
//         // content = Array.from(items[i].SkillName);
//         toUpadteSkillContainer(i[4]);
//         SkillsContainer.style.display = "block";
//       });
//       SkillName.addEventListener("mouseout", () => {
//         SkillsContainer.textContent = "";
//         SkillsContainer.style.display = "none";
//       });
//       let Experience = document.createElement("button");
//       Experience.classList.add("SkillElement");
//       Experience.textContent = "Experience";
//       Experience.addEventListener("mouseover", () => {
//         // content = Array.from(items[i].SkillName);
//         toUpadteSkillContainer(i[5]);
//         SkillsContainer.style.display = "block";
//       });
//       Experience.addEventListener("mouseout", () => {
//         SkillsContainer.textContent = "";
//         SkillsContainer.style.display = "none";
//       });
//       li.appendChild(ResumeId);
//       li.appendChild(FirstName);
//       li.appendChild(Contact_value);
//       li.appendChild(SkillName);
//       li.appendChild(Experience);
//       li.classList.add("elementStyle");
//       listItems.appendChild(li);
//     }
//     // if (method === "GET") {
//     //     Filterdata.ResumeIdList.ResumeIdValue = lst2;
//     //     // console.log(Filterdata);
//     // }
//   } else {
//     let li = document.createElement("li");
//     li.textContent = "No data";
//     listItems.appendChild(li);
//   }
// }
function toShowData(data) {
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