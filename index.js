const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const mysql = require('mysql2');

app.use(bodyParser.json());

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
  

baglanti.connect(function (err) {
    if (err) throw err;
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})




// /ogrenci-verisi adresinden
// sorgunun sonucunun gelmesi saglandı
app.post('/ogrenciVerisi', (req, res) => {
    baglanti.query("SELECT * FROM ogrenciler", function (err, sonuc) {
        if (err) res.json({ error: err });
        else {
            // sonucu json formatında döndürmeye yarar
            res.json(sonuc);
        }
    });
})
//veri yazıyoruz...
app.post('/verigirisi', (req, res) => {
    // tarayıcıdan gonderilen veriyi değişkene atamak
    var isim = req.body["isim"];
    var soyisim = req.body["soyisim"];
    var tcno = req.body["tcno"];
    var sorgu = "INSERT INTO ogrenciler (isim, soyisim, tcno) values ('" + isim + "','" + soyisim + "','" + tcno + "')";
    baglanti.query(sorgu, function (err, data) {
        if (err) throw err;
        res.json({
            success: true,
            data: data
            
        })
      
    });
    
});


app.post('/guncel', (req, res) => {
    var yeniisim = req.body["yeniisim"];
    var risim = req.body["risim"];

    baglanti.query("UPDATE ogrenciler SET isim='" + yeniisim + "' WHERE isim='" + risim + "'", function (err, sonuc4) {
        if (err) res.json({ "err": err });
        else res.json(sonuc4);
    });
});

app.post('/guncelsoyisim', (req, res) => {
    var yenisoyisim = req.body["yenisoyisim"];
    var isimg = req.body["isimg"];

    baglanti.query("UPDATE ogrenciler SET soyisim='" + yenisoyisim + "' WHERE isim='" + isimg + "'", function (err, sonuc4) {
        if (err) res.json({ "err": err });
        else res.json(sonuc4);
    });
});

app.post('/gunceltc', (req, res) => {
    var yenitc = req.body["yenitc"];
    var tcisim = req.body["tcisim"];

    baglanti.query("UPDATE ogrenciler SET tcno='" + yenitc + "' WHERE isim='" + tcisim + "'", function (err, sonuc4) {
        if (err) res.json({ "err": err });
        else res.json(sonuc4);
    });
});
// statik dosyaları erişime açma kodu
// public adında bir klasörü erişime açar
// içindeki public kelimesi değişebilir
app.use(express.static('public'))
app.listen(port, () => console.log('port çalışıyor'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
