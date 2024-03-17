let input = undefined;

function search() {
    query = input.value;

    const resultsNode = document.getElementById('search-results');

    for (const articleNode of resultsNode.children) {
        if (!articleNode.innerHTML.toLowerCase().includes(query.toLowerCase())) {
            //articleNode.hidden = true;
            articleNode.style.display = 'none';
        } else {
            //articleNode.hidden = false;
            articleNode.style = Object.assign(articleNode.style, { display: undefined });
        }
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
window.addEventListener('DOMContentLoaded', function() {
    input = document.getElementById('search-input');

    if (input) {
        input.addEventListener('change', search);
        search();
    }
});
