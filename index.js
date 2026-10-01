const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Veritabanı Bağlantı Havuzu
var baglanti = mysql.createPool({
    host: "bzdmmagvxnfc4n3xmhiv-mysql.services.clever-cloud.com",
    user: "upiduggqxexuuuh",
    password: "QohHZEVGgTr6heHZ3NLM",
    database: "bzdmmagvxnfc4n3xmhiv",
    port: 3306,
    ssl: {
      rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Statik dosyaları (CSS, JS, Resimler ve Ana Sayfa) erişime açma
app.use(express.static(__dirname));
if (path.resolve(__dirname, 'public') !== __dirname) {
    app.use(express.static('public'));
}

// Ana Sayfa Rrotası
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Öğrenci Verilerini Çekme
app.post('/ogrenciVerisi', (req, res) => {
    baglanti.query("SELECT * FROM ogrenciler", function (err, sonuc) {
        if (err) {
            console.error("Veri çekme hatası:", err);
            return res.status(500).json({ error: err });
        }
        res.json(sonuc);
    });
});

// Veri Girisi
app.post('/verigirisi', (req, res) => {
    var isim = req.body["isim"];
    var soyisim = req.body["soyisim"];
    var tcno = req.body["tcno"];

    var sorgu = "INSERT INTO ogrenciler (isim, soyisim, tcno) VALUES (?, ?, ?)";
    baglanti.query(sorgu, [isim, soyisim, tcno], function (err, data) {
        if (err) {
            console.error("Veri ekleme hatası:", err);
            return res.status(500).json({ error: err });
        }
        res.json({
            success: true,
            data: data
        });
    });
});

// Güncellemeler
app.post('/guncel', (req, res) => {
    var yeniisim = req.body["yeniisim"];
    var risim = req.body["risim"];

    baglanti.query("UPDATE ogrenciler SET isim=? WHERE isim=?", [yeniisim, risim], function (err, sonuc4) {
        if (err) res.json({ "err": err });
        else res.json(sonuc4);
    });
});

app.post('/guncelsoyisim', (req, res) => {
    var yenisoyisim = req.body["yenisoyisim"];
    var isimg = req.body["isimg"];

    baglanti.query("UPDATE ogrenciler SET soyisim=? WHERE isim=?", [yenisoyisim, isimg], function (err, sonuc4) {
        if (err) res.json({ "err": err });
        else res.json(sonuc4);
    });
});

app.post('/gunceltc', (req, res) => {
    var yenitc = req.body["yenitc"];
    var tcisim = req.body["tcisim"];

    baglanti.query("UPDATE ogrenciler SET tcno=? WHERE isim=?", [yenitc, tcisim], function (err, sonuc4) {
        if (err) res.json({ "err": err });
        else res.json(sonuc4);
    });
});

// Sunucuyu Tek Bir Noktadan Başlatma (Çift listen kaldırıldı)
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor.`);
});
