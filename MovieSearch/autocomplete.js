/*
    Function which takes as parameters a DOM elements and
    4 methods and creates the autocomplete menu.
*/
const createAutocomplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    // set the template of the autocompelte menu
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `;
    const input = root.querySelector('input');
    const dropdown = root.querySelector('div .dropdown');
    const resultWrapper = root.querySelector('.results');
    // when we have input we wait to receive result.
    const onInput = async event => {
        const items = await fetchData(event.target.value);

        if(!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultWrapper.innerHTML = '';
        dropdown.classList.add('is-active'); // enable the dropdown
        for(let item of items) {
            const option = document.createElement('a'); // create an anchor
            
            option.classList.add('dropdown-item');      // item of the dropdown
            option.innerHTML = renderOption(item);      // show the item 
            option.addEventListener('click', event => { // when we click on an item
                dropdown.classList.remove('is-active'); // close the dropdown
                input.value = inputValue(item);         // display the new title/name
                onOptionSelect(item);                   // select the item that we just clicked on
            });

            resultWrapper.appendChild(option);
        }
    };
    input.addEventListener('input', debounce(onInput, 500)); // look for results after a bit of time
    // close the dropdown if we clicked outside of it
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};