console.log("Saved goal is", localStorage.getItem("skillvault-goal"));
console.log("SkillVault script loaded!");

const app = {
    modal: null,
    modalOverlay: null,
    profileBtn: null,
    modalCloseBtn: null,
    themeToggle: null,
    historyToggleBtn: null,
    historyList: null,
    logoutBtn: null,
    editToggleBtn: null,
    toast: null,
    currentSlide: 0,
    cards: null,
    indicators: null,
    cardsWrapper: null,
    goalInput: null,
    searchBtn: null,
    buildBtn: null,

    init() {
        this.cacheDom();
        this.bindEvents();
        this.initTheme();
        console.log('SkillVault App Initialized');
    },

    cacheDom() {
        this.modal = document.getElementById('modalOverlay');
        this.profileBtn = document.getElementById('profileBtn');
        this.modalCloseBtn = document.getElementById('modalCloseBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.historyToggleBtn = document.getElementById('historyToggleBtn');
        this.historyList = document.getElementById('historyList');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.editToggleBtn = document.getElementById('editToggleBtn');
        this.toast = document.getElementById('toast');
        this.cards = document.querySelectorAll('.card');
        this.indicators = document.querySelectorAll('.indicator');
        this.cardsWrapper = document.querySelector('.cards-wrapper');
        this.goalInput = document.getElementById('goalInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.buildBtn = document.getElementById('buildBtn');
    },

    bindEvents() {
        this.profileBtn.addEventListener('click', () => this.openModal());
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.historyToggleBtn.addEventListener('click', () => this.toggleHistory());
        this.logoutBtn.addEventListener('click', () => this.logout());
        this.editToggleBtn.addEventListener('click', () => this.editName());
        
        // Carousel events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.buildBtn.addEventListener('click', () => this.handleBuild());

        // Swipe events
        let touchStartX = 0;
        let touchEndX = 0;

        this.cardsWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.cardsWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    },

    openModal() {
        this.modal.classList.add('open');
        document.body.classList.add('modal-open');
    },

    closeModal() {
        this.modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('skillvault-theme', isDark ? 'dark' : 'light');
        this.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        this.showToast(isDark ? '🌙 Dark Mode' : '☀️ Light Mode');
    },

    initTheme() {
        const saved = localStorage.getItem('skillvault-theme');
        if (saved === 'dark') {
            document.documentElement.classList.add('dark-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.classList.remove('dark-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    },

    toggleHistory() {
        this.historyList.classList.toggle('open');
    },

    editName() {
        this.showToast('✏️ Edit name feature coming soon!');
    },

    logout() {
        this.showToast('👋 Logging out...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    },

    handleSearch() {
        const goal = this.goalInput.value.trim();
        if (!goal) {
            this.showToast('⚠️ Please enter your dream job or goal');
            return;
        }
        localStorage.setItem('skillvault-goal', goal);
        this.showToast(`✨ Creating roadmap for: ${goal}`);
        window.location.href = 'roadmap.html'; // Go instantly, no delay!
    },

    handleBuild() {
        this.showToast('🚀 Redirecting to portfolio builder...');
        setTimeout(() => {
            window.location.href = 'portfolio.html';
        }, 1500);
    },

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    },

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.cards.length;
        this.updateCarousel();
    },

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.cards.length) % this.cards.length;
        this.updateCarousel();
    },

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    },

    updateCarousel() {
        this.cards.forEach((card, index) => {
            card.classList.remove('active-card');
            if (index === this.currentSlide) {
                card.classList.add('active-card');
            }
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            }
        });

        const cardWidth = this.cards[0].offsetWidth + 32;
        const scrollPosition = cardWidth * this.currentSlide;
        this.cardsWrapper.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    },

    showToast(msg) {
        this.toast.textContent = msg;
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
