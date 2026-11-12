document.addEventListener("DOMContentLoaded", function () {

    var root = document.documentElement;
    var tombolTema = document.getElementById("theme-toggle");

    var tersimpan = localStorage.getItem("tema");
    var tema = tersimpan || "light";

    function terapkanTema(nama) {
        root.setAttribute("data-theme", nama);
        localStorage.setItem("tema", nama);
        if (tombolTema) {
            tombolTema.textContent = nama === "dark" ? "☀️ Terang" : "🌙 Gelap";
        }
    }

    terapkanTema(tema);

    if (tombolTema) {
        tombolTema.addEventListener("click", function () {
            var sekarang = root.getAttribute("data-theme");
            terapkanTema(sekarang === "dark" ? "light" : "dark");
        });
    }

    var sapa = document.querySelector(".hero-sapa");
    if (sapa) {
        var jam = new Date().getHours();
        var waktu = "Halo";
        if (jam >= 4 && jam < 11) waktu = "Selamat pagi";
        else if (jam >= 11 && jam < 15) waktu = "Selamat siang";
        else if (jam >= 15 && jam < 19) waktu = "Selamat sore";
        else waktu = "Selamat malam";
        sapa.textContent = waktu + ", saya";
    }

    var role = document.querySelector(".hero-role");
    if (role) {
        var teks = role.textContent.trim();
        var i = 0;
        role.textContent = "";
        role.classList.add("cursor");

        var ketik = setInterval(function () {
            role.textContent = teks.slice(0, ++i);
            if (i >= teks.length) {
                clearInterval(ketik);
                setTimeout(function () {
                    role.classList.remove("cursor");
                }, 1500);
            }
        }, 45);
    }

    var elemen = document.querySelectorAll(".card, .timeline li, .block h2");

    if ("IntersectionObserver" in window) {
        var pengamat = new IntersectionObserver(function (daftar) {
            daftar.forEach(function (item) {
                if (item.isIntersecting) {
                    item.target.classList.add("show");
                    pengamat.unobserve(item.target);
                }
            });
        }, { threshold: 0.12 });

        elemen.forEach(function (el) {
            el.classList.add("reveal");
            pengamat.observe(el);
        });
    }

    var keAtas = document.createElement("button");
    keAtas.className = "to-top";
    keAtas.type = "button";
    keAtas.setAttribute("aria-label", "Kembali ke atas");
    keAtas.textContent = "↑";
    document.body.appendChild(keAtas);

    window.addEventListener("scroll", function () {
        keAtas.classList.toggle("show", window.scrollY > 300);
    });

    keAtas.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    var form = document.querySelector("form");
    if (form) {
        var nama = document.getElementById("nama");
        var email = document.getElementById("email");
        var pesan = document.getElementById("pesan");
        var tanggal = document.getElementById("tanggal");

        if (tanggal) {
            tanggal.min = new Date().toISOString().split("T")[0];
        }

        var MAKS = 300;
        var hitung = document.createElement("small");
        hitung.className = "counter";
        pesan.maxLength = MAKS;
        pesan.insertAdjacentElement("afterend", hitung);

        function updateHitung() {
            hitung.textContent = pesan.value.length + " / " + MAKS + " karakter";
        }
        pesan.addEventListener("input", updateHitung);
        updateHitung();


        var kotak = document.createElement("p");
        kotak.className = "form-msg";
        kotak.hidden = true;
        form.insertAdjacentElement("afterbegin", kotak);

        function tampilPesan(isi, jenis) {
            kotak.textContent = isi;
            kotak.className = "form-msg " + jenis;
            kotak.hidden = false;
            kotak.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        [nama, email, pesan].forEach(function (el) {
            el.addEventListener("input", function () {
                el.classList.remove("invalid");
            });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault(); 

            var salah = [];

            if (nama.value.trim().length < 3) {
                nama.classList.add("invalid");
                salah.push("Nama minimal 3 karakter");
            }

            var polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!polaEmail.test(email.value.trim())) {
                email.classList.add("invalid");
                salah.push("Format email tidak valid");
            }

            if (!form.querySelector('input[name="keperluan"]:checked')) {
                salah.push("Pilih salah satu keperluan");
            }

            if (pesan.value.trim().length < 10) {
                pesan.classList.add("invalid");
                salah.push("Pesan minimal 10 karakter");
            }

            if (salah.length > 0) {
                tampilPesan("⚠️ " + salah.join(" • "), "error");
                return;
            }

            tampilPesan("✅ Terima kasih, " + nama.value.trim() + "! Pesanmu sudah terkirim.", "ok");
            form.reset();
            updateHitung();
        });
    }

});
