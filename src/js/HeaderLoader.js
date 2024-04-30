getHtml = async () => {
  try {
    const response = await fetch("Header.html");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, "text/html");

    // const temContainer = document.createElement("div");
    // temContainer.innerHTML = data;
    const scripts = htmlDocument.querySelectorAll("script");
    for (i of scripts) {
      var script = document.createElement("script");
      script.src = i.src;
      document.body.appendChild(script);

      // console.log(scripts)
    }


    const specificContainer = htmlDocument.querySelector("#HeaderContainer");
    specificContainer.childNodes.forEach((node) => {
      document.getElementById("Header").appendChild(node.cloneNode(true));
    });

    console.log("Complete");
  } catch (error) {
    console.error("Error fetching header:", error);
  }
};

// document.addEventListener("DOMContentLoaded", function () {
//   getHtml();
// });

// document.addEventListener("DOMContentLoaded", async function () {
//   await getHtml();
// });

// window.onload = async () => {
//   await getHtml();
// };

window.getHtml = getHtml;
