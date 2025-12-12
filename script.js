// Database de Games
const gamesDatabase = [
    {
        id: 1,
        name: 'Cyberpunk 2077',
        category: 'action',
        rating: 4.5,
        icon: '🎮'
    },
    {
        id: 2,
        name: 'Elden Ring',
        category: 'action',
        rating: 4.8,
        icon: '⚔️'
    },
    {
        id: 3,
        name: 'Baldur\'s Gate 3',
        category: 'rpg',
        rating: 4.9,
        icon: '🐉'
    },
    {
        id: 4,
        name: 'Starfield',
        category: 'rpg',
        rating: 4.4,
        icon: '🚀'
    },
    {
        id: 5,
        name: 'Company of Heroes 3',
        category: 'strategy',
        rating: 4.3,
        icon: '🎖️'
    },
    {
        id: 6,
        name: 'Total War: Warhammer III',
        category: 'strategy',
        rating: 4.6,
        icon: '⚔️'
    },
    {
        id: 7,
        name: 'Street Fighter 6',
        category: 'action',
        rating: 4.7,
        icon: '👊'
    },
    {
        id: 8,
        name: 'Dragon\'s Dogma 2',
        category: 'rpg',
        rating: 4.5,
        icon: '🐲'
    },
    {
        id: 9,
        name: 'Civilization VI',
        category: 'strategy',
        rating: 4.7,
        icon: '🏰'
    },
    {
        id: 10,
        name: 'Final Fantasy XVI',
        category: 'rpg',
        rating: 4.6,
        icon: '✨'
    },
    {
        id: 11,
        name: 'Helldivers 2',
        category: 'action',
        rating: 4.8,
        icon: '💥'
    },
    {
        id: 12,
        name: 'StarCraft III',
        category: 'strategy',
        rating: 4.8,
        icon: '🛸'
    }
];

// Database de Reviews
const reviewsDatabase = [
    {
        id: 1,
        author: 'João Silva',
        game: 'Elden Ring',
        rating: 4.8,
        text: 'Uma obra-prima do gênero souls-like. O level design é impecável e as batalhas são memoráveis. Recomendo fortemente!'
    },
    {
        id: 2,
        author: 'Maria Santos',
        game: 'Baldur\'s Gate 3',
        rating: 4.9,
        text: 'O melhor RPG dos últimos anos. As possibilidades de roleplay são infinitas e o gameplay é extremamente profundo.'
    },
    {
        id: 3,
        author: 'Pedro Costa',
        game: 'Cyberpunk 2077',
        rating: 4.5,
        text: 'Depois das atualizações, o jogo ficou muito bom. A história é envolvente e o mundo é impressionante.'
    },
    {
        id: 4,
        author: 'Ana Oliveira',
        game: 'Starfield',
        rating: 4.4,
        text: 'Um espaço vasto para explorar com muitos segredos. Vale a pena para os fãs de ficção científica.'
    },
    {
        id: 5,
        author: 'Carlos Mendes',
        game: 'Total War: Warhammer III',
        rating: 4.6,
        text: 'Estratégia no mais alto nível. As batalhes em tempo real são épicas e o conteúdo é vasto.'
    },
    {
        id: 6,
        author: 'Elena Rocha',
        game: 'Street Fighter 6',
        rating: 4.7,
        text: 'O retorno do Street Fighter é triunfal. A mecânica de jogo é equilibrada e divertida para todos os níveis.'
    }
];

// Database de Notícias
const newsDatabase = [
    {
        id: 1,
        title: 'Próxima Geração de GPUs Anunciada',
        date: 'Hoje',
        excerpt: 'NVIDIA e AMD revelam suas próximas gerações de GPUs com performance 50% maior...',
        icon: '💻'
    },
    {
        id: 2,
        title: 'GTA VI Consegue 100 Milhões de Pré-vendas',
        date: 'Ontem',
        excerpt: 'O aguardado GTA VI bate recorde de pré-vendas. Lançamento confirmado para próxima primavera...',
        icon: '🚗'
    },
    {
        id: 3,
        title: 'Novo Estúdio Abre em São Paulo',
        date: '2 dias atrás',
        excerpt: 'Estúdio de games nível AAA abre suas portas em São Paulo com 200 desenvolvedores...',
        icon: '🏢'
    },
    {
        id: 4,
        title: 'Torneio Esports com Prêmio de 10 Milhões',
        date: '3 dias atrás',
        excerpt: 'Maior torneio de esports da história é anunciado com prêmio total de 10 milhões de dólares...',
        icon: '🏆'
    },
    {
        id: 5,
        title: 'Metaverse Gaming Cresce 300%',
        date: '4 dias atrás',
        excerpt: 'Games no metaverso crescem 300% este ano. Grandes estúdios investem bilhões no segmento...',
        icon: '🌐'
    },
    {
        id: 6,
        title: 'IA Revoluciona Desenvolvimento de Games',
        date: '5 dias atrás',
        excerpt: 'Inteligência Artificial muda completamente a forma de desenvolver games modernos...',
        icon: '🤖'
    }
];

// Variável para armazenar filtro atual
let currentFilter = 'all';

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    renderGames('all');
    renderReviews();
    renderNews();
    setupHamburgerMenu();
});

// Hamburger Menu
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Renderizar Games
function renderGames(category) {
    currentFilter = category;
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    let filteredGames = gamesDatabase;
    if (category !== 'all') {
        filteredGames = gamesDatabase.filter(game => game.category === category);
    }

    filteredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image">${game.icon}</div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <span class="game-category">${game.category.toUpperCase()}</span>
                <div class="game-rating">
                    ${'⭐'.repeat(Math.floor(game.rating))} ${game.rating}
                </div>
            </div>
        `;
        gamesGrid.appendChild(gameCard);
    });
}

// Função para filtrar games
function filterGames(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderGames(category);
}

// Renderizar Reviews
function renderReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    reviewsGrid.innerHTML = '';

    reviewsDatabase.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-author">${review.author}</div>
                <div class="review-rating">${'⭐'.repeat(Math.floor(review.rating))}</div>
            </div>
            <div class="review-text">"${review.text}"</div>
            <div class="review-game">Sobre: ${review.game}</div>
        `;
        reviewsGrid.appendChild(reviewCard);
    });
}

// Renderizar Notícias
function renderNews() {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '';

    newsDatabase.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-image">${news.icon}</div>
            <div class="news-content">
                <div class="news-date">${news.date}</div>
                <h3>${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="#" class="read-more">Ler mais →</a>
            </div>
        `;
        newsGrid.appendChild(newsCard);
    });
}

// Manipulador de Newsletter
function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    if (email) {
        alert(`✓ Obrigado! Email "${email}" inscrito com sucesso no newsletter!`);
        event.target.reset();
    }
}

// Manipulador de Contato
function handleContact(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    if (name && email && message) {
        alert(`✓ Mensagem enviada com sucesso!\n\nNome: ${name}\nEmail: ${email}\n\nObrigado por entrar em contato!`);
        form.reset();
    }
}

// Efeito de scroll suave para elementos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação de aparição ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.game-card, .review-card, .news-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
