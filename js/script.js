// Preloader moved to inline script in index.html
        document.addEventListener('DOMContentLoaded', function() {
            

            // Mobile Menu Toggle
            const mobileMenuBtn = document.querySelector('.navbar__mobile-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Calculate scrollbar width to prevent layout shift on desktop
                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
                    
                    document.body.classList.toggle('menu-open');
                    
                    // Subtle Menu Interaction Sound
                    try {
                        var ctx = new (window.AudioContext || window.webkitAudioContext)();
                        var osc = ctx.createOscillator();
                        var gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        
                        var isOpen = document.body.classList.contains('menu-open');
                        
                        osc.type = 'sine';
                        if (isOpen) {
                            osc.frequency.setValueAtTime(400, ctx.currentTime);
                            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
                        } else {
                            osc.frequency.setValueAtTime(600, ctx.currentTime);
                            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
                        }
                        
                        gain.gain.setValueAtTime(0, ctx.currentTime);
                        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                        
                        osc.start(ctx.currentTime);
                        osc.stop(ctx.currentTime + 0.1);
                    } catch(e) { }
                    
                });
            }
            
            // Footer Accordion Logic (Mobile)
            const footerGroups = document.querySelectorAll('.footer__title');
            footerGroups.forEach(function(title) {
                title.addEventListener('click', function() {
                    if (window.innerWidth <= 1024) {
                        const parent = this.parentElement;
                        const wasActive = parent.classList.contains('active');
                        
                        // Close all footer groups first
                        document.querySelectorAll('.footer__group').forEach(group => {
                            group.classList.remove('active');
                        });
                        
                        // Open only the one that was clicked (if it wasn't already open)
                        if (!wasActive) {
                            parent.classList.add('active');
                        }
                    }
                });
            });

            // Language Dropdown Logic
            const langDropdown = document.querySelector('.navbar__lang-dropdown');
            const langToggle = document.getElementById('langToggle');
            const currentLangText = document.getElementById('currentLangText');
            const langOptions = document.querySelectorAll('.navbar__lang-option');
            
            if (langToggle && langDropdown) {
                langToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    langDropdown.classList.toggle('open');
            if (langDropdown.classList.contains('open')) playPopupSound();
                });
                
                document.addEventListener('click', function(e) {
                    if (!langDropdown.contains(e.target)) {
                        langDropdown.classList.remove('open');
                    }
                });

                if (currentLangText && langOptions) {
                    langOptions.forEach(option => {
                                                                                option.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                const i18nKey = this.getAttribute('data-i18n');
                                let langCode = 'ro'; 
                                
                                if (i18nKey === 'lang_en') langCode = 'en';
                                else if (i18nKey === 'lang_ru') langCode = 'ru';
                                
                                if (typeof changeLanguage === 'function') {
                                    changeLanguage(langCode);
                                } else {
                                    currentLangText.innerText = this.innerText;
                                }
                                
                                // Close dropdown
                                langDropdown.classList.remove('open');
                            });
                    });
                }
            }

            // Navbar scroll logic
            const navbar = document.querySelector('.navbar');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 10) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // FAQ Accordion logic
            const faqItems = document.querySelectorAll('.faq__item');
            faqItems.forEach(item => {
                const header = item.querySelector('.faq__header');
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all
                    faqItems.forEach(faq => {
                        faq.classList.remove('active');
                        
                    });
                    
                    // Open clicked
                    if (!isActive) {
                        item.classList.add('active');
                        const answer = item.querySelector('.faq__answer');
                        
                    }
                });
            });
            
            // Open the first FAQ item by default on page load
            if (faqItems.length > 0) {
                // Use setTimeout to ensure DOM is fully rendered before calculating scrollHeight
                setTimeout(() => {
                    faqItems[0].querySelector('.faq__header').click();
                }, 100);
            }

            // Draggable logic ONLY (Modal removed)
            const dragItems = document.querySelectorAll('.draggable');
            let activeItem = null;
            let initialX, initialY, initialLeft, initialTop;
            let maxZ = 20;

            dragItems.forEach(item => {
                item.addEventListener('mousedown', dragStart);
                item.addEventListener('touchstart', dragStart, {passive: false});
            });

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            
            document.addEventListener('touchmove', drag, {passive: false});
            document.addEventListener('touchend', dragEnd);

            function dragStart(e) {
                if (window.innerWidth <= 1024) return;
                if (e.target.closest('.draggable')) {
                    if (e.type === "touchstart") {
                        initialX = e.touches[0].clientX;
                        initialY = e.touches[0].clientY;
                    } else {
                        initialX = e.clientX;
                        initialY = e.clientY;
                    }
                    
                    activeItem = e.target.closest('.draggable');
                    activeItem.style.zIndex = ++maxZ;
                    
                    initialLeft = activeItem.offsetLeft;
                    initialTop = activeItem.offsetTop;
                    
                    
                    
                }
            }

            function drag(e) {
                if (!activeItem) return;
                e.preventDefault();
                
                let currentX, currentY;
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX;
                    currentY = e.touches[0].clientY;
                } else {
                    currentX = e.clientX;
                    currentY = e.clientY;
                }
                
                let diffX = currentX - initialX;
                let diffY = currentY - initialY;
                
                activeItem.style.setProperty('left', (initialLeft + diffX) + 'px', 'important');
                activeItem.style.setProperty('top', (initialTop + diffY) + 'px', 'important');
            }

            function dragEnd(e) {
                activeItem = null;
            }
        });

        // Scroll Animation Logic
        const fadeElements = document.querySelectorAll('.fade-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });
        
        fadeElements.forEach(el => observer.observe(el));

        // Click Particles Animation
        document.addEventListener('click', function(e) {
            // Ignore if clicked on something draggable to not interfere
            if (e.target.closest('.draggable')) return;
            
            if (window.innerWidth <= 1024) return;
            const numParticles = 4;
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.className = 'click-particle';
                
                const size = 8;
                particle.style.left = (e.clientX - size/2) + 'px';
                particle.style.top = (e.clientY - size/2) + 'px';
                
                document.body.appendChild(particle);
                
                const angle = Math.random() * Math.PI * 2;
                const velocity = 20 + Math.random() * 30; // 20 to 50px spread
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                // Trigger animation next frame
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        particle.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(0)';
                        particle.style.opacity = '0';
                    });
                });
                
                setTimeout(() => {
                    particle.remove();
                }, 600);
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            

            const lenis = new Lenis({
                duration: 1.8,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                syncTouch: false,
                touchMultiplier: 1,
                infinite: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
            
            // Allow Lenis to handle anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.body.classList.remove('menu-open'); // CLOSE MOBILE MENU ON CLICK!
                    var target = this.getAttribute('href');
                    if (target === '#') {
                        lenis.scrollTo(0, { duration: 1.8 });
                    } else {
                        lenis.scrollTo(target, { duration: 1.8, offset: -120 });
                    }
                });
            });
        });













    // Mobile Card Popup Logic
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(card => {
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                // Don't trigger if they clicked a link inside (if any)
                if (e.target.tagName.toLowerCase() === 'a') return;
                
                // Block Scroll
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';

                // Create Modal
                const modal = document.createElement('div');
                modal.className = 'mobile-card-modal';
                
                // Clone Card
                const clone = card.cloneNode(true);
                // Clear inline styles to let CSS take over
                clone.style = '';
                
                modal.appendChild(clone);
                
                // Close on click
                modal.addEventListener('click', function() {
                    modal.remove();
                    // Restore Scroll
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                });
                
                document.body.appendChild(modal);
            }
        });
    });









// --- MULTI-SOUND CLICK SYSTEM ---
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 1. BUTTON - clean Apple-like tock
function playButtonSound() {
    if (window.innerWidth <= 1024) return;
    initAudio();
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
}

// 2. BACKGROUND - soft tick (audible)
function playBackgroundSound() {
    if (window.innerWidth <= 1024) return;
    initAudio();
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.025);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
}

// 3. POPUP - gentle soft pop
function playPopupSound() {
    if (window.innerWidth <= 1024) return;
    initAudio();
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.06);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
}

// Smart click router - always plays a sound on every click
document.addEventListener('mousedown', function(e) {
    var tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    var isBtn = (tag === 'a' || tag === 'button' || tag === 'span');
    if (!isBtn) {
        try { isBtn = !!e.target.closest('button, .btn, a, .navbar__item, .navbar__lang-option, .faq__header, .review__link, .project-card__link, .navbar__cv-download-option, .navbar__mobile-btn, .draggable'); } catch(err) {}
    }
    if (isBtn) {
        playButtonSound();
    } else {
        playBackgroundSound();
    }
}, true);
document.addEventListener('touchstart', function(e) {
    var tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    var isBtn = (tag === 'a' || tag === 'button' || tag === 'span');
    if (!isBtn) {
        try { isBtn = !!e.target.closest('button, .btn, a, .navbar__item, .navbar__lang-option, .faq__header, .review__link, .project-card__link, .navbar__cv-download-option, .navbar__mobile-btn, .draggable'); } catch(err) {}
    }
    if (isBtn) {
        playButtonSound();
    } else {
        playBackgroundSound();
    }
}, {passive: true, capture: true});

// CV Download Dropdown Logic
var cvDropdown = document.querySelector('.navbar__cv-dropdown');
var cvToggle = document.getElementById('cvToggle');

if (cvToggle && cvDropdown) {
    cvToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var langD = document.querySelector('.navbar__lang-dropdown');
        if (langD) langD.classList.remove('open');
        cvDropdown.classList.toggle('open');
        if (cvDropdown.classList.contains('open')) playPopupSound();
    });

    document.addEventListener('click', function(e) {
        if (!cvDropdown.contains(e.target)) {
            cvDropdown.classList.remove('open');
        }
    });
}




/* --- iOS 3D STICKY STACK (MOBILE ONLY) --- */
    // 2. 3D Sticky Stacking (iOS Style)
    const wrappers = document.querySelectorAll('.project-stack__wrapper');
    
    function update3DStacking() {
        const isMobile = window.innerWidth <= 1024;
        
        if (!isMobile) {
            // Reset transforms on desktop
            wrappers.forEach(w => {
                const card = w.querySelector('.project-card');
                if (card) {
                    card.style.transform = '';
                    card.style.filter = '';
                }
            });
            requestAnimationFrame(update3DStacking);
            return;
        }

        for (let i = 0; i < wrappers.length - 1; i++) {
            const currentWrapper = wrappers[i];
            const nextWrapper = wrappers[i + 1];
            const currentCard = currentWrapper.querySelector('.project-card');
            
            if (!currentCard) continue;

            const nextRect = nextWrapper.getBoundingClientRect();
            const stickyTop = parseInt(window.getComputedStyle(currentWrapper).top) || 149;
            const transitionDistance = window.innerHeight * 0.5; 
            const distanceToSticky = nextRect.top - stickyTop;
            
            let progress = 0;
            if (distanceToSticky <= transitionDistance && distanceToSticky >= 0) {
                progress = 1 - (distanceToSticky / transitionDistance);
            } else if (distanceToSticky < 0) {
                progress = 1;
            }
            
            const scale = 1 - (progress * 0.06);
            const brightness = 1 - (progress * 0.35);
            
            currentCard.style.transformOrigin = 'top center';
            currentCard.style.willChange = 'transform, filter';
            currentCard.style.transform = `scale(${scale})`;
            currentCard.style.filter = `brightness(${brightness})`;
        }
        requestAnimationFrame(update3DStacking);
    }
    
    // Start the animation loop
    requestAnimationFrame(update3DStacking);


// Global Dropdown Mutually Exclusive Logic
document.addEventListener('click', function(e) {
    const langD = document.querySelector('.navbar__lang-dropdown');
    const cvD = document.querySelector('.navbar__cv-dropdown');
    
    // If we click on the langToggle, close CV
    const langT = document.getElementById('langToggle');
    if (langT && (langT.contains(e.target) || langT === e.target)) {
        if (cvD) cvD.classList.remove('open');
    }
    
    // If we click on the cvToggle, close Lang
    const cvT = document.getElementById('cvToggle');
    if (cvT && (cvT.contains(e.target) || cvT === e.target)) {
        if (langD) langD.classList.remove('open');
    }
}, true); // Use capture phase to ensure it runs before their own toggles







// CV Download Progress Animation
document.addEventListener('click', function(e) {
    const link = e.target.closest('.navbar__cv-download-option');
    if (link) {
        e.preventDefault();
        
        // Start animation
        link.classList.add('is-loading');
        
        // Wait for animation to finish (1.2s)
        setTimeout(() => {
            // Open the PDF
            window.open(link.href, link.target || '_blank');
            
            // Reset state and close menu
            link.classList.remove('is-loading');
            const cvMenu = document.getElementById('cvMenu');
            if(cvMenu) cvMenu.classList.remove('open');
        }, 1200);
    }
});




