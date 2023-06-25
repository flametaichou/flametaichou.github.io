---
# This is necessary for the file to be processed by Jekyll
---
const i18n = {{ site.data.i18n | jsonify }};
const LANGUAGES = {{ site.languages | jsonify }};
const DEFAULT_LANG = {{ site.lang | jsonify }};
const i18n_KEY = 'i18n';
const SYSTEM_LANG = navigator.language ? navigator.language.substring(0, 2) : undefined;
const USER_LANG = localStorage.getItem(i18n_KEY);
const LANG_SWITCHER_ELEMENT_ID = 'lang-switcher';

/**
 * Translates all translatable content on site
 *
 * @param lang
 */
function t(lang) {
    setLoaderVisibility(true);

    if (!LANGUAGES.includes(lang)) {
        console.warn(`Unsupported lang ${lang}, fallback to ${DEFAULT_LANG}`);
        lang = DEFAULT_LANG;
    }

    document.documentElement.setAttribute('lang', lang);

    /*
    Object.keys(i18n).forEach((key) => {
        elements = document.getElementsByName(`i18n.${key}`);
        elements.forEach((e) => {
            e.innerText = i18n[key][lang];
        });
    });
    */

    for (key of Object.keys(i18n[lang])) {
        const elements = document.getElementsByName(`i18n.${key}`);
        for (e of elements) {
            try {
                e.innerText = i18n[lang][key];

            } catch (e) {
                console.error(`Error on i18n (strings): ${e}`)
            }
        }
    }

    const dateElements = document.getElementsByName('date');
    for (e of dateElements) {
        try {
            e.innerText = new Date(e.getAttribute('date')).toLocaleDateString(lang);

        } catch (e) {
            console.error(`Error on i18n (dates): ${e}`)
        }
    }

    localStorage.setItem(i18n_KEY, lang);

    setLoaderVisibility(false);
}

/**
 * Chooses language from language switcher
 */
function selectLang() {
    const lang = document.getElementById(LANG_SWITCHER_ELEMENT_ID).value;
    t(lang);
}

/**
 * Language initialization.
 * Chooses language from user system or from storage if he has chosen it already.
 */
function initLang() {
    const lang = USER_LANG ? USER_LANG : SYSTEM_LANG;
    t(lang);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
window.addEventListener('DOMContentLoaded', function() {
    initLang();
});

