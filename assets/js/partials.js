console.log(`loading partial js ....`);

const formContact = document.querySelector('#formAction');

export function insertFormContact(numberOfCells) {
    for (let i = 0; i < numberOfCells; i++) {
        const createDiv = document.createElement('div')
        const labelElem = document.createElement('label');
        const inputElem = document.createElement('input');
        inputElem.classList.add('lastName')
        formContact.append(createDiv)
        createDiv.append(labelElem)
        labelElem.append(inputElem)
    }
    const btnDiv = document.createElement('div')
    const btn = document.createElement('button')
    btn.textContent = 'Submit';
    formContact.append(btnDiv)
    btnDiv.append(btn)
}


const contactForm = new FormData(formContact)

console.log(contactForm);

// document.querySelector('button').addEventListener('click', (e) => {
//     e.preventDefault();
//     console.log(contactForm);

// })