// js/galaxy.js

class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.x += dx / this.zoom;
        this.y += dy / this.zoom;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onWheel(e) {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);
        
        // Clamp zoom to avoid getting lost
        this.zoom = Math.max(0.1, Math.min(10, this.zoom * zoom));
    }

    applyTransform() {
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this.canvas.width / 2 + this.x, -this.canvas.height / 2 + this.y);
    }
}

class Galaxy {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.numStars = 5000;
        this.width = canvas.width;
        this.height = canvas.height;
        this.camera = new Camera(canvas);

        // Galaxy generation parameters
        this.galaxyRadius = Math.min(this.width, this.height) * 0.4;
        this.coreRadius = this.galaxyRadius * 0.2;
        this.numArms = 3;
        this.armTightness = 5; // Increased for tighter arms
        this.armWobble = 0.2; // Increased for more natural arms
    }

    // Generate a believable spiral galaxy
    generate() {
        for (let i = 0; i < this.numStars; i++) {
            const isCoreStar = Math.random() < 0.3; // 30% of stars are in the core

            let x, y, size;
            const angle = Math.random() * 2 * Math.PI;

            if (isCoreStar) {
                // Generate a star in the dense core
                const radius = Math.random() * this.coreRadius;
                x = this.width / 2 + Math.cos(angle) * radius;
                y = this.height / 2 + Math.sin(angle) * radius;
                size = 1 + Math.random() * 1.5;
            } else {
                // Generate a star in the spiral arms
                const armIndex = Math.floor(Math.random() * this.numArms);
                const armAngle = (armIndex / this.numArms) * 2 * Math.PI;
                const radius = this.coreRadius + Math.random() * (this.galaxyRadius - this.coreRadius);
                
                // Calculate the position in the arm
                const armOffset = (radius / this.galaxyRadius) * this.armTightness * 2 * Math.PI;
                const totalAngle = armAngle + armOffset + (Math.random() - 0.5) * this.armWobble;

                x = this.width / 2 + Math.cos(totalAngle) * radius;
                y = this.height / 2 + Math.sin(totalAngle) * radius;
                size = 0.5 + Math.random() * 1;
            }

            this.stars.push({ x, y, size });
        }
    }

    // Render the galaxy
    render() {
        // Clear the canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Save the context state
        this.ctx.save();
        
        // Apply camera transformations
        this.camera.applyTransform();

        // Draw each star
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * this.camera.zoom, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
        });
        
        // Restore the context state
        this.ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('galaxy-canvas');
    if (canvas) {
        // Match canvas resolution to its display size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const galaxy = new Galaxy(canvas);
        galaxy.generate();
        
        // Animation loop
        function animate() {
            galaxy.render();
            requestAnimationFrame(animate);
        }
        
        animate();
    }
});
