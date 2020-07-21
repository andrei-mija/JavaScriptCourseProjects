class Timer{
    constructor(durationInput, startButton, pauseButton, callbacks) {
        this.durationInput = durationInput;
        this.startButton =startButton;
        this.pauseButton = pauseButton;
        this.smoothness = 20;
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
            this.onStart(this.timeRemaining);
        }
        this.tick();
        this.interval = setInterval(this.tick, this.smoothness);
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
            this.timeRemaining = this.timeRemaining - this.smoothness / 1000;   // uses the setter
            if(this.onTick) {
                this.onTick(this.timeRemaining);
            }
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
        this.durationInput.value = time.toFixed(2);
    } 
}