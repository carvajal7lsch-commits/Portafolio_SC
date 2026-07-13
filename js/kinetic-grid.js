/**
 * Kinetic Grid Background Effect
 * A Vanilla JS hardware-accelerated canvas implementation of the Framer Interactive Grid.
 */
class KineticGrid {
    constructor(canvasId, containerSelector, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.container = document.querySelector(containerSelector) || window;
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration options
        this.gridSize = options.gridSize || 60;
        this.dotSize = options.dotSize || 1.5;
        this.hoverColor = options.hoverColor || { r: 59, g: 130, b: 246 }; // #3b82f6
        this.gridColor = options.gridColor || { r: 255, g: 255, b: 255 };
        this.dotColor = options.dotColor || { r: 255, g: 255, b: 255 };
        this.baseOpacity = options.baseOpacity !== undefined ? options.baseOpacity : 0.08;
        this.hoverRadius = options.hoverRadius || 280;
        this.repulsion = options.repulsion || 40;
        this.springStiffness = options.springStiffness || 0.03;
        this.damping = options.damping || 0.85;
        this.gridThickness = options.gridThickness || 0.5;
        
        this.dots = new Map();
        this.mouse = null;
        this.width = 0;
        this.height = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.initDots();
    }
    
    initDots() {
        this.dots.clear();
        // Generate grid nodes including borders
        const padding = this.gridSize * 2;
        for (let x = -this.gridSize; x < this.width + padding; x += this.gridSize) {
            for (let y = -this.gridSize; y < this.height + padding; y += this.gridSize) {
                const key = `${x},${y}`;
                this.dots.set(key, {
                    ox: x, // original x position
                    oy: y, // original y position
                    x: x,  // current x position
                    y: y,  // current y position
                    vx: 0,
                    vy: 0,
                    size: this.dotSize,
                    targetSize: this.dotSize
                });
            }
        }
    }
    
    bindEvents() {
        const handleMouseMove = (e) => {
            const rect = this.container.getBoundingClientRect();
            // Mouse coordinates relative to container/canvas
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            
            // Check if mouse is within container bounds or slightly beyond
            if (mx >= -100 && my >= -100 && mx <= this.width + 100 && my <= this.height + 100) {
                this.mouse = { x: mx, y: my };
            } else {
                this.mouse = null;
            }
        };
        
        const handleMouseLeave = () => {
            this.mouse = null;
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        this.container.addEventListener('mouseleave', handleMouseLeave);
        
        // Resize observer
        const resizeObserver = new ResizeObserver(() => this.resize());
        resizeObserver.observe(this.container);
    }
    
    getHoverIntensity(x, y) {
        if (!this.mouse) return 0;
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > this.hoverRadius) return 0;
        // Exponential falloff for premium smooth visual glow
        return Math.pow(1 - dist / this.hoverRadius, 3.5);
    }
    
    getRepulsionOffset(ox, oy) {
        if (!this.mouse) return { x: 0, y: 0 };
        const dx = ox - this.mouse.x;
        const dy = oy - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0 || dist > this.hoverRadius) return { x: 0, y: 0 };
        
        const force = Math.pow(1 - dist / this.hoverRadius, 2) * this.repulsion;
        return {
            x: (dx / dist) * force,
            y: (dy / dist) * force
        };
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw grid lines
        this.dots.forEach((dot, key) => {
            const coords = key.split(',');
            const gx = parseInt(coords[0]);
            const gy = parseInt(coords[1]);
            
            const rightNeighbor = this.dots.get(`${gx + this.gridSize},${gy}`);
            const bottomNeighbor = this.dots.get(`${gx},${gy + this.gridSize}`);
            
            const hoverVal = this.getHoverIntensity(dot.x, dot.y);
            
            if (rightNeighbor) {
                const nHover = this.getHoverIntensity(rightNeighbor.x, rightNeighbor.y);
                const avgHover = (hoverVal + nHover) / 2;
                
                // Color interpolation
                const r = Math.round(this.gridColor.r + (this.hoverColor.r - this.gridColor.r) * avgHover);
                const g = Math.round(this.gridColor.g + (this.hoverColor.g - this.gridColor.g) * avgHover);
                const b = Math.round(this.gridColor.b + (this.hoverColor.b - this.gridColor.b) * avgHover);
                const alpha = this.baseOpacity + (1 - this.baseOpacity) * avgHover;
                
                this.ctx.beginPath();
                this.ctx.moveTo(dot.x, dot.y);
                this.ctx.lineTo(rightNeighbor.x, rightNeighbor.y);
                this.ctx.lineWidth = this.gridThickness + avgHover * 1.5;
                this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                this.ctx.stroke();
            }
            
            if (bottomNeighbor) {
                const nHover = this.getHoverIntensity(bottomNeighbor.x, bottomNeighbor.y);
                const avgHover = (hoverVal + nHover) / 2;
                
                // Color interpolation
                const r = Math.round(this.gridColor.r + (this.hoverColor.r - this.gridColor.r) * avgHover);
                const g = Math.round(this.gridColor.g + (this.hoverColor.g - this.gridColor.g) * avgHover);
                const b = Math.round(this.gridColor.b + (this.hoverColor.b - this.gridColor.b) * avgHover);
                const alpha = this.baseOpacity + (1 - this.baseOpacity) * avgHover;
                
                this.ctx.beginPath();
                this.ctx.moveTo(dot.x, dot.y);
                this.ctx.lineTo(bottomNeighbor.x, bottomNeighbor.y);
                this.ctx.lineWidth = this.gridThickness + avgHover * 1.5;
                this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                this.ctx.stroke();
            }
        });
        
        // Update physics and draw dots
        this.dots.forEach((dot) => {
            // Spring Target
            const push = this.getRepulsionOffset(dot.ox, dot.oy);
            const targetX = dot.ox + push.x;
            const targetY = dot.oy + push.y;
            
            // Physics simulation
            const forceX = (targetX - dot.x) * this.springStiffness;
            const forceY = (targetY - dot.y) * this.springStiffness;
            
            dot.vx = (dot.vx + forceX) * this.damping;
            dot.vy = (dot.vy + forceY) * this.damping;
            
            dot.x += dot.vx;
            dot.y += dot.vy;
            
            // Draw node dot
            const hoverVal = this.getHoverIntensity(dot.x, dot.y);
            dot.targetSize = this.dotSize + hoverVal * this.dotSize * 1.5;
            dot.size += (dot.targetSize - dot.size) * 0.2;
            
            const r = Math.round(this.dotColor.r + (this.hoverColor.r - this.dotColor.r) * hoverVal);
            const g = Math.round(this.dotColor.g + (this.hoverColor.g - this.dotColor.g) * hoverVal);
            const b = Math.round(this.dotColor.b + (this.hoverColor.b - this.dotColor.b) * hoverVal);
            const alpha = this.baseOpacity + (1 - this.baseOpacity) * hoverVal;
            
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}
