document.addEventListener('DOMContentLoaded', function() {

    // Smooth scroll untuk link navigasi internal
    document.querySelectorAll('header nav ul li a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Kalkulasi offset header
                const headerOffset = document.querySelector('header').offsetHeight || 70; // fallback jika header tidak ditemukan
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update kelas 'active' di navigasi
                document.querySelectorAll('header nav ul li a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Tutup menu mobile jika terbuka
                const navUl = document.querySelector('header nav ul');
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
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
            const sectionTop = section.offsetTop - headerHeight - 50; // -50 untuk buffer
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
        // Jika di paling atas, aktifkan link Beranda
        if (pageYOffset < (sections[0]?.offsetTop - headerHeight - 50 || 200) ) {
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
                // e.preventDefault(); // Dihapus karena href sudah ke #order-form
                const packageName = this.getAttribute('data-package');
                for (let i = 0; i < pilihanPaketSelect.options.length; i++) {
                    if (pilihanPaketSelect.options[i].value === packageName) {
                        pilihanPaketSelect.selectedIndex = i;
                        break;
                    }
                }
                // Scroll ke form tidak diperlukan lagi karena href sudah benar
            });
        });
    }

    // Handle Form Submission
    const orderForm = document.getElementById('videoOrderForm');
    const formMessage = document.getElementById('formMessage');

    if (orderForm && formMessage) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah submit standar

            const nama = document.getElementById('nama').value.trim();
            const email = document.getElementById('email').value.trim();
            const telepon = document.getElementById('telepon').value.trim();
            const paket = document.getElementById('pilihanPaket').value;
            const deskripsi = document.getElementById('deskripsi').value.trim();

            if (!nama || !email || !telepon || !paket || !deskripsi) {
                displayFormMessage('Harap isi semua kolom yang wajib diisi.', 'error');
                return;
            }
            
            // Di sini Anda akan mengirim data ke backend atau layanan email
            // Untuk demo, kita hanya tampilkan di console dan beri pesan sukses
            console.log("Formulir Terkirim:");
            console.log("Nama:", nama);
            console.log("Email:", email);
            console.log("Telepon:", telepon);
            console.log("Paket:", paket);
            console.log("Jenis Video:", document.getElementById('jenisVideo').value.trim());
            console.log("Estimasi Durasi:", document.getElementById('durasiEstimasi').value.trim());
            console.log("Link Materi:", document.getElementById('linkMateri').value.trim());
            console.log("Deskripsi:", deskripsi);

            displayFormMessage('Terima kasih! Permintaan Anda telah terkirim. Kami akan segera menghubungi Anda.', 'success');
            orderForm.reset(); // Kosongkan form
            if (pilihanPaketSelect) pilihanPaketSelect.selectedIndex = 0; // Reset pilihan paket

            // Scroll ke atas untuk melihat pesan (opsional)
            // orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function displayFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message-feedback'; // Reset class
            formMessage.classList.add(type); // 'success' or 'error'
            
            setTimeout(() => {
                formMessage.className = 'form-message-feedback'; // Sembunyikan lagi
            }, 7000); // Pesan akan hilang setelah 7 detik
        }
    }

    // Hamburger Menu Toggle untuk Mobile
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '☰'; // Kode HTML untuk ikon hamburger
    const navElement = document.querySelector('header nav');
    const navUl = document.querySelector('header nav ul');

    if (navElement && navUl) {
        navElement.insertBefore(menuToggle, navUl); // Sisipkan tombol sebelum ul

        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('active');
        });
    }

});