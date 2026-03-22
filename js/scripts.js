// ie WHEN SLIDER WAS WORKING, BUT BEFORE TRYING TO FIX SCROLL PROBLEM


let topp;
let style;

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

// fetch 12 random users but only from countries with an English alphabet
async function fetchUsers() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=12&nat=AU,CA,CH,GB,IE,IN,NL,NZ,US');
        // if there server doesn't respond with 20, throw an error
        if(!response.ok) {
            throw new Error();
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
// add close button to innerModal
innerModal.insertAdjacentHTML('afterbegin', `
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>    
`);
modalContainer.appendChild(innerModal);

// create currentModal that the user opens, + next and previous modals which can slide into position
// Also add their relevant classes. next and previous modals are positioned off the page and not displayed by default
let currentModal = document.createElement('div');
currentModal.id = 'current';
currentModal.classList.add('modal-info-container');
let nextModal = document.createElement('div');
nextModal.id = 'next';
nextModal.classList.add('next-modal', 'hide-modal');
let previousModal = document.createElement('div');
previousModal.id = 'previous';
previousModal.classList.add('previous-modal', 'hide-modal');
// placeholder for new modal when we need to generate a new one after sliding in next/previous modals
let placeholderModal;

// add current modal to innerModal
innerModal.appendChild(currentModal);
// add the next and previous modals to the body, so we can absolute position them
document.body.appendChild(nextModal);
document.body.appendChild(previousModal);

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

// Allow us to dynamically update the 'left' position in the 'slide' class, so the new modals now where to go
// get the CSS root element
var root = document.querySelector(':root');

// function to get the 'left' position of the current modal, which we can use to position slider modals
function getModalPosition(element, position) {
    // get the coords of the modal element
    let rect = element.getBoundingClientRect();
    let newPosition = 0;
    if (position === 'left') {
        newPosition = rect.left + document.documentElement.scrollLeft;
    } else if (position === 'right') {
        newPosition = rect.right + document.documentElement.scrollLeft;
    }
    return newPosition;
};

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
            displayModal(people[index], 'Next');
        }
    // else if the previous button was clicked
    } else if (e.target.textContent === 'Prev') {
        console.log('current person after previous click: ', people[index]);
        console.log('index: ', index);
        // if the index number is greater than 0 (since we dont' want to subtract/go back from 0)
        if (index > Number(0)) {
            // subtract 1 from index representing person to show, then use index to pass that person into displayModal.
            index = Number(index) - Number(1);
            displayModal(people[index], 'Prev');
        }
    }
});

// function to display the modal, passing in the person we want to do this for
function generateModalHTML(person) {
    // format their birthday by parsing their date property, and formatting to US date format
    let birthday = new Date(Date.parse(person.dob.date));
    let dateFormat = new Intl.DateTimeFormat("en-US");
    let newBirthday = dateFormat.format(birthday);
    // return the HTML, using the passed in person and above birthday value 
    return `
        <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="modal-text">${person.email}</p>
        <p class="modal-text cap">${person.location.city}</p>
        <hr>
        <p class="modal-text">${person.phone}</p>
        <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.postcode}</p>
        <p class="modal-text">Birthday: ${newBirthday}</p>
    `;
}

// function which transitions the modal we pass into it into the central, visible modal position
function transitionModal(element) {
    // display modal by removing hide-class, + add classes for it's new design
    element.classList.remove('hide-modal');
    element.classList.add('modal-info-container', 'extra-modals');
    // Force reflow to ensure transition works - THANKS TO TRAVIS ALSTRAND
    element.offsetWidth;
    nextModal.offsetWidth;
    // add the class to slide in the modal
    if (element === previousModal) {
        element.classList.add('slide-left');
    }   else if (element === nextModal) {
        element.classList.add('slide-right');
    }
}

// function to replace the previously 'current' modal with the one we transitioned into its place
// we pass in the modal we transitioned, + the class specific to it that we need to remove
function replaceModal(element, replaceClass) {
    // remove the classes associated with non-current modals
    if (element === previousModal) {
        element.classList.remove('slide-left', replaceClass, 'extra-modals');
    }   else if (element === nextModal) {
        element.classList.remove('slide-right', replaceClass, 'extra-modals');
    }
    // make 'previous' the new current - add previousModal to modal contanier, remove 'currentModal'
    innerModal.insertBefore(element, buttonsContainer);
    //console.log('innerModal: ', innerModal);
    currentModal.remove();
}

// function to create new modal to replace the one we moved into the 'current' position
// pass in the element we are replacing , the class we want to add it, & the new ID we give it
function createNewModal(element, addClass, newID) {
// Create a placeholderModal to replace the deleted one and become the new 'next'/'previous'
    // create div & give it relevant id
    placeholderModal = document.createElement('div');
    placeholderModal.id = 'placeholder';
    // if the element is previousModal, we want to generate HTML for the next person down, if we are not at 0 in the index
    if (element.id === 'previous') {
        // if the index is above 0, ie there's still at least one 'previous' person to come, then...
        // ... generate the HTML for the next 'previous' person
        if (index > 0) {
            placeholderModal.innerHTML = generateModalHTML(people[Number(index) - Number(1)]);
        }
        // generate HTML for the new 'next' modal, which is 1 ahead of the new index
        // No need for condition, as having had a 'previous' means there is at least one 'next'
        nextModal.innerHTML = generateModalHTML(people[Number(index) + Number(1)]);
    } else if (element.id === 'next') {
        // if the index is not already at the end (the last index being length minus one)
         if (index < (Number(people.length) - Number(1))) {
            // generate HTML for the next person up
             placeholderModal.innerHTML = generateModalHTML(people[Number(index) + Number(1)]);
        }
        // generate HTML for the 'new' previous modal, which is the previous one for the index
        // No need for condition, as having had a 'next' means there is at least one 'previous'
        previousModal.innerHTML = generateModalHTML(people[Number(index) - Number(1)]);
    }
    // add the relevant classes, then insert into page
    placeholderModal.classList.add(addClass, 'hide-modal');
    document.body.appendChild(placeholderModal);

// Change file variables to reflect the new modal positions
    // assign the 'currentModal' variable to the modal that we moved into the current position
    currentModal = document.getElementById(newID);
    // assign the variable for the modal we moved to the placeholder, ie it's replacement
    // We have to assign to the names 'previousModal' & 'nextModal', not 'element' , NOT SURE WHY - IS IT BECAUSE FOR ASSIGNMENTS...
    // ... WE NEED TO USE THE EXISTING REFERENCE, NOT THE COPY OF THE REFERENCE?
        // THESE LINES DON'T WORK - WE NEED TO USE THE BELOW 'IF' CONDITIONAL INSTEAD
            // element = document.getElementById('placeholder');
            // element.id = newID;
    
    if (element === previousModal) {
        previousModal = document.getElementById('placeholder');
        // change id attributes to relect the above
        previousModal.id = newID;
            //console.log('new modal: ', nextModal);
    } else if (element === nextModal) {
        nextModal = document.getElementById('placeholder');
        // change id attributes to relect the above
        nextModal.id = newID;
        //console.log('new modal: ', nextModal);
    }
        
    //console.log('currentModal: ', currentModal);
    currentModal.id = 'current';
}

// function to display modal when a person is clicked, or next/previous button. Pass in the person + the button
function displayModal(person, buttonClicked) {
    // if the button clicked was gallery, then we display the person clicked
    if (buttonClicked === 'gallery') {
    // Display current person in modal:
        // generate the currentModal HTML
        currentModal.innerHTML = generateModalHTML(people[index]);
        // display the container to display the current modal (which is always visible when container is open)
        modalContainer.style.display = 'flex';

        // Update position of 'next'/'previous' modals using position of current modal
        // update the 'left'/'right' properties used by the 'slide' classes which do the transitions, using currentModals position
        root.style.setProperty('--modal-left-position', `${getModalPosition(currentModal, 'left')}px`);
        root.style.setProperty('--modal-right-position', `${getModalPosition(currentModal, 'left')}px`);
    // Generate 'next' and 'previous' modal HTML using next/previous people in the array
        // if the index is less than the maximum index number (which is the no. of people minus one)...
        // .. then generate next modal
        if (index < (Number(people.length) - Number(1))) {
            nextModal.innerHTML = generateModalHTML(people[Number(index) + Number(1)]);
        }
        // if the index number is greater than 0 (since we dont' want to subtract/go back from 0)
        if (index > Number(0)) {
            // generate previous modal
            previousModal.innerHTML = generateModalHTML(people[Number(index) - Number(1)]);
        }
    }
    // if the buttonClicked was 'Previous', we need to move the previous modal to the current one, then generate a new previous one
    if (buttonClicked === 'Prev') {
        // slide/transition modal into place
        transitionModal(previousModal);
        // once the new modal is in position
        setTimeout(() => {
            // replace the previously 'current' modal with the one we transitioned into its place (which we pass in) as the main modal
            replaceModal(previousModal, 'previous-modal');
            // create new 'previous' modal to replace the one we moved into the 'current' position
            createNewModal(previousModal, 'previous-modal', 'previous');
        }, 200);
    } else if (buttonClicked === 'Next') {
        // transition modal into place
        transitionModal(nextModal);
        // when the transition is finished & new modal is in place
        setTimeout(() => {
            // replace the previously 'current' modal with the one we transitioned into its place (which we pass in)
            replaceModal(nextModal, 'next-modal');
            // create new modal to replace the one we moved into the 'current' position
            createNewModal(nextModal, 'next-modal', 'next');
        }, 200);
    }
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
        //person = people[e.target.id];
        // save the index of the person in the modal
        index = e.target.id;
        // pass in this person to the displayModal function
        //console.log('person before displayModal for gallery click 1', people[index]);
        displayModal(people[index], 'gallery');


    // repeat process for child elements inside the 'card' parent
    } else if (e.target.parentElement.classList.contains('card')) {
        person = people[e.target.parentElement.id];
        index = e.target.parentElement.id;
        //console.log('person before displayModal for gallery click 3', people[index]);
        displayModal(people[index], 'gallery');


    // repeat for grandchild elements
    } else if (e.target.parentElement.parentElement.classList.contains('card')) {
        person = people[e.target.parentElement.parentElement.id];
        index = e.target.parentElement.parentElement.id;
        displayModal(people[index], 'gallery');
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




