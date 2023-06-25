/**
 * Adding links to headers (<h*> tags)
 */
function addLinksToHeaders() {
    const headerElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    for (e of headerElements) {
        if (e.id) {
            try {
                e.innerHTML += `<a class="h-link" href="#${e.id}">🔗</a>`;

            } catch (e) {
                console.error(`Error on creating link to header (${e}): ${e}`)
            }
        }
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
window.addEventListener('DOMContentLoaded', function() {
    addLinksToHeaders();
});