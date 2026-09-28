const container = document.getElementById("cards");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const emptyBox = document.getElementById("empty");
const retryButton = document.getElementById("retry");

function showState(state) {
    loader.hidden = state !== "loading";
    errorBox.hidden = state !== "error";
    emptyBox.hidden = state !== "empty";
    container.hidden = state !== "data";
}

function createCard(project) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
        <h3 class="card__title">${project.title}</h3>
        <p class="card__meta">${project.category}</p>
        <p class="card__description">${project.description}</p>
        <p class="card__year">${project.year}</p>
    `;

    return card;
}

function render(projects) {
    container.innerHTML = "";

    projects.forEach(function (project) {
        container.appendChild(createCard(project));
    });
}

async function load() {
    showState("loading");
    try {
        const response = await fetch("/items");
        if (!response.ok) {
            throw new Error("Сервер ответил: " + response.status);
        }

        const data = await response.json();
        if (data.length === 0) {
            showState("empty");
            return;
        }

        render(data);
        showState("data");

    } catch (error) {
        showState("error");
        console.error(error);
    }
}

retryButton.addEventListener("click", load);
load();
