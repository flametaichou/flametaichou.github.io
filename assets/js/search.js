input = document.getElementById('search-input');

function search() {
    setLoaderVisibility(true);

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

    setLoaderVisibility(false);
}

if (input) {
    input.addEventListener('change', search);
    search();
}