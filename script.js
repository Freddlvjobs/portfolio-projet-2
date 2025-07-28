/**
 * ==========================================================================
 *                          SCRIPT POUR HARMONIE HOLISTIQUE
 * ==========================================================================
 * 
 * Ce fichier gère toutes les interactions dynamiques du site.
 * 
 * Table des matières du script :
 * 1.  Exécution au chargement du DOM : Assure que le script s'exécute une fois la page prête.
 * 2.  Gestion du Header collant (Sticky Header) : Change l'apparence du header au défilement.
 * 3.  Gestion du Menu Mobile (Hamburger) : Ouvre et ferme le menu sur les petits écrans.
 * 4.  Carrousel de Témoignages : Fait défiler les témoignages des clients.
 * 5.  Animations au défilement (Scroll Reveal) : Fait apparaître les sections élégamment.
 * 6.  Accordéon pour la FAQ : Affiche/cache les réponses aux questions.
 * 7.  Validation du Formulaire de Contact : Vérifie les champs avant envoi.
 * 8.  Gestion du bouton "Retour en Haut" : Affiche le bouton après un certain défilement.
 * 9.  Gestion des liens de navigation fluides : Assure une navigation douce vers les ancres.
 * 
 * Chaque section est commentée pour expliquer sa logique et son fonctionnement.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. GESTION DU HEADER COLLANT (STICKY HEADER)
    // --------------------------------------------------------------------------
    // Cette fonction ajoute une classe 'scrolled' au header lorsque l'utilisateur
    // fait défiler la page de plus de 50 pixels. Cette classe est utilisée en CSS
    // pour appliquer un fond et une ombre, améliorant la visibilité du header.
    const header = document.getElementById('header');
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll);
        // Exécute une fois au chargement pour le cas où la page est rechargée en cours de scroll
        handleHeaderScroll(); 
    }


    // --------------------------------------------------------------------------
    // 2. GESTION DU MENU MOBILE (HAMBURGER)
    // --------------------------------------------------------------------------
    // Gère l'ouverture et la fermeture du menu de navigation sur mobile.
    // L'icône hamburger bascule l'affichage du menu.
    // On bloque également le scroll du body lorsque le menu est ouvert.
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const mobileMenuLinks = mobileMenuContainer ? mobileMenuContainer.querySelectorAll('a') : [];

    if (hamburgerMenu && mobileMenuContainer) {
        const toggleMenu = () => {
            mobileMenuContainer.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        };

        hamburgerMenu.addEventListener('click', toggleMenu);
        closeMobileMenuBtn.addEventListener('click', toggleMenu);

        // Ferme le menu quand un lien est cliqué (pour naviguer vers une ancre)
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenuContainer.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }


    // --------------------------------------------------------------------------
    // 3. CARROUSEL DE TÉMOIGNAGES
    // --------------------------------------------------------------------------
    // Crée un carrousel fonctionnel pour la section des témoignages.
    // Gère le défilement des slides avec les boutons "précédent" et "suivant",
    // ainsi que les indicateurs (dots) en bas.
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const track = slider.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next-btn');
        const prevButton = slider.querySelector('.prev-btn');
        const dotsNav = slider.querySelector('.slider-dots');

        const slideWidth = slides[0].getBoundingClientRect().width;

        // Créer les indicateurs (dots)
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if(index === 0) dot.classList.add('active');
            dot.addEventListener('click', e => {
                moveToSlide(index);
            });
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            
            // Mettre à jour la classe 'active' sur le dot
            dots[currentIndex].classList.remove('active');
            dots[targetIndex].classList.add('active');

            currentIndex = targetIndex;
        };

        // Clic sur le bouton "suivant"
        nextButton.addEventListener('click', e => {
            let nextIndex = currentIndex + 1;
            if (nextIndex > slides.length - 1) {
                nextIndex = 0; // Retour au début
            }
            moveToSlide(nextIndex);
        });

        // Clic sur le bouton "précédent"
        prevButton.addEventListener('click', e => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1; // Aller à la fin
            }
            moveToSlide(prevIndex);
        });

        // Recalculer la largeur au redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none'; // Désactiver la transition pour un redimensionnement fluide
            track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
            setTimeout(() => {
                track.style.transition = ''; // Réactiver la transition
            }, 50);
        });
    }

    // --------------------------------------------------------------------------
    // 4. ANIMATIONS AU DÉFILEMENT (SCROLL REVEAL)
    // --------------------------------------------------------------------------
    // Utilise l'API IntersectionObserver pour une performance optimale.
    // Ajoute la classe 'visible' aux éléments avec la classe 'scroll-reveal'
    // lorsqu'ils entrent dans la fenêtre d'affichage (viewport).
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionnel : arrêter d'observer l'élément une fois qu'il est visible
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1 // L'élément est considéré comme visible à 10%
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // --------------------------------------------------------------------------
    // 5. ACCORDÉON POUR LA FAQ
    // --------------------------------------------------------------------------
    // Permet d'ouvrir et de fermer les réponses de la FAQ en cliquant sur les questions.
    // Un seul item peut être ouvert à la fois pour une meilleure lisibilité.
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Fermer tous les autres items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                
                // Ouvrir ou fermer l'item cliqué
                if (!isOpen) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }


    // --------------------------------------------------------------------------
    // 6. VALIDATION DU FORMULAIRE DE CONTACT
    // --------------------------------------------------------------------------
    // Empêche l'envoi du formulaire si les champs ne sont pas remplis
    // correctement et affiche des messages d'erreur clairs.
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche l'envoi réel du formulaire

            // Récupération des champs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            let isValid = true;

            // Fonction pour afficher une erreur
            const showError = (input, message) => {
                const formGroup = input.parentElement;
                formGroup.classList.add('error');
                const errorDisplay = formGroup.querySelector('.error-message');
                errorDisplay.innerText = message;
                isValid = false;
            };

            // Fonction pour effacer les erreurs
            const clearError = (input) => {
                const formGroup = input.parentElement;
                formGroup.classList.remove('error');
                const errorDisplay = formGroup.querySelector('.error-message');
                errorDisplay.innerText = '';
            };

            // Réinitialisation des erreurs
            [name, email, subject, message].forEach(clearError);

            // Validation des champs
            if (name.value.trim() === '') {
                showError(name, 'Veuillez entrer votre nom complet.');
            }
            if (email.value.trim() === '') {
                showError(email, 'Veuillez entrer votre adresse email.');
            } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
                showError(email, 'Veuillez entrer une adresse email valide.');
            }
            if (subject.value.trim() === '') {
                showError(subject, 'Veuillez entrer un sujet.');
            }
            if (message.value.trim() === '') {
                showError(message, 'Veuillez écrire votre message.');
            }

            // Si tout est valide
            if (isValid) {
                // Ici, vous pourriez envoyer les données à un serveur avec fetch()
                // Pour la démo, on simule un succès.
                console.log('Formulaire valide, simulation d\'envoi...');
                console.log({
                    name: name.value,
                    email: email.value,
                    subject: subject.value,
                    message: message.value
                });

                formFeedback.className = 'success';
                formFeedback.textContent = 'Merci ! Votre message a bien été envoyé. Je vous répondrai dans les plus brefs délais.';
                contactForm.reset();
            } else {
                formFeedback.className = 'error';
                formFeedback.textContent = 'Oups ! Il y a des erreurs dans le formulaire. Veuillez vérifier les champs en rouge.';
            }
        });
    }


    // --------------------------------------------------------------------------
    // 7. GESTION DU BOUTON "RETOUR EN HAUT"
    // --------------------------------------------------------------------------
    // Affiche un bouton qui permet de remonter en haut de la page de manière fluide.
    // Le bouton n'apparaît que si l'utilisateur a fait défiler une certaine distance.
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Le scroll fluide est géré par `scroll-behavior: smooth;` en CSS,
        // donc un simple lien vers '#' suffit dans le HTML.
    }


    // --------------------------------------------------------------------------
    // 8. GESTION DES LIENS DE NAVIGATION FLUIDES (Fallback)
    // --------------------------------------------------------------------------
    // Bien que le CSS 'scroll-behavior: smooth' gère cela nativement sur les
    // navigateurs modernes, ce code assure la compatibilité ou un contrôle plus fin.
    // Il gère aussi la fermeture du menu mobile lors d'un clic sur un lien.
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // S'assurer que le lien est une ancre sur la page actuelle
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                const headerOffset = document.getElementById('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fermer le menu mobile si ouvert
                if (mobileMenuContainer && mobileMenuContainer.classList.contains('open')) {
                    mobileMenuContainer.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

}); // Fin de l'événement DOMContentLoaded
