let downicon1 = document.getElementById("DownIcon1");
let downicon2 = document.getElementById("DownIcon2");
let SkillsDropdown = document.getElementById("Skillsdropdown");
let ExperienceDropdown = document.getElementById("ExperienceDropdown");

downicon1.addEventListener("click", function () {
  if (SkillsDropdown.style.display === "block") {
    SkillsDropdown.classList.remove("dropdownVisible");
    SkillsDropdown.style.display = "none";

    downicon1.classList.remove("IconStyles");
  } else {
    SkillsDropdown.classList.add("dropdownVisible");
    SkillsDropdown.style.display = "block";
    downicon1.classList.add("IconStyles");
  }
});

downicon2.addEventListener("click", function () {
  if (ExperienceDropdown.style.display === "block") {
    ExperienceDropdown.classList.remove("dropdownVisible");
    ExperienceDropdown.style.display = "none";
    downicon2.classList.remove("IconStyles");
  } else {
    ExperienceDropdown.classList.add("dropdownVisible");
    ExperienceDropdown.style.display = "block";
    ExperienceDropdown.style.right = "12%";
    downicon2.classList.add("IconStyles");
  }
});

function Logout() {
  window.location.replace("https://armss.exitest.com/index.html");
  setCookie(localStorage.getItem("Rsession_name"), " ", -1);
  localStorage.removeItem("Rsession_name");
}
