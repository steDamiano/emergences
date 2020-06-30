class Observable {
    constructor() {
        this.observers = new Map();
    }

    addObserver(label, callback) {
        this.observers.has(label) || this.observers.set(label, []);
        this.observers.get(label).push(callback);
    }

    removeObserver(label) {
        this.observers.delete(label);
    }

    emit(label, e = {}) {
        const actualObservers = this.observers.get(label);
        if (actualObservers && actualObservers.length) {
            actualObservers.forEach((callback) => {
                callback(e);
            });
        }
    }
}

module.exports = Observable;