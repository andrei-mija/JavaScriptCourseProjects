class Timer{
    constructor(durationInput, startButton, pauseButton) {
        this.durationInput = durationInput;
        this.startButton =startButton;
        this.pauseButton = pauseButton;

        this.startButton.addEventListener('click', this.start);
    }

    start() {
        console.log("The timer has started");
    }

    pause() {
        console.log("The timer has stopped");
    }

    tick() {
        console.log("The timer has ticked once");
    }
}

const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

const timer = new Timer(durationInput, startButton, pauseButton);   