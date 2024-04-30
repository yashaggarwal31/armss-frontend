
{/* // Get the modal */ }
var modal = document.getElementById("myModal");

{/* // Get the button that opens the modal */ }
var btn = document.getElementById("Chatbot");


var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};




const chatSpace = document.querySelector('.chat-space');
// chatSpace.innerHTML = '';
// const initialMessageElement = document.createElement('p');
// initialMessageElement.classList.add('left');
// initialMessageElement.textContent = 'Hey, what can I do for you?';
// chatSpace.appendChild(initialMessageElement);



// window.myVariable = send_data


// let send_data1 = localStorage.getItem('send_data');
let userid = localStorage.getItem("Rsession_name")
console.log(userid)
send_data = {
    "query": "",
    // "query": query,
    "resume_filters": {

        "Candidate": {
            "check": [],

        },
        "Education": {
            "check": [],

        },
        "WorkExperience": {
            "check": [],

        },
        "Contact": {
            "check": [],

        },
        "Skill": {
            "check": [],

        },
        "ResumeIdList": {
            "check": [],
            "ResumeIdValue": [],
        },

    },
    "count": 0,
    "user": "userid1"

}





async function chat(event) {

    event.preventDefault()
    // const send_data_json = sessionStorage.getItem('send_data');

    // Parse the JSON string back to an object
    // const send_data = JSON.parse(send_data_json);
    // console.log("session")
    // console.log(send_data)
    const inputElement = document.getElementById('queryInput');
    const query = inputElement.value;
    const UserQuery = document.createElement('p');
    UserQuery.classList.add('right');
    UserQuery.textContent = query;
    chatSpace.appendChild(UserQuery);

    send_data["query"] = query



    console.log("archit1", send_data)

    ////////////////////////////////////////


    try {
        const response = await fetch("https://armss-be.exitest.com/chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(send_data),
        });
        const data = await response.json();

        console.log("archit");
        console.log(data);
        var queryInput = document.getElementById('queryInput');
        queryInput.value = '';

        if (data[0] === "exit") {
            var modal = document.getElementById("myModal");
            modal.style.display = "none";
        } else if (typeof data[0] === 'string') {
            console.log("check string");
            const messageElement = document.createElement('p');
            messageElement.classList.add('left');
            messageElement.textContent = data[0];
            chatSpace.appendChild(messageElement);
        } else {
            resumes = data[0].slice(0, 10);
            send_data["resume_filters"] = data[1];
            send_data["count"] = data[2];
            let send_data_str = JSON.stringify(send_data);
            localStorage.setItem('send_data', send_data_str);
            // sessionStorage.setItem('send_data', send_data_json);
            console.log("after the mess");
            console.log(send_data);
            let url = 'http://127.0.0.1:5500/src/resumeDisplay.html';
            // Redirect to the new URL
            // window.location.href = url;
            window.location.replace(url);
        }

        return data;
    } catch (error) {
        console.error("Error:", error);
    }



    ///////////////////////////////////////

    // fetch("https://armss-be.exitest.com/chatbot", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(send_data),
    // })
    //     .then((response) => response.json())

    //     // .then((data) => {
    //     //     console.log(data);
    //     // })
    //     .then((data) => {
    //         console.log("archit")
    //         console.log(data)
    //         var queryInput = document.getElementById('queryInput');
    //         queryInput.value = '';
    //         // console.log(resumes.slice(0, 5))
    //         // console.log(data[1].slice(0, 10));

    //         // resumes.map((record) => {
    //         //     const messageElement = document.createElement('p');
    //         //     messageElement.classList.add('left');
    //         //     messageElement.textContent = `${record[1]}  (${record[4].slice[0, 8]}) - ${record[5].slice[0, 8]}`;
    //         //     chatSpace.appendChild(messageElement);
    //         // });
    //         console.log(data[0], typeof data[0])
    //         if (data[0] === "exit") {
    //             var modal = document.getElementById("myModal");
    //             modal.style.display = "none";

    //         }
    //         else if (typeof data[0] === 'string') {
    //             console.log("check string");
    //             const messageElement = document.createElement('p');
    //             messageElement.classList.add('left');
    //             messageElement.textContent = data[0]
    //             chatSpace.appendChild(messageElement);



    //         } else {
    //             // 
    //             resumes = data[0].slice(0, 10);

    //             send_data["resume_filters"] = data[1]
    //             send_data["count"] = data[2]
    //             // updateJson(data[1], data[2])
    //             let send_data_str = JSON.stringify(send_data);
    //             localStorage.setItem('send_data', send_data_str);
    //             sessionStorage.setItem('send_data', send_data_json);

    //             console.log("after the mess")
    //             console.log(send_data)
    //             let url = 'http://127.0.0.1:5500/src/resumeDisplay.html'

    //             // Redirect to the new URL
    //             // window.location.href = url;
    //             // window.location.replace(url);
    //         }

    //         return data;



    //     })
    //     .catch((error) => {
    //         console.error("Error:", error);
    //     });
}




// data = {
//     "query": "get me data on java",
//     // "query": query,
//     "resume_filters": {

//         "Candidate": {
//             "check": [],

//         },
//         "Education": {
//             "check": [],

//         },
//         "WorkExperience": {
//             "check": [],

//         },
//         "Contact": {
//             "check": [],

//         },
//         "Skill": {
//             "check": [],

//         },

//     },
//     "count": 0
// }

// fetch("https://armss-be.exitest.com/chatbot", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
// })
//     .then((response) => response.json())
//     // .then((data) => {
//     //     console.log(data);
//     // })
//     .then((data) => {
//         console.log(data)
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });


function addQuestion(button) {
    var queryInput = document.getElementById('queryInput');
    var question = button.textContent.trim();
    queryInput.value += ' ' + question;
}

function resetQuery() {
    var queryInput = document.getElementById('queryInput');
    queryInput.value = '';
}


// window.send_data = send_data