const uploadDiv = document.getElementById('upload-zone');
const fileInput = document.getElementById('fileInput');
const drivelink = document.getElementById('drivelink');
const filesList = document.getElementById('fileList');

uploadDiv.addEventListener('click', function (event) {

    if (event.target !== drivelink) {
        // If not, trigger the file input click event
        fileInput.click();
    }
});

// Add drag-and-drop event listeners to the div
uploadDiv.addEventListener('dragover', function (event) {
    // Prevent default behavior to allow dropping
    event.preventDefault();
    uploadDiv.classList.add('dragging');
});

uploadDiv.addEventListener('dragleave', function () {
    // Remove dragging style when drag leaves the div
    uploadDiv.classList.remove('dragging');
});

uploadDiv.addEventListener('drop', function (event) {
    // Prevent default behavior and stop event propagation
    event.preventDefault();
    uploadDiv.classList.remove('dragging');

    // Access the dropped files
    const files = event.dataTransfer.files;

    // Set the dropped files in the file input element
    fileInput.files = files;

    // Optional: Handle the file selection
    if (files.length > 0) {
        console.log('Dropped files:', files);
        // Perform desired action with the files (e.g., uploading)
    }
});


fileInput.addEventListener('change', function () {
    const files = fileInput.files;

    // Clear previous list
    filesList.innerHTML = '';

    if (files.length > 0) {
        // Apply CSS class when files are selected
        uploadDiv.classList.add('hasFiles');

        // Display the list of uploaded files
        const ul = document.createElement('ul');
        for (let i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.textContent = files[i].name;
            ul.appendChild(li);
        }
        filesList.appendChild(ul);
    } else {
        // Remove CSS class if no files are selected
        uploadDiv.classList.remove('hasFiles');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('upload-btn').addEventListener('click', function (event) {
        event.preventDefault();
        console.log('Upload button clicked, about to call upload function.');
        upload();

    });
});


const maxFileSize = 2000 * 1024 * 1024; //2MB
let fileList;

let uploadedCount;
let progressBarOverall;

let uploadingQueue = new Map()
let successfulUploadQueue = new Map()
let failedUploadQueue = new Map()

let fileProgressList = new Map()

let fileObjProgressMapping = new Map()

let ProgressCancelMapping = new Map()
let cancelQueue = new Map()

let cancelledFlag = 0;

let progressDiv;

let total = 10;

function waitForCondition(i) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (uploadingQueue.size < 5) {
                clearInterval(interval);
                resolve();
            }
        }, 100); // Check every 1/10 th second, adjust the interval as needed
    });
}

//condition will become uploadingQueue size less than 5

const upload = async () => {

    // document.getElementById('u-lists').style.display = 'block';
    document.getElementById('upload-btn').disabled = true;

    fileList = document.getElementById('fileInput').files;

    console.log('ssss', fileList)

    // document.getElementById('fileInput').value = ''
    progressDiv = document.getElementById('progress-div');
    // progressDiv.style.display = 'block';

    progressBarOverall = document.getElementById('progressBarOverall');
    total = fileList.length;
    // progressBarOverall.style.display = 'block';
    progressBarOverall.max = total;
    // progressBarOverall.style = `--p: 50%`;

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileID = file.name + file.type + i;
        const fileProgress = createProgress(file.name, fileID);
        fileProgressList.set(fileID, fileProgress)
        document.getElementById('queue-list').appendChild(fileProgress);
    }

    uploadedCount = 0;

    for (let i = 0; i < fileList.length; i++) {

        // await waitForCondition(i); // checks if files are uploaded every 5 files

        const file = fileList[i];

        const fileHash = await calculateHash(file)

        // Database query to check if file exists in db already
        //If so continue and dont proceed further

        console.log(fileHash)

        if (file.size > maxFileSize) {
            alert('File Uploaded exceeds limit', file.name);
            continue;
        }

        const fileID = file.name + file.type + i;

        const fileObj = {
            fileName: file.name,
            fileid: fileID,
            file: file,
            updatedAt: Date.now(),
        }

        uploadingQueue.set(fileID, fileObj);

        console.log(file.name); // Print the name of each selected file

        const formData = new FormData();
        formData.append('file', file);

        const fileProgress = fileProgressList.get(fileID); // Create progress bar for the file

        fileObjProgressMapping.set(fileProgress, fileObj)

        if (cancelQueue.get(fileProgress) == 1) continue; // maybe I should make a good file metadata json or something with status, it will make this easy to work with

        updateProgress(fileProgress, 0)

        listAppend(1, fileProgress)

        try {
            getUploadLink(file.name, fileProgress, fileID).then((link) => {
                console.log('link reached', link.presignedUrl)
                const response = uploadFileThroughLink(link.presignedUrl, file, fileProgress, fileID)
            })




        } catch (error) {

            console.error(`Failed to upload file ${file.name}: ${error}`);
        }
    }

    document.getElementById('upload-btn').disabled = false;
};

const getUploadLink = async (filename, fileProgress, fileID) => {
    console.log(`this is filename, ${filename}`)
    const requestData = {
        name: filename
    };

    return fetch('https://armss-be.exitest.com/presignedUrl/', {
        method: 'POST', // Change the method to POST
        headers: {
            'Content-Type': 'application/json' // Specify the Content-Type
        },
        body: JSON.stringify({ input: filename })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the fetched object here
            console.log(data);
            return data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            failedUploadQueue.set(fileID, uploadingQueue.get(fileID));
            uploadingQueue.delete(fileID)

            listAppend(3, fileProgress)
        });


}

const setOverallProgress = () => {
    progressBarOverall.style = `--p: ${(uploadedCount / total) * 100}%`;
    document.getElementById('file-count').innerHTML = `${uploadedCount} / ${total}`;
    // if (uploadedCount === total) {
    //     document.getElementById('file-count').innerHTML = total
    // }
}

const uploadFileThroughLink = (url, file, fileProgress, fileID) => {

    // console.log('Old url fdvfv: ', url)
    // let newUrl = url.replace('minio:9000', '49c31f1f0794:9000')
    // console.log('after replacing: ', newUrl)
    // newUrl = 'http://172.24.0.5:9000/resumebucket/1%2B%20year%20of%20frontend.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=zg7ygRbiFXhNcgWvMKgB%2F20240416%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240416T062922Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=2a73ebcd9d6f5ac3b4025aa44d055ee99d813ad4f40a37d0930ef038b0b4af34'

    // let newurl = url.replace('minio:9000', '172.24.0.5:9000')
    // console.log('I am sending url ', url)

    // fetch('http://localhost:5500/upload',
    //     {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ link: url, mFile: file })
    //     })

    fetch(url, {
        method: 'PUT',
        body: file
    }).then((data) => {
        console.log(data);
        if (data.status === 200) {
            uploadedCount++;
            setOverallProgress();
            successfulUploadQueue.set(fileID, uploadingQueue.get(fileID));
            listAppend(2, fileProgress)
            // uploadingQueue.delete(fileID)
            updateOverallProgressBar(progressBarOverall, uploadedCount, fileList);
            updateProgress(fileProgress, 1) //change image
            // console.log(`File ${formData.get('file').name} uploaded successfully`);
            // If multiple files are uploaded, append upload status on the next line.
            // document.querySelector('#status').innerHTML += `<br>Uploaded ${file.name}.`;
        }
        else {
            failedUploadQueue.set(fileID, uploadingQueue.get(fileID));
            uploadingQueue.delete(fileID)

            listAppend(3, fileProgress)
        }

    }).catch((e) => {
        console.error(e);
        failedUploadQueue.set(fileID, uploadingQueue.get(fileID));
        uploadingQueue.delete(fileID)

        listAppend(3, fileProgress)
    });



    // fetch(url, {
    //     method: 'PUT',
    //     body: file
    // }).then((data) => {
    //     console.log(data);
    //     // If multiple files are uploaded, append upload status on the next line.
    //     // document.querySelector('#status').innerHTML += `<br>Uploaded ${file.name}.`;
    // }).catch((e) => {
    //     console.error(e);
    // });

}

const uploadDoc = async (fileID, formData, fileProgress) => {


    const cancelToken = new axios.CancelToken((cancel) => {
        const fileCancel = cancel
        ProgressCancelMapping.set(fileID, cancel);
        //  console.log("cancel ",fileCancel)
    })

    try {
        const response = await axios.post('https://armss-be.exitest.com/items', formData, {
            cancelToken,
            onUploadProgress: progressEvent => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                updateProgressBar(progress);
            }
        });
        console.log(response)
        if (response.status !== 200) {
            throw new Error('Failed to upload file');
        }


        uploadedCount++;
        successfulUploadQueue.set(fileID, uploadingQueue.get(fileID));
        listAppend(2, fileProgress)
        uploadingQueue.delete(fileID)
        updateOverallProgressBar(progressBarOverall, uploadedCount, fileList);
        updateProgress(fileProgress, 1) //change image

        return response.data;
    } catch (error) {
        updateProgress(fileProgress, 2) //change image

        if (cancelledFlag === 1) {
            cancelledFlag = 0;
        }
        else {
            failedUploadQueue.set(fileID, uploadingQueue.get(fileID));
            uploadingQueue.delete(fileID)

            listAppend(3, fileProgress)
        }
        throw error;
    }
};

const updateProgressBar = (progress) => {
    document.getElementById('progress-bar').value = progress;
    document.getElementById('individual-progress').innerHTML = `Upload Progress: ${progress}%`
};

const updateProgress = (fileProgress, imgVal) => {
    if (imgVal == 0) {
        fileProgress.children[1].src = 'https://res.cloudinary.com/dfoa0w717/image/upload/v1711519204/Spinner-1s-200px_acyihi.gif'
    }
    if (imgVal === 1) {
        fileProgress.children[1].src = 'https://res.cloudinary.com/dfoa0w717/image/upload/v1711519204/Tick_twl0em.png';
    }
    else if (imgVal === 2) {
        fileProgress.children[1].src = 'https://res.cloudinary.com/dfoa0w717/image/upload/v1711519204/cross_ytrr8v.png';
    }
}

const updateOverallProgressBar = (progressBar, count, total) => {
    // document.getElementById('progressNumbers').innerHTML = `${count}/${total}`
    progressBar.value = count;
}

const createProgress = (fileName, fileID) => {
    const container = document.createElement('div');
    container.setAttribute('id', fileID)
    container.classList.add('file-upload-item');

    const label = document.createElement('span');
    label.textContent = fileName.slice(0, 15);;
    container.appendChild(label);

    const loader = document.createElement('img');

    loader.src = 'https://res.cloudinary.com/dfoa0w717/image/upload/v1711617751/noun-pending-folder-6269561_1_dm1deg.png'
    loader.classList.add('file-progress');
    // progressBar.value = 0;
    // progressBar.max = 100;
    loader.setAttribute('id', 'progress-image');
    container.appendChild(loader);

    // const cancelButton = document.createElement('button')
    // cancelButton.setAttribute('id','cancel-button')

    // cancelButton.innerHTML = 'Cancel'
    // cancelButton.setAttribute('onclick', `cancelUpload(this)`)
    // container.appendChild(cancelButton)

    return container;
};

const listAppend = (type, fileProgress) => {
    if (type == 1) {
        document.getElementById('upload-list').appendChild(fileProgress);
    }
    else if (type == 2) {
        document.getElementById('success-list').appendChild(fileProgress);
        // const cancelBtn = document.getElementById('cancel-button')
        // fileProgress.removeChild(fileProgress.children[2]);
    }
    else if (type == 3) {
        document.getElementById('failed-list').appendChild(fileProgress);
        // const cancelBtn = document.getElementById('cancel-button')
        // fileProgress.removeChild(fileProgress.children[2]);

        const retryButton = document.createElement('button')
        // cancelButton.setAttribute('id','cancel-button')
        retryButton.innerHTML = 'Retry'
        retryButton.setAttribute('onclick', `retryUpload(this)`)
        // fileProgress.appendChild(retryButton)
    }
}

const listRemove = (type, fileProgress, fileID) => {
    if (type == 1) {
        document.getElementById('upload-list').removeChild(fileID);
    }
    else if (type == 2) {
        document.getElementById('success-list').removeChild(fileID);
    }
    else if (type == 3) {
        document.getElementById('failed-list').removeChild(fileID);
    }
}

const cancelUpload = (container) => {
    cancelledFlag = 1;
    const progress = container.parentNode
    cancelQueue.set(progress, 1);
    cancelReq = ProgressCancelMapping.get(progress.id)
    document.getElementById('cancelled-list').appendChild(progress);
    progress.removeChild(progress.children[2])
    cancelReq();
}

const retryUpload = (container) => {
    const progress = container.parentNode
    const fileObj = fileObjProgressMapping.get(progress)
    console.log(fileObj)

    const formData = new FormData();
    formData.append('file', fileObj.file);

    listAppend(1, progress)

    uploadDoc(fileObj.fileid, formData, progress);

}

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



