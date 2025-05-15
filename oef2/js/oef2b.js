// naam: Marco Castermans

window.addEventListener("load", loaded);

function loaded() {
    const knopNieuw = document.getElementById("button_nieuwe_gebruiker");
    knopNieuw.addEventListener("click", function () {
        voegNieuweGebruikerToe();
    });
}

function maakGebruiker(id, naam, nummerplaat) {
    return { id: id.toString(), naam, nummerplaat };
}

function bepaalNieuwId(gebruikers) {
    let maxId = 0;
    gebruikers.forEach(g => {
        let idNum = parseInt(g.id, 10);
        if (idNum > maxId) {
            maxId = idNum;
        }
    });
    return maxId + 1;
}

function voegNieuweGebruikerToe() {
    const inputNaam = document.getElementById("input_naam");
    const inputNummerplaat = document.getElementById("input_nummerplaat");

    const naam = inputNaam.value.trim();
    const nummerplaat = inputNummerplaat.value.trim();

    const output = document.getElementById("div_output");
    makeElementEmpty(output);

    if (naam.length < 2 || nummerplaat.length < 2) {
        const foutDiv = document.createElement("div");
        foutDiv.appendChild(document.createTextNode("Naam en nummerplaat moeten minstens 2 karakters bevatten."));
        output.appendChild(foutDiv);
        return;
    }

    fetch("http://localhost:3000/gebruiker")
        .then(res => {
            if (!res.ok) {
                throw new Error("Fout status " + res.status);
            }
            return res.json();
        })
        .then(gebruikers => {
            const nieuwId = bepaalNieuwId(gebruikers);
            const nieuweGebruiker = maakGebruiker(nieuwId, naam, nummerplaat);

            return fetch("http://localhost:3000/gebruiker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nieuweGebruiker)
            });
        })
        .then(res => {
            if (!res.ok) throw new Error("Fout bij POST " + res.status);
            return res.json();
        })
        .then(data => {
            const succesDiv = document.createElement("div");
            succesDiv.appendChild(document.createTextNode(`Aangemaakt: ${data.id}, ${data.naam}, ${data.nummerplaat}`));
            output.appendChild(succesDiv);
        })
        .catch(error => {
            const errorDiv = document.createElement("div");
            errorDiv.appendChild(document.createTextNode("Fout bij toevoegen gebruiker: " + error.message));
            output.appendChild(errorDiv);
        });
}


function makeElementEmpty(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}
