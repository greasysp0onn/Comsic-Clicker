// js/upgrades.js

class UpgradeManager {
    constructor() {
        this.upgrades = [];
        this.unlockedUpgrades = new Set();
        this.purchasedUpgrades = new Map();

        // Lexicon for procedural generation
        this.lexicon = {
            prefixes: ['Quantum', 'Celestial', 'Galactic', 'Stellar', 'Cosmic', 'Nebular', 'Eldritch', 'Temporal', 'Singularity'],
            nouns: ['Forge', 'Engine', 'Catalyst', 'Synthesizer', 'Harmonizer', 'Collector', 'Relay', 'Matrix', 'Crucible'],
            suffixes: ['of the Void', 'of the First Light', 'of Infinite Density', 'of the Singularity', 'of the God-Engine', 'of the Cosmos'],
        };
    }

    // Procedurally generate a name for an upgrade
    generateName() {
        const prefix = this.lexicon.prefixes[Math.floor(Math.random() * this.lexicon.prefixes.length)];
        const noun = this.lexicon.nouns[Math.floor(Math.random() * this.lexicon.nouns.length)];
        const suffix = this.lexicon.suffixes[Math.floor(Math.random() * this.lexicon.suffixes.length)];
        return `${prefix} ${noun} ${suffix}`;
    }
    
    // Generate the initial set of tier 1 upgrades
    generateTier1Upgrades(count = 20) {
        for (let i = 0; i < count; i++) {
            const name = this.generateName();
            const upgrade = {
                id: `upgrade_${i}`,
                name: name,
                description: 'A foundational technology that expands your cosmic influence.',
                cost: [
                    { resource: 'Cosmic Dough', amount: Math.floor(10 * Math.pow(1.5, i)) },
                    { resource: 'Stardust', amount: Math.floor(5 * Math.pow(1.2, i)) }
                ],
                effects: [
                    { type: 'click_power', value: 1 + i },
                    { type: 'resource_generation', resource: 'Stardust', value: 0.1 * i }
                ],
                purchased: 0
            };
            this.upgrades.push(upgrade);
        }
    }

    getAvailableUpgrades() {
        // For now, all generated upgrades are available
        return this.upgrades;
    }

    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;

        // Check if the player can afford the upgrade
        for (const cost of upgrade.cost) {
            if (GameResources.getAmount(cost.resource) < cost.amount) {
                return false; // Cannot afford
            }
        }

        // Deduct the cost
        for (const cost of upgrade.cost) {
            GameResources.decrease(cost.resource, cost.amount);
        }

        // Mark as purchased and apply effects
        upgrade.purchased++;
        this.applyUpgradeEffects(upgrade);
        
        // Increase cost for next purchase
        for (const cost of upgrade.cost) {
            cost.amount = Math.ceil(cost.amount * 2.5);
        }

        return true;
    }

    applyUpgradeEffects(upgrade) {
        upgrade.effects.forEach(effect => {
            if (effect.type === 'click_power') {
                GameState.clickPower += effect.value;
            } else if (effect.type === 'resource_generation') {
                if (GameState.resourcesPerSecond[effect.resource]) {
                    GameState.resourcesPerSecond[effect.resource] += effect.value;
                } else {
                    GameState.resourcesPerSecond[effect.resource] = effect.value;
                }
            }
        });
    }
}

const GameUpgrades = new UpgradeManager();
GameUpgrades.generateTier1Upgrades();
