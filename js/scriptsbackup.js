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
        people.forEach((person) => {
            // create card to display person on page, add the 'card' class
            let personCard = document.createElement('div');
            personCard.classList.add('card');
            // add the person's name as an id to the card, which we can use for finding them later
            personCard.id = person.name.first + ' ' + person.name.last;
            // add the HTML to the card, interpolating in the relevant info for each person
            personCard.insertAdjacentHTML('afterbegin', `
                <div class="card-img-container">
                    <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="card-text">${person.email}</p>
                    <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
                </div>
            `)
            // add the person's info card to the gallery container
            gallery.appendChild(personCard);
        });
    } catch(error) {
        // display error in the console
        console.log(error);
    }
}

/**
 * MODAL WINDOW
 */

// listen for clicks on parent element of person cards so we listen for clicks on people using bubbling

// create a regex which we will use to check if an element that was clicked has a class beginning...
// ... with 'card'. If so, we will know that a person element was clicked

gallery.addEventListener('click', (e) => {
    // check that it was a person card that was clicked
    // do this by checking if the element clicked was the 'card' parent, one of it's children...
    // ... or one of it's grandchildren. This encompasses all elements in the person card
    if (e.target.classList.contains('card')) {
        // get the name via textContent
        const name = e.target.id;
        console.log(e);
        console.log(name);
        // use this name to search in people array for the person
    } else if (e.target.parentElement.classList.contains('card')) {
        const name = e.target.parentElement.id;
        console.log(name);

    } else if (e.target.parentElement.parentElement.classList.contains('card')) {
        const name = e.target.parentElement.parentElement.id;
        console.log(name);
    }
});
// call fetchUsers to run the program
fetchUsers();
// test2