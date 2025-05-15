
function hint() {
    fetch('http://localhost:3000/gebruiker/?naam=tim')
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((personen) => {
            for(let persoon of personen){
                let id = persoon.id;
                fetch(`http://localhost:3000/registratie?gebruiker_id=${id}`).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw `error with status ${response.status}`;
                    }
                }).then((registraties)=>{
                    console.log(persoon.naam,persoon.nummerplaat);
                    for(let registratie of registraties){
                        console.log(registratie.tijd);
                    }                    
                })  
            }            
        })
        .catch((error) => {
            console.log(error);
        });
}


hint();
