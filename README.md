# public-api-request
Use Random User Generator API to create mockup of company employee page

## Exceeds - Make it your own

### Fade in modals

(styles.css lines 148-156) I added a 'fade' class with an animation to fade the modal into view.

(scripts.js line 130) This class was added to the element which contained the persons info in the modal
(scripts.js lines 177 & 192) Every time we wanted to display a modal, we removed the modal div and then re-added it to make sure it faded in

the .modal-close-btn class was made z-index 30 so that the slide did not go over it.