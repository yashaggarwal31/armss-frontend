send_data = {
    "query": "get me data on python",
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


fetch("http://localhost:8000/chatbot", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(send_data),
}).then(Response => Response.json()).then(data => {
    console.log(data[0])
    let resumeids = JSON.stringify(data[0])
    // localStorage.setItem('send_data', send_data_str);
    localStorage.setItem('resumeids', resumeids);
});
// const data = await response.json();

