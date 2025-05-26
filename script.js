document.addEventListener('DOMContentLoaded', function() {

    // Smooth scroll untuk link navigasi internal
    document.querySelectorAll('header nav ul li a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight || 70; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                document.querySelectorAll('header nav ul li a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                const navUl = document.querySelector('header nav ul');
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    // Optional: Change hamburger icon back
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (menuToggle) menuToggle.innerHTML = '☰';
                }
            }
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('header nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('header').offsetHeight || 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100; // Adjusted buffer
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
        
        if (pageYOffset < (sections[0]?.offsetTop - headerHeight - 100 || 200) ) {
            navLi.forEach(a => a.classList.remove('active'));
            const homeLink = document.querySelector('header nav ul li a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    });


    // Tombol "Pilih Paket" di pricing card mengisi form
    const selectPackageButtons = document.querySelectorAll('.select-package-button');
    const pilihanPaketSelect = document.getElementById('pilihanPaket');

    if (selectPackageButtons && pilihanPaketSelect) {
        selectPackageButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const packageName = this.getAttribute('data-package');
                for (let i = 0; i < pilihanPaketSelect.options.length; i++) {
                    if (pilihanPaketSelect.options[i].value === packageName) {
                        pilihanPaketSelect.selectedIndex = i;
                        break;
                    }
                }
            });
        });
    }

    // Handle Form Submission
    const orderForm = document.getElementById('videoOrderForm');
    const formMessage = document.getElementById('formMessage');

    if (orderForm && formMessage) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Tetap cegah submit default
        
            const formData = new FormData(orderForm);
            const action = orderForm.getAttribute('action');

            const nama = document.getElementById('nama').value.trim();
            const email = document.getElementById('email').value.trim();
            const telepon = document.getElementById('telepon').value.trim();
            const paket = document.getElementById('pilihanPaket').value;
            const deskripsi = document.getElementById('deskripsi').value.trim();

            if (!nama || !email || !telepon || !paket || !deskripsi) {
                displayFormMessage('Harap isi semua kolom yang wajib diisi.', 'error');
                return;
            }

            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        let errorMessage = 'Terjadi kesalahan saat mengirim formulir.';
                        if (data && data.errors && data.errors.length > 0) {
                            errorMessage = data.errors.map(err => err.message).join(', ');
                        } else if (data && data.error) {
                            errorMessage = data.error;
                        }
                        throw new Error(errorMessage);
                    });
                }
            })
            .then(data => {
                displayFormMessage('Terima kasih! Permintaan Anda telah terkirim. Kami akan segera menghubungi Anda.', 'success');
                orderForm.reset();
                const pilihanPaketSelect = document.getElementById('pilihanPaket');
                if (pilihanPaketSelect) pilihanPaketSelect.selectedIndex = 0;
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                displayFormMessage(`Gagal mengirim: ${error.message || 'Silakan coba lagi.'}`, 'error');
            });
        });
    }

    function displayFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message-feedback';
            formMessage.classList.add(type);
            formMessage.style.display = 'block';

            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.className = 'form-message-feedback';
            }, 7000);
        }
    }

    // Hamburger Menu Toggle untuk Mobile
    const menuToggle = document.querySelector('.menu-toggle') || document.createElement('button'); // Use existing or create
    if (!document.querySelector('.menu-toggle')) { // If it was created, configure and insert
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = '☰'; 
        const navElement = document.querySelector('header nav');
        const navUl = document.querySelector('header nav ul');
        if (navElement && navUl) {
            navElement.insertBefore(menuToggle, navUl); 
        }
    }
    
    const navUl = document.querySelector('header nav ul');
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
            // Optional: Change hamburger icon
            if (navUl.classList.contains('active')) {
                menuToggle.innerHTML = '✕'; // Close icon
            } else {
                menuToggle.innerHTML = '☰'; // Hamburger icon
            }
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                // observer.unobserve(entry.target); // Optional: stop observing after revealed once
            } else {
                 // Optional: To re-trigger animation on scroll up then down again
                 // entry.target.classList.remove('visible');
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // 10% of item is visible
        // rootMargin: "0px 0px -50px 0px" // Optional: trigger a bit earlier/later
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});