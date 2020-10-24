"use strict";
class SoundPad extends HTMLElement {
    constructor() {
        super();
        this.soundsQueue = new Map();
        this.currentlyPlaying = 0;
        this.audioElem = document.createElement('audio');
        this.addEventListener('padbuttonpress', (event) => {
            event.stopPropagation();
            this.enqueue(event.detail.id, event.detail.sound);
        });
    }
    enqueue(padButtonId, soundName) {
        // If it's playing, do nothing
        if (padButtonId === this.currentlyPlaying) {
            return;
        }
        // If it's queued, unqueue it
        if (this.soundsQueue.has(padButtonId)) {
            this.removeQueuedSound(padButtonId);
            return;
        }
        // Enqueue it
        this.soundsQueue.set(padButtonId, soundName);
        // Start playing, only for the first one. The `playSound` method will handle the play chain
        if (this.soundsQueue.size === 1) {
            this.playSound();
        }
    }
    playSound() {
        const nextElem = this.soundsQueue.entries().next();
        const done = nextElem.done;
        if (done) {
            this.currentlyPlaying = 0;
            return;
        }
        const value = nextElem.value;
        const [id, soundPath] = value;
        this.currentlyPlaying = id;
        this.audioElem.src = soundPath;
        this.audioElem.play();
        this.audioElem.onended = () => {
            this.removeQueuedSound(id);
            this.playSound();
        };
    }
    removeQueuedSound(id) {
        const padButtonELem = document.querySelector("#" + id);
        padButtonELem.soundEnded();
        this.soundsQueue.delete(id);
    }
}
customElements.define('sound-pad', SoundPad);
