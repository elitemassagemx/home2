document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://githubusercontent.com/elitemassagemx/Home/main/ICONOS/";
    let services = {};

    function handleImageError(img, fallbackUrl) {
        img.onerror = null; // Previene bucles infinitos
        img.src = fallbackUrl || `${BASE_URL}fallback-image.jpg`;
        console.warn(`Failed to load image: ${img.src}`);
    }

    function loadImage(url, fallbackUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Failed to load image: ${url}`);
                img.src = fallbackUrl || `${BASE_URL}https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/`;
                resolve(img);
            };
            img.src = url;
        });
    }

    // Cargar los datos del JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            services = data.services;
            renderServices('individual');
            renderPackages();
        })
        .catch(error => console.error('Error loading the JSON file:', error));

    function renderServices(category) {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) {
            console.error('Element with id "services-list" not found');
            return;
        }
        servicesList.innerHTML = '';
        const template = document.getElementById('service-template');
        if (!template) {
            console.error('Element with id "service-template" not found');
            return;
        }

        services[category].forEach(service => {
            const serviceElement = template.content.cloneNode(true);
            
            serviceElement.querySelector('.service-title').textContent = service.title;
            
            const serviceIcon = serviceElement.querySelector('.service-icon');
            loadImage(service.icon, `${BASE_URL}fallback-icon.png`)
                .then(img => serviceIcon.src = img.src);
            
            serviceElement.querySelector('.service-description').textContent = service.description;
            
            const benefitsIcon = serviceElement.querySelector('.benefits-icon');
            const benefitsIconSrc = Array.isArray(service.benefitsIcons) ? service.benefitsIcons[0] : service.benefitsIcons;
            loadImage(benefitsIconSrc, `${BASE_URL}fallback-icon.png`)
                .then(img => benefitsIcon.src = img.src);
            
            serviceElement.querySelector('.service-benefits').textContent = service.benefits.join(', ');
            
            const durationIcon = serviceElement.querySelector('.duration-icon');
            loadImage(service.durationIcon, `${BASE_URL}fallback-icon.png`)
                .then(img => durationIcon.src = img.src);
            
            serviceElement.querySelector('.service-duration').textContent = service.duration;

            const reserveButton = serviceElement.querySelector('.reserve-button');
            reserveButton.addEventListener('click', () => sendWhatsAppMessage('Reservar', service.title));

            const infoButton = serviceElement.querySelector('.info-button');
            infoButton.addEventListener('click', () => showPopup(service));

            servicesList.appendChild(serviceElement);
        });
    }

    function renderPackages() {
        const packageList = document.getElementById('package-list');
        if (!packageList) {
            console.error('Element with id "package-list" not found');
            return;
        }
        packageList.innerHTML = '';
        services.paquetes.forEach(pkg => {
            const packageElement = document.createElement('div');
            packageElement.className = 'package-item';
            packageElement.innerHTML = `
                <h3>${pkg.title}</h3>
                <p>${pkg.description}</p>
                <p><strong>Incluye:</strong> ${pkg.includes.join(', ')}</p>
                <p><strong>Duración:</strong> ${pkg.duration}</p>
                <p><strong>Beneficios:</strong> ${pkg.benefits.join(', ')}</p>
                <button class="reserve-button">Reservar</button>
                <button class="info-button">Saber más</button>
            `;

            packageElement.querySelector('.reserve-button').addEventListener('click', () => sendWhatsAppMessage('Reservar', pkg.title));
            packageElement.querySelector('.info-button').addEventListener('click', () => showPopup(pkg));

            packageList.appendChild(packageElement);
        });
    }

    function showPopup(data) {
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupImage = document.getElementById('popup-image');
        const popupDescription = document.getElementById('popup-description');

        popupTitle.textContent = data.title || '';
        loadImage(data.popupImage || data.image, `${BASE_URL}fallback-image.jpg`)
            .then(img => {
                popupImage.src = img.src;
                popupImage.alt = data.title || '';
            });
        popupDescription.textContent = data.popupDescription || data.description || '';

        popup.style.display = 'block';
    }

    function sendWhatsAppMessage(action, serviceTitle) {
        const message = encodeURIComponent(`Hola! Quiero ${action} un ${serviceTitle}`);
        const url = `https://wa.me/5215640020305?text=${message}`;
        window.open(url, '_blank');
    }

    function changeLanguage(lang) {
        var selectField = document.querySelector('.goog-te-combo');
        if (selectField) {
            selectField.value = lang;
            selectField.dispatchEvent(new Event('change'));
        }
    }

    const translateIcon = document.getElementById('translate-icon');
    const languageOptions = document.querySelector('.language-options');

    translateIcon.addEventListener('click', () => {
        languageOptions.style.display = languageOptions.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (event) => {
            const lang = event.currentTarget.dataset.lang;
            changeLanguage(lang);
            languageOptions.style.display = 'none';
        });
    });

    document.addEventListener('click', (event) => {
        if (!translateIcon.contains(event.target) && !languageOptions.contains(event.target)) {
            languageOptions.style.display = 'none';
        }
    });

    document.querySelectorAll('.choice-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderServices(chip.dataset.category);
        });
    });

    const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close');

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
