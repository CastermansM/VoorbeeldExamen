// naam: Marco Castermans

window.addEventListener("load", loaded);

function loaded() {
    const knopToon = document.getElementById("button_toon_filter");
    const knopVerstop = document.getElementById("button_verstop_filter");
    const divFilter = document.getElementById("div_filter");
    const knopRegistraties = document.getElementById("button_get_registraties");

    knopToon.addEventListener("click", function () {
        divFilter.style.display = "block";
        knopToon.style.display = "none";
    });

    knopVerstop.addEventListener("click", function () {
        divFilter.style.display = "none";
        knopToon.style.display = "block";
    });

    knopRegistraties.addEventListener("click", function () {
        fetchDataEnToon();
    });
}

function makeElementEmpty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function fetchDataEnToon() {
    const inputNaam = document.getElementById("input_naam");
    const filterNaam = inputNaam.value.trim().toLowerCase();

    let urlGebruiker = "http://localhost:3000/gebruiker";
    if (filterNaam !== "") {
        urlGebruiker += `/?naam=${encodeURIComponent(filterNaam)}`;
    }

    fetch(urlGebruiker)
        .then(response => {
            if (!response.ok) {
                throw `Error status ${response.status}`;
            }
            return response.json();
        })
        .then(gebruikers => {
            makeElementEmpty(document.getElementById("div_output"));

            gebruikers.forEach(gebruiker => {
                fetch(`http://localhost:3000/registratie?gebruiker_id=${gebruiker.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw `Error status ${response.status}`;
                        }
                        return response.json();
                    })
                    .then(registraties => {
                        console.log(gebruiker.naam, gebruiker.nummerplaat);
                        registraties.forEach(registratie => {
                            console.log(registratie.tijd);
                        });
                        toonGebruikerMetRegistraties(gebruiker, registraties);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function toonGebruikerMetRegistraties(gebruiker, registraties) {
    const output = document.getElementById("div_output");

    const div = document.createElement("div");
    div.appendChild(document.createTextNode(`${gebruiker.naam}: ${gebruiker.nummerplaat}`));

    if (registraties.length > 0) {
        const ul = document.createElement("ul");

        registraties.forEach(reg => {
            const tijd = new Date(reg.tijd);
            const tijdStr = tijd.toLocaleString("be-BE");
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(tijdStr));
            ul.appendChild(li);
        });

        div.appendChild(ul);
    }

    output.appendChild(div);
}
