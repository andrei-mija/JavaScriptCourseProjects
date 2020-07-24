/*
    Function to delay the execution of a function, by resetting
    the timer, event triggered by an action.
*/
const debounce = (func, delay = 1000) => {
    let timeoutId
    return (...args) => {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};