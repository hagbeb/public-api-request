//

// create array for saving people to so we can reference them later when creating modal & searching by name
let people = [];
// filtered array of people when the user searches
let filteredPeople = [];
// object to store person, declared globally so it can be called in different contexts
let person = {};
// variable to store the index of the person currently in the modal, so we can toggle up and down
let index = 0;

/**
 * SEARCH CONTAINER
 */

// Get search container parent
let searchParent = document.querySelector('.search-container');
// Add inner HTML to container
searchParent.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`)

// function to filter the search results based on user input in search box. Will be run on search typing or clicking button
function searchFilter() {
    // reset filtered people
    filteredPeople = [];
    // get the user's search term
    const userInput = searchInput.value.toLowerCase();
    people.forEach(individual => {
        // create full name from first and last name properties, set to lower case for case insensitive comparison vs search term
        const fullName = `${individual.name.first} ${individual.name.last}`.toLowerCase();
        // if the person's name includes the search term, add them to the new array of people we will pass in to showPeople
        if(fullName.includes(userInput)) {
            filteredPeople.push(individual);
        } 
    });
    // show the list of people, passing in the list filtered by search term to showPeople function
    showPeople(filteredPeople);    
}

// listen for the user typing in the search box, using keyup
const searchInput = document.getElementById('search-input')
searchInput.addEventListener('keyup', (e) => {
    // when something is typed in the search box, run searchFilter
    searchFilter();
});

// listen for the search button being clicked; if so, prevent page refresh and run searchFilter
const searchButton = document.getElementById('search-submit')
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchFilter();
});

/**
 * FETCH AND ADD EMPLOYEES TO PAGE
 */

// get gallery element
let gallery = document.getElementById('gallery');

// function to create cards for each person retrieved from fetch/search, and add to page
function showPeople(people) {
    // clear existing people
    gallery.innerHTML = '';
    // loop through the people passed in
    for (let i = 0; i < people.length; i++) {
        // create card to display person on page, add the 'card' class
        let personCard = document.createElement('div');
        personCard.classList.add('card');
        // add the person's array index to the card, which we can use for finding them later
        personCard.id = i;
        // add the HTML to the card, interpolating in the relevant info for each person
        personCard.insertAdjacentHTML('afterbegin', `
            <div class="card-img-container">
                <img class="card-img" src="${people[i].picture.thumbnail}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${people[i].name.first} ${people[i].name.last}</h3>
                <p class="card-text">${people[i].email}</p>
                <p class="card-text cap">${people[i].location.city}, ${people[i].location.state}</p>
            </div>
        `)
        // add the person's info card to the gallery container
        gallery.appendChild(personCard);
    };
}
// fetch 12 random usersm but only from countries with an English alphabet

async function fetchUsers() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=12&nat=AU,CA,CH,GB,IE,IN,NL,NZ,US');
        // if there server doesn't respond with 20, throw an error
        if(!response.ok) {
            throw new Error(error);
        }
        // parse the response object as json, store in 'data'
        const data = await response.json();
        //
        people = data.results;
        // pass in 'people' to showPeople function to display the retrieved people on the page
        showPeople(people);
    } catch(error) {
        // display error in the console
        console.log(error);
    }
}

/**
 * MODAL WINDOW
 */

// create modal container, add 'modal-container' class and add it to the page (after #gallery)
let modalContainer = document.createElement('div');
modalContainer.classList.add('modal-container'); 
// create it's 'modal' child div, which we will update with a person's info when a modal is launched/changed
let innerModal = document.createElement('div');
// give it the 'modal' class, then add it to the container
innerModal.classList.add('modal'); 
// add button to innerModal
innerModal.insertAdjacentHTML('afterbegin', `
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>    
`);
modalContainer.appendChild(innerModal);
// create child of innerModal to contain the person-relevant info in the modal
let personModal = document.createElement('div');
personModal.classList.add('modal-info-container');
innerModal.appendChild(personModal);
// create child div for innerModal, to contain the buttons. Then append
let buttonsContainer = document.createElement('div');
buttonsContainer.insertAdjacentHTML('afterbegin', `             
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `
)
innerModal.appendChild(buttonsContainer);

/**
 * MODAL TOGGLE
 */

// add a listener to the buttonsContainer, to listen for the 'next or previous' buttons being clicked
buttonsContainer.addEventListener('click', (e) => {
    // if the next button was clicked
    if (e.target.textContent === 'Next') {
        // if the index is less than the maximum index number (which is the no. of people minus one)...
        // ... since we don't want to add one if we are already at the end of the list
        if (index < (Number(people.length) - Number(1))) {
            // add one to the index representing the person to show, then use that index to pass the person into displayModal
            index = Number(index) + Number(1);
            displayModal(people[index]);
        }

    } else if (e.target.textContent === 'Prev') {
    // else if the previous button was clicked
        // if the index number is greater than 0 (since we dont' want to subtract/go back from 0)
        if (index > Number(0)) {
            // subtract 1 from index representing person to show, then use idex to pass that person into displayModal.
            index = Number(index) - Number(1);
            displayModal(people[index]);
        }

    }
});

// function to display the modal, passing in the person we want to do this for
function displayModal(person) {
    // format their birthday by parsing their date property, and formatting to US date format
    let birthday = new Date(Date.parse(person.dob.date));
    let dateFormat = new Intl.DateTimeFormat("en-US");
    let newBirthday = dateFormat.format(birthday);
    // add relevant person info to personModal in desired HTML format
    personModal.innerHTML = `
        <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="modal-text">${person.email}</p>
        <p class="modal-text cap">${person.location.city}</p>
        <hr>
        <p class="modal-text">${person.phone}</p>
        <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.postcode}</p>
        <p class="modal-text">Birthday: ${newBirthday}</p>
    `;
    // display the container
    modalContainer.style.display = 'flex';
}

// set it's display to initially none
modalContainer.style.display = 'none';
gallery.insertAdjacentElement('afterend', modalContainer);
// listen for clicks on parent element of person cards for clicks on people using bubbling
gallery.addEventListener('click', (e) => {
    // check that it was a person card that was clicked
    // do this by checking if the element clicked was the 'card' parent, one of it's children...
    // ... or one of it's grandchildren. This encompasses all elements in the person card
    if (e.target.classList.contains('card')) {
        // get the person via matching person card id with people array index
        person = people[e.target.id];
        // save the index of the person in the modal
        index = e.target.id;
        // pass in this person to the displayModal function
        displayModal(person);
    // repeat process for child elements inside the 'card' parent
    } else if (e.target.parentElement.classList.contains('card')) {
        person = people[e.target.parentElement.id];
        index = e.target.parentElement.id;
        displayModal(person);
    // repeat for grandchild elements
    } else if (e.target.parentElement.parentElement.classList.contains('card')) {
        person = people[e.target.parentElement.parentElement.id];
        index = e.target.parentElement.parentElement.id;
        displayModal(person);
    } 
});

// listen for the modal close button being clicked. Include checking for its' sub text node,...
// ... as that might trigger the click, in which case we want it's parent node 
// If it was, hide the modal container
modalContainer.addEventListener('click', (e) => {
    if (e.target.id === 'modal-close-btn' || e.target.parentElement.id === 'modal-close-btn') {
        modalContainer.style.display = 'none';
    // but if the modal container was clicked, we want to close the modal (since this means...
    // ... that outside the modal itself was clicked
    } else if (e.target.className === "modal-container") {
        modalContainer.style.display = 'none';
    }
})

// listen for escape key being pressed, and close the modal
document.body.addEventListener('keyup', (e) => {
    // if the target was the escape key
    if (e.key === 'Escape') {
        modalContainer.style.display = 'none';
    }
});
// call fetchUsers to run the program
fetchUsers();




