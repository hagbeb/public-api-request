# public-api-request
Use Random User Generator API to create mockup of company employee page

## Exceeds - Make it your own

### Slide in modals when Next/Prev buttons are clicked

- (line 211 of scripts.js) a 'generateModalHTML' function was created to specifically handle creating the content of each modal.
- (Line 306 in scripts.js) a 'displayModal' function was created to oversea the sliding of the modals, and replacement of transitioned ones.

- (287 and 292 of styles.css) The classes 'slide-left' and 'slide-right' were created with the relevant transitions to slide in the next/previous modals when the buttons were clicked. For their left and right position values, we used variables that were defined in the :root element (line 263 of styles.css). These values were to reflect the position of the current modal once it was opened. 
The values for these variables were updated in JS when a new modal was opened (lines 317 and 318 of script.js). The 'next' and 'previous' modals could then transition to these values. We got these values using the function 'getModalPosition', which we defined on line 169 of scripts.js. This used getBoundingClientRect to get the coordinates of the current modal.

- (298 and 308 of styles.css) The classes .extra-modals and .extra-modals hr were also created to make the next/previous modals look like the 'current' one.

- (line 282 of styles.css) the class 'hide-modal' function was to hide by default the 'next' and 'previous' modals until the user clicked one of the 'Next'/'Prev' buttons.

- (Line 189-onwards in scripts.js) In the listener for the buttons, displayModal was called, passing in the button that was clicked.

displayModal:
- (line 347 of scripts.js) at the start of 'displayModal', it calls the 'hasUserSearched' function to decide whether to use the 'people' array, which contains all 12 people returned, or to use the 'filteredPeople' array, which are the people remaining after the user used the search box. 
- 'displayModal' then calls 3 sub-functions to handle the different parts of sliding in a modal:
    - (line 230 in scripts.js) 'transitionModal' was responsible for making the modal visible by removing the 'hide-modal' class. It also added classes to make it's design reflect the main modal. It then added the relevant 'transition' class ('slide-left' for the previous button, or 'slide-right' for the 'next' button). It then waited 200ms until the end of the transition using setTimeout. This was made an async function in order to do this, and the parent displayModal function was defined using async so that we could await transitionModal when calling it. We  did this (waited until the end) so that one slide was finished before the user called another, which would cause unintended behaviour.
    - (line 250) replaceModal was then called, which was responsible for making the 'next'/'previous' modals the new 'current' modal - it removed the classes associated with the 'next'/'previous' modals, then inserted it into the 'innerModal' div where the main modal resided. Finally, it removed the existing (now previous) current modal from the DOM.
    - (line 260) createNewModal was then called, which was responsible for creating a new modal to replace the previous 'next' or 'previous' modal that was transitioned into the current modal. Initially, a placeholder div was created. Then generateModalHTML was called to create the relevant HTML for the new modal, depending on whether we wanted a new 'Next' or 'Previous' modal. generateModalHTML was also used to update the remaining 'next' or 'previous' modal that wasn't used, as it needs to reflect the new person in the main modal. The relevant classes were added, and the placeholder was then added to the page. (Lines 291-302 of scripts.js) The variables that stored the current modal, previous modal, and next modal, were then updated to reflect the new statuses of the modals after the transition (eg if the 'Next' button was clicked, the 'currentModal' variable was assigned to what was the 'nextModal' variable. The 'nextModal' variable would then be assigned to the placeholder, since we need a new 'nextModal'.)
  
### Style changes

- (Line 19 of styles.css) The background-color of the body was changed to #dddddd;

- (Line 219 of styles.css) The flex-direction of .header-inner-container was changed to column, to put the header and search bar on separate lines.

- (Line 227) The text-align of the header as changed to center.

- (Line 32) The font-size of the header was changed to 2.5em by default. However, it was also give a size of 3em for devices with min-width of 768px (line 230).

- (Lines 41 and 42) The max-width of the search bar was increased to 30em, and it was given a min-width of 18em.

- (Line 232) The search-container for the search box was given a margin-bottom of 10px, and the margin-top property was removed.

- (Line 35) The header was given a text-shadow value of 2px 2px 4px #ffffff. Thanks to W3 Schools.

- (Line 95) The cards which display the information of each person were given a box-shadow of 0px 5px 5px #aaaaaa. Thanks to W3 Schools.

- (Line 148) The visible modal display was given a box-shadow of 0 0 8px #ccc via the .modal class.

- The header font was changed to "Roadkill Heavy", which I had previously purchased. The font file was added to the newly created 'fonts' folder in the root. The font was then imported to styles.css using the @font-face rule (line 8). The 'header h1' class was then given this font-family (line 38). CREDIT TO DIGITIALOCEAN.COM FOR INSTRUCTIONS.