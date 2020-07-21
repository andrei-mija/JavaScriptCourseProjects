class Timer{
    constructor(durationInput, startButton, pauseButton, callbacks) {
        this.durationInput = durationInput;
        this.startButton =startButton;
        this.pauseButton = pauseButton;
        if(callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }

        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click', this.pause);
    }

    start = () => {
        if(this.onStart) {
            this.onStart();
        }
        this.tick();
        this.interval = setInterval(this.tick, 1000);
    }

    pause = () => {
        clearInterval(this.interval);
    }

    tick = () => {
        if(this.timeRemaining <= 0) {
            if(this.onComplete) {
                this.onComplete();
            }
            this.pause();
        } else {
            if(this.onTick) {
                this.onTick();
            }
            this.timeRemaining = this.timeRemaining - 1;   // uses the setter
        }  
    }

    get timeRemaining() {
        return parseFloat(this.durationInput.value);
    }

    /*
        Uses the syntax
        this.timeRemaining = timeRemaining - 1;
        so the time = timeRemaining - 1
    */
    set timeRemaining(time) {
        this.durationInput.value = time;
    } 
}