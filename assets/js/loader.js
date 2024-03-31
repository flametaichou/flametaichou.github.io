function setLoaderVisibility(value) {
    const loader = document.getElementById('loader');

    if (value) {
        loader.classList.remove('loader--closed');
    } else {
        setTimeout(() => {
            loader.classList.add('loader--closed');
        }, 100);
    }
}