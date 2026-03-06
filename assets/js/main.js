console.log(`loading Contact Form..`);

import { insertFormContact } from "./partials.js";

insertFormContact(1)

const formContact = document.querySelector('#formAction');

const contactForm = new FormData(formContact)

document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();
    const elemData= Object.fromEntries(contactForm)
    console.log(elemData.lastName);
    console.log(`test`);
    

})