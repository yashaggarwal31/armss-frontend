const FilteringData = {
  FetchedData: [],
  LocationCities: [],
  Skills: [],
  AllSkills: [],
  onSelectSubFolder: "",
  onFolderValue: true,
  page: "",
  chatbotResumeIds: [],
  chatbotData: false,
  QueryonProcess: false,
};

console.log(FilteringData);

let loaded = false;

window.onload = () => {
  isLogout();
};
document.addEventListener("DOMContentLoaded", async () => {
  if (FilteringData.page === "") {
    // FilteringData.page = "main";
    await getHtml();
    await getMainHtml(true);
  } else if (FilteringData.page === "main") {
    // FilteringData.page = "data";
    await getMainHtml(false);
  } else {
    // FilteringData.page = "main";
    await getContentHtml();
  }
});

async function triggerDOMContentLoaded() {
  const DOMContentLoadedEvent = new Event("DOMContentLoaded");
  console.log(FilteringData.page);
  document.dispatchEvent(DOMContentLoadedEvent);
}

// refresh

window.addEventListener("beforeunload", function (event) {
  // event.preventDefault();
  return false;
});

const Filterdata = {
  Candidate: {
    check: [],
    FirstName: [],
    LastName: [],
    Experience: [],
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

window.triggerDOMContentLoaded = triggerDOMContentLoaded;
