---
# This is necessary for the file to be processed by Jekyll
---
const i18n = {{ site.data.translations | jsonify }};
const i18n_KEY = 'i18n';
const SYSTEM_LANG = navigator.language ? navigator.language.substring(0, 2) : undefined;
const USER_LANG = localStorage.getItem(i18n_KEY);
const LANG_SWITCHER_ELEMENT_ID = 'lang-switcher';

function t(lang) {
    setLoaderVisibility(true);

    document.documentElement.setAttribute('lang', lang);

    for (key of Object.keys(i18n)) {
        elements = document.getElementsByName(`i18n.${key}`);
        elements.forEach((e) => {
            e.innerText = i18n[key][lang];
        });
    }

    localStorage.setItem(i18n_KEY, lang);

    setLoaderVisibility(false);
}

function selectLang() {
    const lang = document.getElementById(LANG_SWITCHER_ELEMENT_ID).value;
    t(lang);
}

function initLang() {
    const lang = USER_LANG ? USER_LANG : SYSTEM_LANG;
    document.getElementById(LANG_SWITCHER_ELEMENT_ID).value = lang;
    t(lang);
}

