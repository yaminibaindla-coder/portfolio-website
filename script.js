import * as THREE from 'three';

// --- CONFIGURATION & STATE ---
const state = {
    progress: 0,
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    isLoaded: false
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initThree();
    initLenis();
    initAnimations();
    initCustomCursor();
    initTyping();
    initProjectPreview();
});

// --- LOADER ---
function initLoader() {
    const progressFill = document.querySelector('.progress-fill');
    const loader = document.getElementById('loader');
    
    let interval = setInterval(() => {
        state.progress += Math.random() * 10;
        if (state.progress >= 100) {
            state.progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                state.isLoaded = true;
            }, 500);
        }
        progressFill.style.width = `${state.progress}%`;
    }, 100);
}

// --- THREE.JS ---
function initThree() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 30;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2ff, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Starfield Background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const posArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Interactive Hero Object (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00f2ff,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Position object
    torusKnot.position.x = 20;
    if (window.innerWidth < 992) torusKnot.position.x = 0;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.0005;

        // Rotate object
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;

        // Floating effect
        torusKnot.position.y = Math.sin(time) * 2;

        // Particle movement
        starField.rotation.y += 0.0005;
        
        // Mouse reaction
        state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.05;
        state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.05;

        torusKnot.rotation.x += state.mouse.y * 0.5;
        torusKnot.rotation.y += state.mouse.x * 0.5;
        
        starField.position.x = state.mouse.x * 2;
        starField.position.y = -state.mouse.y * 2;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (window.innerWidth < 992) {
            torusKnot.position.x = 0;
        } else {
            torusKnot.position.x = 20;
        }
    });

    // Mouse Move Handler
    window.addEventListener('mousemove', (e) => {
        state.targetMouse.x = (e.clientX / window.innerWidth) - 0.5;
        state.targetMouse.y = (e.clientY / window.innerHeight) - 0.5;
    });
    
    // Scroll interaction
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        camera.position.z = 30 + (scrollPercent * 20);
        torusKnot.rotation.z = scrollPercent * Math.PI;
    });
}

// --- LENIS SMOOTH SCROLL ---
function initLenis() {
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// --- GSAP ANIMATIONS ---
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar reveal
    gsap.from('nav', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 1.5
    });

    // Hero reveal
    const heroTl = gsap.timeline({ delay: 1.8 });
    heroTl.from('.eyebrow', { opacity: 0, x: -20, duration: 0.8 })
          .from('.hero h1', { opacity: 0, y: 30, duration: 1, ease: 'power4.out' }, '-=0.4')
          .from('.subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from('.hero-btns', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from('.scroll-indicator', { opacity: 0, duration: 1 }, '-=0.4');

    // Section Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Glass Cards
    gsap.utils.toArray('.glass').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Project Cards Tilt (CSS-based or simple JS)
    // Here we use GSAP to handle hover scale
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.05, duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.3 });
        });
    });
}

// --- CUSTOM CURSOR ---
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const blur = document.getElementById('cursor-blur');
    
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(blur, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.3 });
    });
    
    // Hover effects
    document.querySelectorAll('a, button, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(blur, { width: 80, height: 80, x: e => e.clientX - 35, y: e => e.clientY - 35, backgroundColor: 'rgba(0, 242, 255, 0.1)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(blur, { width: 40, height: 40, backgroundColor: 'transparent', duration: 0.3 });
        });
    });
}

// --- TYPING ANIMATION ---
function initTyping() {
    const textElement = document.getElementById('typing-text');
    const name = "YAMINI BAINDLA";
    let index = 0;

    function type() {
        if (index < name.length) {
            textElement.innerHTML += name.charAt(index);
            index++;
            setTimeout(type, 150);
        }
    }

    // Start typing after loader
    setTimeout(type, 2500);
}

// --- FORM HANDLING ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'TRANSMITTING...';
        btn.disabled = true;
        
        // Simulate sending
        setTimeout(() => {
            btn.innerText = 'DATA RECEIVED';
            btn.style.background = '#00ff88';
            btn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = 'var(--accent-color)';
                btn.style.boxShadow = 'var(--neon-glow)';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// --- PROJECT PREVIEW HOVER ---
function initProjectPreview() {
    const preview = document.getElementById('project-preview');
    const previewImg = preview.querySelector('img');
    const projectCards = document.querySelectorAll('.project-card');
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const imageSrc = card.getAttribute('data-image');
            if (imageSrc) {
                previewImg.src = imageSrc;
                preview.classList.add('active');
            }
        });
        
        card.addEventListener('mousemove', (e) => {
            targetX = e.clientX + 20; // Offset from cursor
            targetY = e.clientY + 20;
        });
        
        card.addEventListener('mouseleave', () => {
            preview.classList.remove('active');
        });
    });
    
    // Smooth follow logic (Lerp)
    function updatePreviewPos() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        
        preview.style.left = `${currentX}px`;
        preview.style.top = `${currentY}px`;
        
        requestAnimationFrame(updatePreviewPos);
    }
    
    updatePreviewPos();
}
