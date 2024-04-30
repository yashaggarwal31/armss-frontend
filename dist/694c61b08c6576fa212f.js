// Hshing Function
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Login form
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formDataJson = Object.fromEntries(formData.entries());
    const newJsonData = {
      Email: formDataJson.Email,
    };

    const gmailUsernameRegex = /([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+)/g;
    let match;

    while ((match = gmailUsernameRegex.exec(newJsonData.Email)) !== null) {
      newJsonData["UserName"] = match[1];
    }

    digestMessage(formDataJson["Password"]).then(
      (digestHex) => (newJsonData["Password"] = digestHex)
    );

    // console.log(newJsonData)

    let data = {
      UserName: "Archit check",
      Password: "sdffwfwf",
      Email: "abc12131324344@gmail.com",

    };

    console.log(data)


    fetch("https://armss-be.exitest.com/login/", {
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
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the login:", error.message);
      });
  });
