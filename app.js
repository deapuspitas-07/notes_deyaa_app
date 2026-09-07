let catatan = JSON.parse(
    localStorage.getItem("catatan")
) || [];

let modeEdit = false;
let idEdit = null;


/* =========================
   SIMPAN / UPDATE CATATAN
========================= */

function simpanCatatan() {

    let judul =
        document.getElementById("judul").value.trim();

    let isi =
        document.getElementById("isi").value.trim();


    if (judul === "" || isi === "") {

        alert("Judul dan isi catatan harus diisi!");

        return;
    }


    /* MODE EDIT */

    if (modeEdit) {

        catatan = catatan.map(function(data) {

            if (data.id === idEdit) {

                return {
                    ...data,
                    judul: judul,
                    isi: isi,
                    tanggal: new Date().toLocaleString("id-ID")
                };

            }

            return data;

        });


        modeEdit = false;
        idEdit = null;


        document.getElementById("btnSimpan")
            .innerHTML = "💾 Simpan Catatan";

        document.getElementById("btnBatal")
            .style.display = "none";

        document.getElementById("formTitle")
            .innerHTML = "✨ Buat Catatan";


        alert("Catatan berhasil diperbarui!");

    }


    /* MODE TAMBAH */

    else {

        let data = {

            id: Date.now(),

            judul: judul,

            isi: isi,

            tanggal: new Date().toLocaleString("id-ID")

        };


        catatan.push(data);

    }


    localStorage.setItem(
        "catatan",
        JSON.stringify(catatan)
    );


    kosongkanForm();

    tampilkanCatatan();
}


/* =========================
   TAMPILKAN CATATAN
========================= */

function tampilkanCatatan(
    dataTampil = catatan
) {

    let daftar =
        document.getElementById("daftarCatatan");


    daftar.innerHTML = "";


    document.getElementById("jumlahCatatan")
        .innerHTML =
        catatan.length + " Catatan";


    if (dataTampil.length === 0) {

        daftar.innerHTML = `
            <div class="empty">
                <div style="font-size:40px;">
                    📝
                </div>

                <h3>
                    Belum ada catatan
                </h3>

                <p>
                    Yuk buat catatan pertamamu!
                </p>
            </div>
        `;

        return;
    }


    dataTampil.forEach(function(data) {

        daftar.innerHTML += `

            <div class="catatan">

                <h3>
                    ${escapeHTML(data.judul)}
                </h3>

                <p>
                    ${escapeHTML(data.isi)}
                </p>

                <div class="tanggal">
                    📅 ${data.tanggal || "-"}
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

            </div>

        `;

    });
}


/* =========================
   EDIT CATATAN
========================= */

function editCatatan(id) {

    let data =
        catatan.find(function(item) {

            return item.id === id;

        });


    if (!data) {
        return;
    }


    document.getElementById("judul").value =
        data.judul;

    document.getElementById("isi").value =
        data.isi;


    modeEdit = true;

    idEdit = id;


    document.getElementById("formTitle")
        .innerHTML =
        "✏️ Edit Catatan";


    document.getElementById("btnSimpan")
        .innerHTML =
        "🔄 Update Catatan";


    document.getElementById("btnBatal")
        .style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   BATAL EDIT
========================= */

function batalEdit() {

    modeEdit = false;

    idEdit = null;


    kosongkanForm();


    document.getElementById("formTitle")
        .innerHTML =
        "✨ Buat Catatan";


    document.getElementById("btnSimpan")
        .innerHTML =
        "💾 Simpan Catatan";


    document.getElementById("btnBatal")
        .style.display =
        "none";

}


/* =========================
   HAPUS CATATAN
========================= */

function hapusCatatan(id) {

    let yakin = confirm(
        "Apakah kamu yakin ingin menghapus catatan ini?"
    );


    if (!yakin) {
        return;
    }


    catatan = catatan.filter(
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
   CARI CATATAN
========================= */

function cariCatatan() {

    let keyword =
        document.getElementById("search")
            .value
            .toLowerCase();


    let hasil = catatan.filter(
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
   KOSONGKAN FORM
========================= */

function kosongkanForm() {

    document.getElementById("judul")
        .value = "";

    document.getElementById("isi")
        .value = "";

}


/* =========================
   KEAMANAN HTML
========================= */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   TAMPILKAN SAAT DIBUKA
========================= */

tampilkanCatatan();


/* =========================
   SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("service-worker.js")

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