console.log(`loading ..`);



async function getResource() {
    try {
        const response = await fetch(`http://localhost:3000/payments`);
        console.log(response);
        
    } catch (error) {
        
    }
    
}

getResource()