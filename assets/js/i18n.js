---
# This is necessary for the file to be processed by Jekyll
---
const i18n = {{ site.data.translations | jsonify }};

function t(lang) {
    document.documentElement.setAttribute('lang', lang);

    for (key of Object.keys(i18n)) {
        elements = document.getElementsByName(`i18n.${key}`);
        elements.forEach((e) => {
            e.innerText = i18n[key][lang];
        });
    }
}

function changeLang(elementId) {
    const lang = document.getElementById(elementId).value;
    t(lang);
}