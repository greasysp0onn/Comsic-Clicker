// js/resources.js

class ResourceManager {
    constructor() {
        this.resources = new Map();
    }

    // Define a new resource
    addResource(name, initialValue = 0) {
        if (!this.resources.has(name)) {
            this.resources.set(name, {
                name: name,
                amount: initialValue
            });
        }
    }

    // Get the amount of a resource
    getAmount(name) {
        return this.resources.has(name) ? this.resources.get(name).amount : 0;
    }

    // Increase the amount of a resource
    increase(name, value) {
        if (this.resources.has(name)) {
            this.resources.get(name).amount += value;
            return true;
        }
        return false;
    }

    // Decrease the amount of a resource, returns false if not enough
    decrease(name, value) {
        if (this.resources.has(name) && this.resources.get(name).amount >= value) {
            this.resources.get(name).amount -= value;
            return true;
        }
        return false;
    }

    // Get all resources for rendering
    getAll() {
        return Array.from(this.resources.values());
    }
}

// Global instance of the resource manager
const GameResources = new ResourceManager();

// Initialize the starting resources
GameResources.addResource('Cosmic Dough', 0);
GameResources.addResource('Stardust', 0);
GameResources.addResource('Nebula Gas', 0);
