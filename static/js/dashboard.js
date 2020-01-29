function modal(title, description, buttons) {
    let modalArea = document.getElementById('modalArea');
    var buttonHTML;
    if (buttons.size > 4) return console.log('Error: Too many buttons requested.');
        Object.keys(buttons).forEach(b => {
            if (buttons[b].type === undefined) buttons[b].type = '';
            if (buttons[b].onclick === undefined) {
                if (buttonHTML === undefined) return buttonHTML = `<a class="button ${buttons[b].type}">${b}</a>`;
                buttonHTML = buttonHTML + `<a class="button ${buttons[b].type}">${b}</a>`
            } else {
                if (buttonHTML === undefined) return buttonHTML = `<a class="button ${buttons[b].type}" onclick="${buttons[b].onclick}">${b}</a>`;
                buttonHTML = buttonHTML + `<a class="button ${buttons[b].type}" onclick="${buttons[b].onclick}">${b}</a>`
            }
        });
    if (buttonHTML !== undefined) {
        modalArea.innerHTML = `<div class="modal is-active" id="modal">
            <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">${title}</p>
                        <button class="delete" aria-label="close" onclick="closeModal();"></button>
                    </header>
                    <section class="modal-card-body">
                        <p>${description}</p>
                    </section>
                    <footer class="modal-card-foot">
                        ${buttonHTML}
                    </footer>
            </div>
        </div>`;
    } else {
        modalArea.innerHTML = `<div class="modal is-active" id="modal">
            <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">${title}</p>
                        <button class="delete" aria-label="close" onclick="closeModal();"></button>
                    </header>
                    <section class="modal-card-body">
                        <p>${description}</p>
                    </section>
            </div>
        </div>`;
    }
}

function closeModal() {
    modalArea.innerHTML = '';
}
