document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/";
    let services = {};

    function handleImageError(img) {
        img.onerror = null; // Previene bucles infinitos
        img.style.display = 'none'; // Oculta la imagen si no se puede cargar
        console.warn(`Failed to load image: ${img.src}`);
    }

    function buildImageUrl(iconPath) {
        if (!iconPath) return '';
        return iconPath.replace('${BASE_URL}', BASE_URL);
    }

    // Cargar los datos del JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            services = data.services;
            renderServices('individual');
            renderPackages();
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
            document.getElementById('services-list').innerHTML = '<p>Error al cargar los servicios. Por favor, intente más tarde.</p>';
            document.getElementById('package-list').innerHTML = '<p>Error al cargar los paquetes. Por favor, intente más tarde.</p>';
        });

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
            serviceIcon.src = buildImageUrl(service.icon);
            serviceIcon.onerror = () => handleImageError(serviceIcon);
            
            serviceElement.querySelector('.service-description').textContent = service.description;
            
            const benefitsIcon = serviceElement.querySelector('.benefits-icon');
            benefitsIcon.src = buildImageUrl(Array.isArray(service.benefitsIcons) ? service.benefitsIcons[0] : service.benefitsIcons);
            benefitsIcon.onerror = () => handleImageError(benefitsIcon);
            
            serviceElement.querySelector('.service-benefits').textContent = service.benefits.join(', ');
            
            const durationIcon = serviceElement.querySelector('.duration-icon');
            durationIcon.src = buildImageUrl(service.durationIcon);
            durationIcon.onerror = () => handleImageError(durationIcon);
            
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
        popupImage.src = buildImageUrl(data.popupImage || data.image);
        popupImage.alt = data.title || '';
        popupImage.onerror = () => handleImageError(popupImage);
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

    // Código para la animación de la galería
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const gallery = document.querySelector('.gallery-container');
        if (gallery) {
            ScrollTrigger.create({
                trigger: gallery,
                start: "top 80%",
                onEnter: () => gallery.classList.add('is-visible'),
                onLeaveBack: () => gallery.classList.remove('is-visible')
            });

            gsap.utils.toArray('.gallery-container img').forEach(img => {
                gsap.from(img, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: img,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            });
        }
    } else {
        console.warn('GSAP or ScrollTrigger not loaded. Gallery animations will not work.');
    }
    // Function to handle image loading errors
function handleImageError(img) {
    console.error(`Failed to load image: ${img.src}`);
    img.src = 'https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/fallback-image.png';
    img.alt = 'Image not available';
}

// Add error handling to all images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

// Asynchronous function to initialize Google Translate
async function initGoogleTranslate() {
    try {
        await new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && typeof google.translate !== 'undefined') {
                new google.translate.TranslateElement({pageLanguage: 'es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
                resolve();
            } else {
                reject(new Error('Google Translate not loaded'));
            }
        });
    } catch (error) {
        console.error('Error initializing Google Translate:', error);
    }
}

// Initialize Google Translate when the script is loaded
if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initGoogleTranslate();
} else {
    document.addEventListener('DOMContentLoaded', initGoogleTranslate);
}

// Add any other custom JavaScript functionality here
});
