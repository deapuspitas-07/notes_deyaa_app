/* =========================================
   MY MELODY NOTES APP 🎀
========================================= */


/* =========================
   DATA
========================= */

let catatan = JSON.parse(
    localStorage.getItem("catatan")
) || [];


let modeEdit = false;

let idEdit = null;


/* =========================
   SIMPAN CATATAN
========================= */

function simpanCatatan() {

    const judul =
        document
            .getElementById("judul")
            .value
            .trim();


    const isi =
        document
            .getElementById("isi")
            .value
            .trim();


    if (judul === "" || isi === "") {

        alert(
            "Judul dan isi catatan harus diisi! 🎀"
        );

        return;
    }


    /* =========================
       EDIT
    ========================= */

    if (modeEdit) {

        catatan = catatan.map(function(data) {

            if (data.id === idEdit) {

                return {

                    ...data,

                    judul: judul,

                    isi: isi,

                    tanggal:
                        new Date()
                            .toLocaleString(
                                "id-ID"
                            )

                };

            }


            return data;

        });


        alert(
            "Catatan berhasil diperbarui! 💗"
        );

    }


    /* =========================
       TAMBAH BARU
    ========================= */

    else {

        const data = {

            id: Date.now(),

            judul: judul,

            isi: isi,

            tanggal:
                new Date()
                    .toLocaleString(
                        "id-ID"
                    )

        };


        catatan.push(data);

    }


    /* SIMPAN */

    localStorage.setItem(
        "catatan",
        JSON.stringify(catatan)
    );


    resetForm();

    tampilkanCatatan();

}


/* =========================
   TAMPILKAN CATATAN
========================= */

function tampilkanCatatan(
    dataTampil = catatan
) {

    const daftar =
        document
            .getElementById(
                "daftarCatatan"
            );


    daftar.innerHTML = "";


    /* JUMLAH CATATAN */

    document
        .getElementById(
            "jumlahCatatan"
        )
        .textContent =
        catatan.length +
        " Catatan";


    /* KOSONG */

    if (dataTampil.length === 0) {

        daftar.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🐰🎀
                </div>

                <h3>
                    Belum ada catatan
                </h3>

                <p>
                    Yuk buat catatan pertamamu 💗
                </p>

            </div>

        `;

        return;
    }


    /* LOOP DATA */

    dataTampil.forEach(function(data) {

        daftar.innerHTML += `

            <article class="catatan">

                <h3>
                    ${escapeHTML(data.judul)}
                </h3>


                <p>
                    ${escapeHTML(data.isi)}
                </p>


                <div class="tanggal">

                    📅
                    ${data.tanggal || "-"}

                </div>


                <div class="aksi">

                    <button
                        class="edit"
                        onclick="editCatatan(${data.id})">

                        ✏️ Edit

                    </button>


                    <button
                        class="hapus"
                        onclick="hapusCatatan(${data.id})">

                        🗑️ Hapus

                    </button>

                </div>

            </article>

        `;

    });

}


/* =========================
   EDIT CATATAN
========================= */

function editCatatan(id) {

    const data =
        catatan.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!data) {

        return;
    }


    document
        .getElementById("judul")
        .value =
        data.judul;


    document
        .getElementById("isi")
        .value =
        data.isi;


    modeEdit = true;

    idEdit = id;


    /* UBAH JUDUL */

    document
        .getElementById("formTitle")
        .textContent =
        "✏️ Edit Catatan";


    /* UBAH TOMBOL */

    document
        .getElementById("btnSimpan")
        .textContent =
        "🔄 Update Catatan";


    /* TAMPILKAN BATAL */

    document
        .getElementById("btnBatal")
        .style.display =
        "block";


    /* SCROLL KE FORM */

    document
        .querySelector(".form-card")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =========================
   BATAL EDIT
========================= */

function batalEdit() {

    modeEdit = false;

    idEdit = null;


    resetForm();

}


/* =========================
   HAPUS
========================= */

function hapusCatatan(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus catatan ini? 🥺"
        );


    if (!yakin) {

        return;
    }


    catatan =
        catatan.filter(
            function(data) {

                return data.id !== id;

            }
        );


    localStorage.setItem(
        "catatan",
        JSON.stringify(catatan)
    );


    tampilkanCatatan();

}


/* =========================
   SEARCH
========================= */

function cariCatatan() {

    const keyword =
        document
            .getElementById("search")
            .value
            .toLowerCase()
            .trim();


    const hasil =
        catatan.filter(
            function(data) {

                return (

                    data.judul
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    data.isi
                        .toLowerCase()
                        .includes(keyword)

                );

            }
        );


    tampilkanCatatan(hasil);

}


/* =========================
   RESET FORM
========================= */

function resetForm() {

    document
        .getElementById("judul")
        .value = "";


    document
        .getElementById("isi")
        .value = "";


    document
        .getElementById("formTitle")
        .textContent =
        "✨ Buat Catatan";


    document
        .getElementById("btnSimpan")
        .textContent =
        "💾 Simpan Catatan";


    document
        .getElementById("btnBatal")
        .style.display =
        "none";


    modeEdit = false;

    idEdit = null;

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================
   LOAD DATA
========================= */

tampilkanCatatan();


/* =========================
   SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register(
            "service-worker.js"
        )

        .then(function() {

            console.log(
                "Service Worker berhasil dijalankan"
            );

        })

        .catch(function(error) {

            console.log(
                "Service Worker gagal:",
                error
            );

        });

}
