# PolarMap.js

Library Javascript yang dapat memproyeksikan ulang peta dan fitur peta Leaflet.

PolarMap.js adalah bagian dari [Arctic Connect project](http://arcticconnect.ca), khususnya modul [Arctic Web Map](http://webmap.arcticconnect.ca/). Kami ucapkan terima kasih kepada [CANARIE](http://www.canarie.ca) atas dukungan pendanaannya.

Ada dua layer dalam PolarMap.js: the lower-level Leaflet.PolarMap plugin, dan the basic PolarMap library. Masing-masing memiliki kelebihan tergantung pada situasinya. The basic PolarMap library memiliki pemuatan default plugin dan konfigurasi untuk Tiles dan Layanan Arctic Connect. The Leaflet.PolarMap plugin memungkinkan pengembang mengambil dan memilih integrasinya, sebagai pengganti dari kode/konfigurasi yang lebih banyak.

## Persyaratan yang dibutuhkan

The Leaflet.PolarMap plugin and PolarMap library keduanya membutuhkan beberapa library Javascript yang ada di bawah ini:

* [Leaflet 0.7.3 to 0.7.7](http://leafletjs.com/)
* [Proj4js 2+](https://github.com/proj4js/proj4js)
* [Proj4Leaflet 0.7.2](https://github.com/kartena/Proj4Leaflet)

Dukungan untuk versi lain dari library ini saat ini tidak dikenal, gunakan dengan risiko Anda sendiri jika ada bug atau perilaku yang tidak terduga.

## Penggunaan PolarMap.js

PolarMap.js memiliki API yang sangat mirip dengan Leaflet, jadi Anda jangan khawatir. Pertama-tama masukkan stylesheet:
```
    <link rel="stylesheet" href="css/leaflet.css" />
    <link rel="stylesheet" href="css/polarmap.css" />
```
Kemudian pasang JavaScript yang dibutuhkan:
```
    <script src="js/jquery.js"></script>
    <script src="js/leaflet.js"></script>
    <script src="js/proj4.js"></script>
    <script src="js/proj4leaflet.js"></script>
    <script src="js/polarmap-src.js"></script>
```
Dan kemudian inisialisasi peta seperti yang Anda lakukan pada peta Leaflet:
```
    <body onload="init()">
    ...
    <script>
      function init() {
        var map = PolarMap('mapContainer');
      }
    </script>
```
Dan Anda sudah siap menjalankan PolarMap.js. Untuk penjelasan lebih detail dar API dan pilihan pengaturan lainnya, silahkan lihat
[Dokumentasi API](API.markdown).


## Proses Building

disarankan untuk mengunduh versi terbaru PolarMap.js langsung dari situs kami. Tetapi Anda dapat membuat salinan sendiri dari sumber jika mau.

Untuk menghasilkan salinan dari PolarMap.js, kamu harus membangun beberapa keperluan. Proses ini membutuhkan Node.js. Setelah Node terpasang, Anda bisa menggunakan NPM untuk menyiapkan dependensi:
```
    $ npm install -g jake
    $ npm install
```
Dan kemudian buat produk:
```
    $ jake build
```
Dua salinan dari PolarMap.js akan terbentuk di dalam folder `dist`, satu dengan keterangan dan satu lagi terkompresi oleh uglifier-js.

## Contoh Hasil

Lihat folder `examples` untuk melihat informasi yang lebih lengkap tentang bagaimana penggunaan PolarMap.js dari berbagai plugin dan fitur Leaflet.

## Pengembangan

Untuk menjalankannya di webserver lokal dalam proses pengembangan aplikasi, gunakan Node http-server:
```
    $ jake server
```
Hal ini akan memberikan direktori lokal melalui HTTP pada port 8080

## Pengujian

Library ini telah diuji pada plugin lower-level yang berjalan menggunakan Mocha, Sinon, dan Expect.js. Aplikasi dapat berjalan di browser dengan mengakses direktori `spec/index.html` atau menjalankan perintah `jake test` pada terminal/command line.

## Kompatibilitas

Versi berbeda dari PolarMap.js tersedia untuk versi berbeda dari Leaflet juga.

<table>
  <tr><th>Versi Leaflet</th>  <th>Version PolarMap.js</th></tr>
  <tr><td>0.7.x</td>            <td>1.1.x</td></tr>
  <tr><td>1.0.x</td>            <td>2.0.x</td></tr>
</table>

Versi PolarMap.js untuk Leaflet 1.0.x belum tersedia.

## Penggunaan ulang kode

Library ini mengandung penyempurnaan dan modifikasi kode dari projek [leaflet-hash](https://github.com/mlevans/leaflet-hash). Leaflet-hash memiliki lisensi [MIT Licensed](http://opensource.org/licenses/MIT).

## Dukungan

[PolarMap.js](https://github.com/GeoSensorWebLab/polarmap.js) dikelola oleh James Badger (@openfirmware) dan GeoSensorWeb Lab. Jika Anda menemukan isu terkait permasalahan dalam bagian library Javascript ini, silahkan posting isu tersebut di [PolarMap.js issue tracker](https://github.com/GeoSensorWebLab/polarmap.js/issues).

Jika Anda mempunyai isu dengan penyajian data pada peta, seperti peta yang tidak akurat, data yang hilang, atau beberapa keterangan yang keliru, silahkan posting isu tersebut di [Web Map issue tracker](https://github.com/GeoSensorWebLab/awm-styles/issues).

## Lisensi

PolarMap.js dirilis dalam lisensi BSD 2-Clause license (sama seperti Leaflet).
