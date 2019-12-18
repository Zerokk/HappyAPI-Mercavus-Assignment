
// Constants
const SERVER_URL = "localhost";
const SERVER_PORT = 3000;
const DEFAULT_BTN_CLASSES = "form-control user-btn";

// Variables
let currentButtonSelected;
let currentUser;
let users;
let hobbies;
let previousHobbyRows = [];
let previousUserRows = [];


(async function initialLoad() {
    loadData();
})()

async function loadData() {
    // Clean previous data
    users = null;
    hobbies = null;
    if (previousHobbyRows) previousHobbyRows.forEach(row => row.remove());
    if (previousUserRows) previousUserRows.forEach(row => row.remove());


    // Fetch data
    const hobbyPromise = performRequest('GET', `hobby`, null);
    const userPromise = performRequest('GET', `user`, null);
    const [hobbiesRes, usersRes] = await Promise.all([hobbyPromise, userPromise]);

    // Get JSON-formatted data
    hobbies = await hobbiesRes.json();
    users = await usersRes.json();

    // Render for posible current selection (if it isn't the first load)
    renderUserTable(users);
    if (currentUser) selectUser(currentUser._id);
}


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
        previousUserRows.push(td);
        td.appendChild(button);
        tr.appendChild(td);
        table.appendChild(tr)
    });
}

function selectUser(userId) {
    // Clear last selection (if any)
    console.log("Data incoming to selectUser")
    console.log("1. userId: ", userId)
    console.log("2. currentUser: ", currentUser)
    console.log("3. currentButtonSelected: ", currentButtonSelected)

    if (currentUser && currentUser._id != userId) currentButtonSelected.classList = DEFAULT_BTN_CLASSES;

    // Assign new selection to the currentButtonSelected var and add visual clue of selection
    const button = document.getElementById(userId);
    currentButtonSelected = button;
    console.log("4. button: ", button)

    button.classList += " selected-user-btn";

    // Get user hobbies, and filter the global hobbies object to show the ones that match
    const foundUser = users.find(user => user._id === userId);
    currentUser = foundUser;
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
    previousHobbyRows.forEach(row => row.remove());

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

        previousHobbyRows.push(tr);
        table.appendChild(tr);
    })

}

async function performRequest(reqType, endpoint, data) {

    const options = {
        method: reqType,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (reqType == 'DELETE' || reqType == 'GET') {
        if (data && data.id) {
            endpoint += "/" + data.id
        }
    } else {
        Object.assign(options, { body: JSON.stringify(data) });
    }

    console.log(`going to: http://${SERVER_URL}:${SERVER_PORT}/${endpoint}`)
    return fetch(`http://${SERVER_URL}:${SERVER_PORT}/${endpoint}`, options);


}


async function deleteHobby(hobbyId) {
    if (confirm("Are you sure to remove this hobby?")) {
        const res = await performRequest('DELETE', 'hobby', { id: hobbyId });
        await loadData();
    }
}

async function createHobby() {
    if (currentUser) {
        const name = document.getElementById('hobbyName').value;
        const passion = document.getElementById('passionSelect').value;
        const year = document.getElementById('hobbyYear').value;

        const res = await performRequest('POST', 'hobby', { name: name, passionLevel: passion, year: year });
        const id = await res.json();

        currentUser.hobbies.push(id);
        await performRequest('PUT', 'user', { id: currentUser._id, hobbies: currentUser.hobbies });
        await loadData();
    }
}


async function createUser(userName) {


}
