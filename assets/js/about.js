const TAP_TIMEOUT = 200;
const CHANGE_TIMEOUT = 4000;
const EMOJI = '🔥';
let nameChanged = false;

startChangingName = function () {
    const name = document.getElementById('about-name');
    clearName(name);
};

clearName = function (name) {
    setTimeout(() => {
        if (name.innerText) {
            name.innerText = name.innerText === EMOJI ? '' : name.innerText.slice(0, -1);
            clearName(name);

        } else {
            if (nameChanged) {
                fillName(name, 'Flame');

            } else {
                fillName(name, '🔥');
            }
        }
    }, TAP_TIMEOUT);
};

fillName = function (name, nameString) {
    setTimeout(() => {
        if (!nameString.includes(name.innerText)) {
            name.innerText = '';
        }

        if (name.innerText !== nameString) {
            name.innerText += nameString === EMOJI ? nameString : nameString[name.innerText.length];
            fillName(name, nameString);

        } else {
            nameChanged = !nameChanged;
            setTimeout(() => clearName(name), CHANGE_TIMEOUT);
        }
    }, TAP_TIMEOUT);
};

setTimeout(() => startChangingName(), CHANGE_TIMEOUT);
