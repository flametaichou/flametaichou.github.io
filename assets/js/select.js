/**
 * Origin:
 * https://www.w3schools.com/howto/howto_custom_select.asp
 */

var selectWrapper, 
    selectsCounter, 
    optionsCounter, 
    elements, 
    optionElements, 
    selectElement, 
    newSelectElement, 
    newSelectItemsElement, 
    newSelectOptionElement;

/* Look for any elements with the class 'custom-select': */
selectWrapper = document.getElementsByClassName('f-select');
elements = selectWrapper.length;
for (selectsCounter = 0; selectsCounter < elements; selectsCounter++) {
    selectElement = selectWrapper[selectsCounter].getElementsByTagName('select')[0];
    optionElements = selectElement.length;
    /* For each element, create a new DIV that will act as the selected item: */
    newSelectElement = document.createElement('div');
    newSelectElement.setAttribute('class', 'f-select--selected');
    newSelectElement.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
    selectWrapper[selectsCounter].appendChild(newSelectElement);
    /* For each element, create a new DIV that will contain the option list: */
    newSelectItemsElement = document.createElement('div');
    newSelectItemsElement.setAttribute('class', 'f-select__items f-select--hide');
    for (optionsCounter = 1; optionsCounter < optionElements; optionsCounter++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        newSelectOptionElement = document.createElement('div');
        newSelectOptionElement.innerHTML = selectElement.options[optionsCounter].innerHTML;
        newSelectOptionElement.addEventListener('click', function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName('select')[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML === this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName('f-select--same-as-selected');
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute('class');
                    }
                    this.setAttribute('class', 'f-select--same-as-selected');
                    break;
                }
            }
            h.click();
        });
        newSelectItemsElement.appendChild(newSelectOptionElement);
    }
    selectWrapper[selectsCounter].appendChild(newSelectItemsElement);
    newSelectElement.addEventListener('click', function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle('f-select--hide');
        this.classList.toggle('f-select__arrow--active');
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName('f-select__items');
    y = document.getElementsByClassName('f-select--selected');
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt === y[i]) {
            arrNo.push(i);
        } else {
            y[i].classList.remove('f-select__arrow--active');
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add('f-select--hide');
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener('click', closeAllSelect);