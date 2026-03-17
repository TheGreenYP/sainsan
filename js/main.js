/**
         * Основной модуль приложения
         * Управляет отображением товаров, фильтрацией и модальными окнами
         */

        // DOM элементы
        const productsGrid = document.getElementById('productsGrid');
        const categoryButtons = document.querySelectorAll('.category-btn');
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById('modal');
        const modalClose = document.getElementById('modalClose');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');

        // Текущая выбранная категория
        let currentCategory = 'all';

        /**
         * Создаёт HTML-разметку карточки товара
         * @param {Object} product - объект товара
         * @returns {string} HTML-строка карточки
         */
        function createProductCard(product) {
            return `
                <article class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="placeholder-icon" style="display:none;">📦</div>
                        <span class="product-category-tag">${product.categoryName}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">${product.price}</span>
                            <button class="btn-details" onclick="openModal(${product.id})">
                                Подробнее
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }

        /**
         * Отображает товары на странице
         * @param {string} category - категория для фильтрации ('all' для всех)
         */
        function renderProducts(category = 'all') {
            // Фильтруем товары по категории
            const filteredProducts = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);

            // Если товаров нет, показываем сообщение
            if (filteredProducts.length === 0) {
                productsGrid.innerHTML = `
                    <div class="no-products">
                        <div class="no-products-icon">🔍</div>
                        <p>Товары в данной категории не найдены</p>
                    </div>
                `;
                return;
            }

            // Генерируем HTML для всех карточек
            productsGrid.innerHTML = filteredProducts.map(createProductCard).join('');
        }

        /**
         * Открывает модальное окно с информацией о товаре
         * @param {number} productId - ID товара
         */
        function openModal(productId) {
            // Находим товар по ID
            const product = products.find(p => p.id === productId);
            
            if (!product) return;

            // Заполняем модальное окно данными
            document.getElementById('modalImage').innerHTML = `
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.style.display='none';">
            `;
            document.getElementById('modalCategory').textContent = product.categoryName;
            document.getElementById('modalTitle').textContent = product.name;
            document.getElementById('modalPrice').textContent = product.price;
            document.getElementById('modalDescription').textContent = product.fullDescription;

            // Генерируем список характеристик
            const specsHTML = Object.entries(product.specs)
                .map(([key, value]) => `
                    <div class="spec-item">
                        <span class="spec-label">${key}</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `)
                .join('');
            
            document.getElementById('modalSpecs').innerHTML = specsHTML;

            // Показываем модальное окно
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Закрывает модальное окно
         */
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        /**
         * Обработчик переключения категорий
         */
        function handleCategoryClick(e) {
            if (!e.target.classList.contains('category-btn')) return;

            // Обновляем активную кнопку
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Обновляем текущую категорию и перерисовываем товары
            currentCategory = e.target.dataset.category;
            renderProducts(currentCategory);
        }

        /**
         * Обработчик мобильного меню
         */
        function toggleMobileMenu() {
            mainNav.classList.toggle('active');
        }

        // ========================================
        // ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ
        // ========================================

        // Инициализация - отображаем все товары при загрузке
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts('all');
        });

        // Обработчики для категорий
        document.querySelector('.categories').addEventListener('click', handleCategoryClick);

        // Обработчики для модального окна
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Мобильное меню
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Обработчики для ссылок в футере
        document.querySelectorAll('footer a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                
                // Скроллим к категориям
                document.getElementById('categories').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
                // Переключаем категорию
                categoryButtons.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.category === category);
                });
                renderProducts(category);
            });
        });