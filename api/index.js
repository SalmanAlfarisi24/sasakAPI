const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/cari', (req, res) => {
    // Membaca file kamus.json dari folder root luar menggunakan path absolute
    const filePath = path.join(process.cwd(), 'kamus.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Gagal membaca database." });
        }
        
        const daftarKamus = JSON.parse(data);
        const queryKata = req.query.kata;

        if (queryKata) {
            const hasilFilter = daftarKamus.filter(item => 
                (item.bahasa_sasak && item.bahasa_sasak.toLowerCase().includes(queryKata.toLowerCase())) ||
                (item.bahasa_indonesia && item.bahasa_indonesia.toLowerCase().includes(queryKata.toLowerCase()))
            );
            return res.json(hasilFilter);
        }

        // TIPS KEAMANAN: Jangan kirim semua data jika diakses kosongan
        res.status(400).json({ status: "error", message: "Gunakan parameter ?kata= untuk mencari data." });
    });
});

module.exports = app;