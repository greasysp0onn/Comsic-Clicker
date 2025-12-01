// js/ui.js

// Function to render upgrades
function renderUpgrades() {
    const techTreeContainer = document.getElementById('tech-tree-container');
    techTreeContainer.innerHTML = '';
    const availableUpgrades = GameUpgrades.getAvailableUpgrades();

    availableUpgrades.forEach(upgrade => {
        const upgradeElement = document.createElement('div');
        upgradeElement.classList.add('upgrade-node');

        let costHtml = '';
        upgrade.cost.forEach(c => {
            costHtml += `<span class="cost">${c.amount} ${c.resource}</span>`;
        });

        upgradeElement.innerHTML = `
            <h3 class="upgrade-name">${upgrade.name}</h3>
            <p class="upgrade-description">${upgrade.description}</p>
            <div class="upgrade-cost">Cost: ${costHtml}</div>
            <div class="upgrade-purchased">Level: ${upgrade.purchased}</div>
        `;

        // Add a click listener to purchase the upgrade
        upgradeElement.addEventListener('click', () => {
            if (GameUpgrades.purchaseUpgrade(upgrade.id)) {
                // Re-render upgrades to show new costs and levels
                renderUpgrades();
                // Re-render resources to show new amounts
                renderResources();
            }
        });

        techTreeContainer.appendChild(upgradeElement);
    });
}

// Function to render resources
function renderResources() {
    const resourceList = document.getElementById('resource-list');
    resourceList.innerHTML = ''; // Clear the list before re-rendering
    const allResources = GameResources.getAll();

    allResources.forEach(resource => {
        const resourceElement = document.createElement('div');
        resourceElement.classList.add('resource-display');
        resourceElement.innerHTML = `
            <span class="resource-name">${resource.name}</span>
            <span class="resource-amount">${Math.floor(resource.amount)}</span>
        `;
        resourceList.appendChild(resourceElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const contentPanes = document.querySelectorAll('.content-pane');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all buttons and panes
            navButtons.forEach(btn => btn.classList.remove('active'));
            contentPanes.forEach(pane => pane.classList.remove('active'));

            // Activate the clicked button
            button.classList.add('active');

            // Activate the corresponding pane
            const targetId = button.dataset.target;
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});
