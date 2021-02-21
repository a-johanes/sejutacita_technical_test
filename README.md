# SejutaCita Techinal Test

## Requirements

1. Dengan NodeJS, agar saudara membuat **_Rest API_** **CRUD User** dan **User Login**.
2. Framework dibebaskan, tetapi disarankan _ExpressJS_. Database bebas, tetapi disarankan _MongoDB_.
3. User Login digunakan user **(username, password)** untuk mengakses API CRUD (**token**, tetapi mendapatkan nilai tambahan jika menggunakan **refresh token**).
4. Bikin 2 users dengan **role**: 1 Admin, 1 User.
5. **Admin** bisa melakukan/mengakses _semua API CRUD_, sedangkan **User** hanya bisa mengakses data _user bersangkutan saja_ (Read)
6. Implementasi arsitektur **Microservices**, menggunakan Kubernetes dengan Docker container deploy di VPS (1 node dengan beberapa pod di dalamnya). Bagi yang belum memiliki VPS, maka cukup (a) menyiapkan semua YML agar aplikasi bisa dijalankan secara containerize dan siap di deploy di Kubernetes dan (b) di-deploy di lokal dan sertakan screenshoot.
7. Upload source code ke **Github** beserta script YML Kubernetes.
8. Bikin **dokumentasi** API nya (Postman atau Swagger) yang bisa diakses ke server Rest API nya.
9. Bikin **diagram arsitektur** nya yang menjelaskan _flow API CRUD dan Login_.
10. Lampirkan _credential Admin di Readme_.
11. Mohon submit kesini (biasanya orang kirim link Github) paling lambat 24 Februari 2020. Jika tidak bisa sebelum tanggal tersebut, mohon memberi tahu saya secepatnya saja.
