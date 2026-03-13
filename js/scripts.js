//

/**
 * FETCH AND ADD EMPLOYEES TO PAGE
 */

// get gallery element
let gallery = document.getElementById('gallery');
// create array for saving people to so we can reference them later when creating modal
let people = [];

// fetch 12 random users

async function fetchUsers() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=12');
        // if there server doesn't respond with 20, throw an error
        if(!response.ok) {
            throw new Error(error);
        }
        // parse the response object as json, store in 'data'
        const data = await response.json();
        //
        console.log(data);
        people = data.results;
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
// set it's display to initially none
modalContainer.style.display = 'none';
gallery.insertAdjacentElement('afterend', modalContainer);
// listen for clicks on parent element of person cards so we listen for clicks on people using bubbling

gallery.addEventListener('click', (e) => {
    // check that it was a person card that was clicked
    // do this by checking if the element clicked was the 'card' parent, one of it's children...
    // ... or one of it's grandchildren. This encompasses all elements in the person card
    if (e.target.classList.contains('card')) {
        // get the person via matching person card id with people array index
        const person = people[e.target.id];
        console.log(e);
        console.log(person);
        // format their birthday by parsing their date property, and formatting to US date format
        let birthday = new Date(Date.parse(person.dob.date));
        let dateFormat = new Intl.DateTimeFormat("en-US");
        let newBirthday = dateFormat.format(birthday);
        // use this name to search in people array for the person
        // add relevant person info to modalContainer
        modalContainer.innerHTML = `
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${person.phone}</p>
                    <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.postcode}</p>
                    <p class="modal-text">Birthday: ${newBirthday}</p>
                </div>
            </div>        
            `;
        // display the container
        modalContainer.style.display = 'flex';
    } else if (e.target.parentElement.classList.contains('card')) {
        const person = people[e.target.parentElement.id];
        console.log(person);

    } else if (e.target.parentElement.parentElement.classList.contains('card')) {
        const person = people[e.target.parentElement.parentElement.id];
        console.log(person);
    } 
});

// listen for the modal close button being clicked. Include checking for its' sub text node,...
// ... as that might trigger the click, in which case we want it's parent node 
// If it was, hide the modal container
modalContainer.addEventListener('click', (e) => {
    console.log(e);
    if (e.target.id === 'modal-close-btn' || e.target.parentElement.id === 'modal-close-btn') {
        modalContainer.style.display = 'none';
    }
})
// call fetchUsers to run the program
fetchUsers();




