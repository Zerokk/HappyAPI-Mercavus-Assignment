
// Constants
const SERVER_URL = "localhost";
const SERVER_PORT = 3000;
const DEFAULT_BTN_CLASSES = "form-control user-btn";

// Variables
let currentSelection;
let users;
let hobbies;
let previousRows = [];


(async function initialLoad() {

    // Fetch data
    const hobbyPromise = fetch(`http://${SERVER_URL}:${SERVER_PORT}/hobby`);
    const userPromise = fetch(`http://${SERVER_URL}:${SERVER_PORT}/user`);
    const [hobbiesRes, usersRes] = await Promise.all([hobbyPromise, userPromise]);

    // Get JSON-formatted data
    hobbies = await hobbiesRes.json();
    users = await usersRes.json();

    renderUserTable(users);

})()


function renderUserTable(userList) {

    // Get table and iterate over the Users results
    const table = document.getElementById("users-table");
    userList.forEach(user => {
        // Create visual elements
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const button = document.createElement('button');
        // Fill button with user data
        button.classList = DEFAULT_BTN_CLASSES;
        button.innerHTML = user.name;
        button.id = user._id
        button.onclick = () => selectUser(user._id);

        // Append everything to the table
        td.appendChild(button);
        tr.appendChild(td);
        table.appendChild(tr)
    });
}

function selectUser(userId) {
    // Clear last selection (if any)
    if (currentSelection) currentSelection.classList = DEFAULT_BTN_CLASSES;

    // Assign new selection to the currentSelection var and add visual clue of selection
    const button = document.getElementById(userId);
    currentSelection = button;
    button.classList += " selected-user-btn";

    // Get user hobbies, and filter the global hobbies object to show the ones that match
    const foundUser = users.find(user => user._id === userId);
    const userHobbies = hobbies.filter(h =>
        foundUser.hobbies.some(userHobbieId =>
            userHobbieId === h._id
        )
    );

    // Display the user hobbies
    renderHobbies(userHobbies)

}


function renderHobbies(filteredHobbies) {
    const table = document.getElementById("hobbies-table");
    // Remove previous rows
    previousRows.forEach(row => row.remove());

    filteredHobbies.forEach(h => {



        // Create elements
        const tr = document.createElement("tr");
        const nameTd = document.createElement("td");
        const passionTd = document.createElement("td");
        const yearTd = document.createElement("td");
        const removeBtnTd = document.createElement("td");
        const closeIcon = document.createElement("img");

        // Prepare the Delete icon and element
        closeIcon.src = "assets/close-icon.png";
        closeIcon.classList = "remove-btn";
        removeBtnTd.style.textAlign = "center";
        closeIcon.onclick = () => deleteHobby(h._id);
        removeBtnTd.appendChild(closeIcon);

        // Get passion level
        let passionLevel;
        switch (h.passionLevel) {
            case 1: passionLevel = 'Very low'; break;
            case 2: passionLevel = 'Low'; break;
            case 3: passionLevel = 'Medium'; break;
            case 4: passionLevel = 'High'; break;
            case 5: passionLevel = 'Very high'; break;
        }

        // Fill the rest of the data
        nameTd.innerHTML = h.name;
        passionTd.innerHTML = passionLevel;
        yearTd.innerHTML = h.year;

        // Add styles
        nameTd.classList = "data-cell";
        passionTd.classList = "data-cell";
        yearTd.classList = "data-cell";
        tr.classList = "data-row";

        // Append everything
        tr.appendChild(passionTd);
        tr.appendChild(nameTd);
        tr.appendChild(yearTd);
        tr.appendChild(removeBtnTd);

        previousRows.push(tr);
        table.appendChild(tr);
    })

}

function performRequest(reqType, endpoint, data) {
    return new Promise((resolve, reject) => {

        let payload;
        if (reqType == 'DELETE' || reqType == 'GET') {
            endpoint += data.id
        } else {
            // payload = Object.keys(data).map(key => key+"="+data[key]);
            payload = JSON.stringify(data);
            console.log("payload: ", payload)
        }

        let request = new XMLHttpRequest();
        request.open(reqType, `http://${SERVER_URL}:${SERVER_PORT}/${endpoint}`, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onreadystatechange = () => {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(request.responseText);
            } else {
                reject();
            }
        };

        request.onerror = function () {
            reject();
        };

        payload ? request.send(payload) : request.send();

    });


}


async function deleteHobby(hobbyId) {
    if (confirm("Are you sure to remove this hobby?")) {
        const res = await performRequest('DELETE', 'hobby', {id: hobbyId})
        console.log("result of delete: ", res);
    }
}

async function createHobby() {
    const name = document.getElementById('hobbyName').value;
    const passion = document.getElementById('passionSelect').value;
    const year = document.getElementById('hobbyYear').value;

    const res = await performRequest('INSERT', 'hobby', {name: name, passionLevel: passion, year: year});
    console.log("result of delete: ", res);
}


async function createUser(userName) {


}
