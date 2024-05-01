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

function Logout() {
  window.location.replace("index.html");
  setCookie(localStorage.getItem("Rsession_name"), " ", -1);
  localStorage.removeItem("Rsession_name");
}
