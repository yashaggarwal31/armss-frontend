const uploadDiv = document.getElementById("upload-zone");
const fileInput = document.getElementById("fileInput");
const drivelink = document.getElementById("drivelink");
const filesList = document.getElementById("fileList");

uploadDiv.addEventListener("click", function (event) {
  if (event.target !== drivelink) {
    // If not, trigger the file input click event
    fileInput.click();
  }
});

// Add drag-and-drop event listeners to the div
uploadDiv.addEventListener("dragover", function (event) {
  // Prevent default behavior to allow dropping
  event.preventDefault();
  uploadDiv.classList.add("dragging");
});

uploadDiv.addEventListener("dragleave", function () {
  // Remove dragging style when drag leaves the div
  uploadDiv.classList.remove("dragging");
});

uploadDiv.addEventListener("drop", function (event) {
  // Prevent default behavior and stop event propagation
  event.preventDefault();
  uploadDiv.classList.remove("dragging");

  // Access the dropped files
  const files = event.dataTransfer.files;

  // Set the dropped files in the file input element
  fileInput.files = files;

  document.getElementById("FileRefCount").innerHTML = fileInput.files.length;
  document.getElementById("FileRefCount-div").style.display = "block";

  // Optional: Handle the file selection
  if (files.length > 0) {
    console.log("Dropped files:", files);
    // Perform desired action with the files (e.g., uploading)
  }
});

fileInput.addEventListener("change", function () {
  document.getElementById("upload-btn").disabled = false;
  document.getElementById("upload-btn").style.display = "block";
  document.getElementById("upload-click-div").style.display = "none";

  const files = fileInput.files;
  // console.log('files length', files.length)
  document.getElementById("FileRefCount").innerHTML = files.length;
  document.getElementById("FileRefCount-div").style.display = "block";

  // Clear previous list
  filesList.innerHTML = "";

  // if (files.length > 0) {
  //     // Apply CSS class when files are selected
  //     uploadDiv.classList.add('hasFiles');

  //     // Display the list of uploaded files
  //     const ul = document.createElement('ul');
  //     for (let i = 0; i < files.length; i++) {
  //         const li = document.createElement('li');
  //         li.textContent = files[i].name;
  //         ul.appendChild(li);
  //     }
  //     filesList.appendChild(ul);
  // } else {
  //     // Remove CSS class if no files are selected
  //     uploadDiv.classList.remove('hasFiles');
  // }
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("upload-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Upload button clicked, about to call upload function.");
      upload();
    });
});

let uploadedCount = 0;
let totalFileCount = 0;
let errorCount = 0;
let progressBarOverall;
const maxFileSize = 2000 * 1024 * 1024; //2MB
const uploadingDIV = document.getElementById("upload-click-div");
const uploadCount = document.getElementById("uploadCount");
const totalCount = document.getElementById("totalCount");
const errorCounter = document.getElementById("errorCount");
const errorTotal = document.getElementById("errorTotal");

const upload = async () => {
  uploadedCount = 0;
  totalFileCount = 0;
  errorCount = 0;

  const fileList = document.getElementById("fileInput").files;
  const total = fileList.length;
  totalFileCount = total;

  uploadCount.innerHTML = uploadedCount;
  totalCount.innerHTML = total;

  uploadingDIV.style.display = "grid";

  document.getElementById("upload-btn").disabled = true;
  document.getElementById("upload-btn").style.display = "none";

  progressBarOverall = document.getElementById("progressBarOverall");

  progressBarOverall.max = total;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    const fileHash = await calculateHash(file);

    // Database query to check if file exists in db already
    //If so continue and dont proceed further

    console.log(fileHash);

    if (file.size > maxFileSize) {
      alert("File Uploaded exceeds limit", file.name);
      continue;
    }

    const fileID = file.name + file.type + i;

    console.log(file.name);

    try {
      getUploadLink(file.name).then((link) => {
        console.log("link reached", link.presignedUrl);
        const response = uploadFileThroughLink(link.presignedUrl, file);
      });
    } catch (error) {
      console.error(`Failed to upload file ${file.name}: ${error}`);
    }

    // if (i == fileList.length - 1) {
    //     setTimeout(() => {
    //         document.getElementById('upload-btn').disabled = false;
    //         // document.getElementById('fileInput').value = '';
    //     }, 1000)
    // }
  }

  // setTimeout(() => {
  //
  // }, 20000)
};

const getUploadLink = async (filename) => {
  console.log(`this is filename, ${filename}`);
  const requestData = {
    name: filename,
  };

  return fetch("https://armss-be.exitest.com/presignedUrl/", {
    method: "POST", // Change the method to POST
    headers: {
      "Content-Type": "application/json", // Specify the Content-Type
    },
    body: JSON.stringify({ input: filename }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the fetched object here
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      errorCount++;
    });
};

const uploadFileThroughLink = (url, file) => {
  fetch(url, {
    method: "PUT",
    body: file,
  })
    .then((data) => {
      console.log(data);

      if (data.status === 200) {
        uploadedCount++;
        if (progressBarOverall) {
          progressBarOverall.value = uploadedCount;
          uploadCount.innerHTML = uploadedCount;
        }
      } else {
        errorCount++;
        errorTotal.innerHTML = errorCount;
        errorCounter.style.display = "block";
      }
    })
    .catch((e) => {
      console.error(e);
      errorCount++;
    });
};

function calculateHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const hash = sha256(new Uint8Array(arrayBuffer));
      resolve(hash);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

function sha256(arrayBuffer) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
}
