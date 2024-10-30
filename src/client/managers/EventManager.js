

export const EVENTS = {
    ABOUT_CLICK: 'about_click',
    RESUME_CLICK: 'resume_click',
    GRIDFINITY_CLICK: 'gridfinity_click',
    HOME_CLICK: 'home_click',
}

class EventManager {
    constructor() {
        this.listeners = {};
    }

    addEventListener(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    removeEventListener(event, listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }

    emit(event, data) {
        console.log('Event emitted:', event, data);
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => listener(data));
    }
}


const inst = new EventManager();

export { inst as EventManager };