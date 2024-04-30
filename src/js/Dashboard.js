let containerList = document.getElementById("ContainerList");
let Categorysvalue = document.getElementById("Categorys");

toDataPage = async (value) => {
  const encodedData = encodeURIComponent(JSON.stringify(value));
  window.location.href = `data.html?data=${encodedData}`;
};

createListitems = (i) => {
  let li = document.createElement("li");
  li.classList.add("listitem");
  let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let div = document.createElement("div");
  let h4 = document.createElement("h4");
  icon.setAttribute("class", "DashboardFolderIcon");
  let useElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );
  useElement.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "href",
    "./Icons/icons.svg#categoryicon"
  );
  h4.textContent = i;
  icon.appendChild(useElement);
  div.appendChild(icon);
  div.setAttribute("class", "DashboardFolderIcon");
  li.appendChild(div);
  li.appendChild(h4);

  li.id = i;
  li.addEventListener("click", togetdata);
  containerList.append(li);
};

toDisplayFloder = (data) => {
  Categorysvalue.textContent = data.length;
  for (i of data) {
    createListitems(i);
  }
};

// toCreateNewCategory

function togetdata() {
  toDataPage(this.id);
  document
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("ContainerListactive"));
  this.classList.add("ContainerListactive");
}

togetFolders = async () => {
  let url = new URL("https://armss-be.exitest.com/SkillMappers");
  await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((responseData) => toDisplayFloder(responseData));
};

togetFolders();

window.onload = () => {
  isLogout();
};

document.addEventListener("DOMContentLoaded", async () => {
  await getHtml();
});
