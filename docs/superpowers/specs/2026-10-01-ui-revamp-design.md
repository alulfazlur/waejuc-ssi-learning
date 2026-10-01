# Revamp UI WAVES-SSI: Desain

Tanggal: 2026-10-01 · Branch: `revamp-ui` (dari `origin/master`) · Status: disetujui

## 1. Tujuan dan batasan

**Tujuan:** tampilan seluruh aplikasi menjadi lebih modern, konsisten, dan nyaman dipakai, termasuk di HP. Ditambah autosave draft jawaban dan section "Tentang WAVES-SSI" di homepage.

**Pengguna:** mahasiswa calon guru biologi. Aplikasi **sedang aktif dipakai** dan sudah ada jawaban nyata di Supabase.

**Batasan (tidak boleh berubah):**
- Nama field form, struktur tabel `student_responses`, aturan upsert (`student_id, level_slug`), dan perhitungan `maxStep = jumlah baris + 1`.
- Route (`/`, `/signin`, `/learning/mission`, `/learning/[slug]`, `/learning/complete`), urutan `SYLLABUS`, dan skema validasi Yup.
- Isi teks lesson dan istilah naratif ("ID Peneliti", "Otorisasi Akses", dan seterusnya). Yang berubah hanya tampilan, kecuali yang disebut di §9.
- Dukungan bahasa ID dan EN. Setiap teks baru ditambahkan ke `id.json` dan `en.json`.
- Ekspor PDF (`src/lib/exportPDF.js`) tidak diubah.

**Kriteria berhasil:**
- Semua halaman memakai token dan komponen yang sama.
- Nyaman di lebar 375px tanpa scroll horizontal di level halaman.
- Kontras teks ≥ 4.5:1 dan garis input ≥ 3:1 di light dan dark mode.
- Fokus keyboard terlihat di semua elemen interaktif.
- Jawaban lama tampil utuh di keenam step dan tidak ada jawaban yang hilang.

**Pendekatan rilis:** redesign menyeluruh di satu branch, lalu di-merge sekaligus setelah lolos QA (§11).

## 2. Nama produk

Semua nama di UI diganti dari "Waejuc-SSI" / "Waejuc SSI" menjadi **WAVES-SSI**:
- navbar landing (`(marketing)/layout.js`)
- navbar mission (`learning/mission/layout.js`)
- navbar dan kartu sign in (`signin/page.js`)
- sidebar lesson (baru)
- footer
- metadata di `src/app/layout.js`: `title: "WAVES-SSI"`, `description: "Web-based Augmented & Virtual Environmental SSI"`

"WAEJUC" tetap dipakai sebagai nama **tim peneliti/konsorsium** (§8.1). Nama repo, `package.json`, dan nama file logo tidak diubah.

## 3. Token desain (`src/app/globals.css`)

Nama token yang sudah ada tetap dipakai supaya class Tailwind tidak perlu diganti massal. Beberapa nilainya diubah dan token baru ditambahkan.

| Token | Light | Dark | Keterangan |
|---|---|---|---|
| `--background` | `#f2f5f6` | `#083a4f` | light sebelumnya `#e9e8e8` |
| `--card` | `#ffffff` | `#0e4a63` | dark sebelumnya slate `#1e293b` |
| `--primary` | `#083a4f` | `#e9eef0` | teks utama dan tombol utama |
| `--secondary` | `#2f6875` (6.2:1) | `#86c6d1` (5.1:1 di card) | sebelumnya `#36717e` (dark 2.21:1 ❌) |
| `--tertiary` | `#c0d6d6` | `#c0d6d6` | permukaan aksen |
| `--muted` | `#556274` (6.2:1) | `#a9bec7` (5.0:1) | sebelumnya 3.89:1 ❌ |
| `--border` | `#dbe5e8` | `#2a6a82` | garis dekoratif |
| `--input` *(baru)* | `#6b8a94` (3.7:1) | `#5b9bb0` (3.1–3.9:1) | garis input, memenuhi 3:1 |
| `--ring` *(baru)* | `#2f6875` | `#86c6d1` | outline fokus 3px, offset 1px |
| `--danger` | `#c62828` | `#ffa59d` | sebelumnya `#ef4444` untuk kedua mode |
| `--quaternary` (sand) | `#a58d66` | `#a58d66` | hanya sebagai isian atau aksen, tidak untuk teks |
| `--surface-subtle` *(baru)* | `#e8f1f3` | `#0b4258` | callout tugas, banner, item aktif |

Elevasi kartu (gaya "Soft elevated" yang dipilih): `--shadow-card: 0 1px 2px rgb(8 58 79 / .06), 0 8px 24px rgb(8 58 79 / .08)`. Di dark mode bayangan diganti `border: 1px solid var(--border)`, karena bayangan tidak terlihat di atas navy.

Radius: kartu 20px · input 10–12px · tombol 12px · chip 999px.

Motion: durasi 150–250ms. Transisi antar step berupa fade 200ms (sebelumnya geser 100px). Ada `@media (prefers-reduced-motion: reduce)` yang mematikan animasi framer-motion lewat `MotionConfig reducedMotion="user"` di provider client root (bersama `I18nProvider`).

Scrollbar memakai token, bukan hex hardcoded.

## 4. Tipografi

Font dimuat dengan `next/font/google` di `src/app/layout.js`. Saat ini Inter hanya disebut di CSS dan tidak pernah dimuat, sehingga browser memakai font sistem.

| Peran | Font | Variabel | Pemakaian |
|---|---|---|---|
| Judul | Exo 600/700 | `--font-heading` → `font-heading` | h1–h3, judul kartu, brand |
| Isi | Inter 400/500/600 | `--font-sans` (default body) | teks, jawaban, form |
| Data | Roboto Mono 500 | `--font-mono` (`font-mono`) | label step, angka, timer, chip referensi |

Ukuran: body 16px dengan line-height 1.6–1.65. Teks interaktif minimal 12px (yang sekarang 10–11px dinaikkan). Panjang baris isi sekitar 68ch.

## 5. Komponen bersama (`src/components/`)

Setiap komponen punya satu tugas dan props yang jelas. Komponen yang sudah ada dipertahankan nama dan API-nya, kecuali yang disebut di bawah.

- **Button** (diubah): varian `primary | secondary | outline | ghost | white` tetap, ditambah `danger`. Radius 12px, tinggi minimal 44px, tanpa efek `-translate-y-1` saat hover, ada `focus-visible:ring`. Prop baru `loading` menampilkan spinner dan otomatis `disabled`.
- **Input** (diubah): label dan pesan error ditangani `Field`. Border memakai `--input`, fokus memakai ring, error memakai `--danger`. Atribut `aria-invalid` dan `aria-describedby` diisi.
- **Field** (baru): membungkus label, kontrol, teks bantuan, dan error (13px dengan ikon `AlertCircle`). Elemen pembungkusnya memakai `data-field="<name>"` sebagai titik tujuan scroll saat validasi gagal.
- **Card** (baru): permukaan kartu dengan elevasi; prop `as` dan `className`.
- **QuestionCard** (baru): nomor (badge mono), judul (Exo), deskripsi, chip referensi opsional (`refs="4, 5, 12"`), indikator "✓ Terisi", dan `children` untuk kontrol jawaban. Komponen ini menggantikan kombinasi `section` + `Instruction` yang sekarang tersebar di step-step.
- **Callout** (baru): blok "Tugas/Aktivitas" dengan ikon (`--surface-subtle`).
- **Chip** (baru): label kecil mono.
- **Instruction**: tetap ada untuk teks petunjuk di dalam QuestionCard (pertanyaan lanjutan), dengan tipografi baru.
- **HeaderLesson** (diubah): label mono "LANGKAH n / 6", judul Exo, dan subtitle untuk step 4–5. Garis dekoratif dihapus.
- **ThemeToggle, LanguageToggle** (diubah): tombol ikon 40px dengan `aria-label` dari terjemahan.
- **Select, RichTextEditor, DiagramInput** (diubah, hanya gaya): token border, ring, dan error baru. Toolbar editor memakai tombol 32px dengan `aria-label`. Perilaku, struktur data, dan sinkronisasi `useController` tidak diubah.

## 6. Shell lesson (`src/app/learning/[slug]/layout.js`)

Dipecah menjadi komponen di `src/features/lessons/shell/`:

- **Sidebar** (desktop ≥1024px, lebar 272px, `--card`). Urutan isinya:
  1. Brand WAVES-SSI
  2. Progres: bar dan "n/6 · %"
  3. Daftar step: lingkaran status (✓ selesai / nomor aktif / 🔒 terkunci). Step terkunci dirender sebagai `<span aria-disabled>`, bukan `<Link href="#">`.
  4. Grup "Sumber": materi ↗ dan ekspor PDF
  5. Akun: ID dari email tanpa `@microlab.com`, dan tombol Keluar
- **TopBar** (desktop): label "LANGKAH n / 6", status autosave, ThemeToggle, LanguageToggle.
- **MobileTopBar** (<1024px): tombol ☰ membuka Sidebar sebagai drawer dari kiri (overlay, tutup dengan Esc atau ketuk luar, fokus dikunci di dalamnya), di tengah nama step dan "n/6", tombol ⋯ untuk menu tema, bahasa, materi, dan PDF. Progress bar tipis 4px di bawahnya. Tombol menu melayang yang sekarang dihapus.
- **ActionBar** (sticky di bawah, semua ukuran layar):
  - kiri: "← Sebelumnya", ke slug sebelumnya di `SYLLABUS`; disembunyikan di step 1; di HP hanya ikon dengan `aria-label`
  - tengah: "x dari y pertanyaan terisi" (desktop) atau status autosave (HP)
  - kanan: "Kirim & lanjut →" yang menjalankan `handleSubmit(onSubmit, onError)` yang sudah ada, dengan prop `loading` selama upsert berlangsung

  ActionBar dirender oleh `LessonController` (karena butuh `methods`), bukan oleh layout. Bar ini tidak muncul di `/learning/complete`.
- Konten dibatasi `max-w-3xl` (768px) untuk step berisi teks. Step dengan tabel lebar (initial, decision) memakai `max-w-5xl`. Tabel di dalam kartu memakai `overflow-x-auto`.
- Overlay loading penuh layar hanya muncul saat sinkronisasi awal (`isSyncing`). Saat submit, yang muncul cukup status loading di tombol.

**Hitungan "terisi":** untuk setiap kunci di `schemas[slug].fields`, panggil `schema.validateAt(key, values)`. Field dihitung terisi kalau lolos validasi. Hitungan ini memakai aturan yang sama dengan validasi submit. Diperbarui lewat `watch()` dengan debounce 300ms. Status yang sama dipakai indikator "✓ Terisi" di QuestionCard.

**Scroll ke error:** `onError(errors)` mencari kunci error pertama sesuai urutan field di skema, lalu memanggil `scrollIntoView({ block: 'center' })` ke `[data-field="<name>"]` dan memfokuskan elemen fokusable pertama di dalamnya. Toast `validation.recheck_answer` tetap muncul.

## 7. Autosave draft

**Modul murni** `src/features/lessons/draftStorage.js`:
- `draftKey(userId, slug)` → `waves-ssi:draft:v1:${userId}:${slug}`
- `saveDraft(userId, slug, content)` → `{ ok: true, savedAt }` atau `{ ok: false, reason }`. Kegagalan seperti quota atau akses diblokir ditangkap dengan try/catch.
- `loadDraft(userId, slug)` → `{ savedAt, content }` atau `null`. JSON rusak dianggap `null` dan kuncinya dihapus.
- `clearDraft(userId, slug)`
- `isSameContent(a, b)` → perbandingan stabil (lodash `isEqual`) setelah `cleanDiagram`.

`cleanDiagram` dipindahkan dari `LessonController` ke `src/features/lessons/cleanDiagram.js` agar bisa dipakai bersama. Fungsinya sendiri tidak diubah.

**Hook** `useDraftAutosave({ userId, slug, methods, submitted })` di `src/features/lessons/`:
- **Saat mount atau slug berubah:** baca draft. Kalau ada dan `!isSameContent(draft.content, submitted)`, jalankan `methods.reset(draft.content)` dan set `restoredAt`. Kalau tidak, reset dengan `submitted` seperti perilaku sekarang. Logika ini menggantikan `useEffect` reset di `LessonController`.
- **Menyimpan:** berlangganan `methods.watch`, debounce 1000ms, lalu `saveDraft`. Perubahan yang berasal dari `reset` diabaikan.
- **Status yang dikembalikan:** `idle | saving | saved(savedAt) | unavailable`, `restoredAt`, `discardDraft()` (hapus draft lalu `reset(submitted)`), dan `clear()`.
- `onSubmit` memanggil `clear()` **setelah** upsert berhasil. Kalau upsert gagal, draft tetap ada.

**UI:**
- Status ditampilkan di TopBar (desktop) atau ActionBar (HP), dengan pesan "Menyimpan…", "Draft tersimpan · HH:mm", dan "Draft tidak bisa disimpan di perangkat ini".
- Banner `--surface-subtle` di atas konten: "Draft dari {waktu} dipulihkan." dengan tombol "Buang draft". Banner bisa ditutup.

**Keputusan:**
- Draft **tidak** dihapus saat logout, supaya pekerjaan yang belum dikirim aman. Isinya hanya jawaban esai, jadi risikonya rendah walaupun di komputer bersama.
- Draft tidak berpindah antarperangkat. Draft lama di perangkat lain akan muncul sebagai banner dan bisa dibuang.
- Tidak ada perubahan database.

## 8. Halaman

### 8.1 Landing (`src/app/(marketing)/`)
Urutan: Hero → **Tentang WAVES-SSI** → Tujuan pembelajaran → Footer.

- **Navbar:** brand WAVES-SSI, ThemeToggle, LanguageToggle, dan tombol "Masuk" (ke `/signin`). Mahasiswa yang sudah login melihat "Lanjutkan" (ke `/learning/mission`).
- **Hero:** foto `hero-poster.webp` tetap ditampilkan lewat `next/image` (priority) sebagai lapisan dasar, jadi hero tidak pernah kosong. Video diaktifkan lagi memakai versi kompresi baru `public/videos/hero-bg-720.mp4` (H.264 720p 24fps tanpa audio, 2,7 MB; aslinya 76 MB VP9 1080p yang tidak bisa diputar di Safari). Video dipasang di atas foto dan baru di-fade-in setelah event `canplay`. `src` hanya diisi di client setelah mount, dan **dilewati** jika `prefers-reduced-motion`, `navigator.connection.saveData`, atau `effectiveType` `slow-2g`/`2g`/`3g`; dalam kondisi itu yang tampil cukup foto. File video asli tidak dihapus. Overlay diganti dari `bg-black/40` menjadi gradasi navy dari kiri. Teks rata kiri dengan max 640px. Isi teks tetap `hero.title` dan `hero.description`. Tombol baru "Mulai investigasi" (ke `/signin`, atau ke mission kalau sudah login) dan "Tentang WAVES-SSI" (scroll ke section about). Panah scroll tetap ada.
- **Tentang WAVES-SSI (baru):** `src/features/home/components/about.js`, `id="about"`.
  - Judul "Tentang WAVES-SSI". Paragraf pertama sebagai lead (18px), lalu dua paragraf berikutnya. Teks dari pengguna dipakai dengan tiga koreksi: typo "adalah adalah" menjadi "adalah", "ChemSystem" menjadi "WAVES-SSI", dan "calon guru kimia" menjadi "calon guru biologi".
  - Sub-judul "Tim Peneliti WAEJUC": grid 2 kolom di desktop. Kiri: `WAEJUC_Logo_Tiga_Universitas.jpeg` (1800×1030) lewat `next/image` dalam bingkai kartu radius 20px, dengan alt "Logo WAEJUC: Universitas Negeri Malang, Universitas Jember, dan Curtin University". Kanan: tiga kartu anggota (peran mono kecil, nama Exo, institusi muted):
    - Ketua peneliti: Prof. Sri Rahayu, Ph.D., Universitas Negeri Malang, Indonesia
    - Anggota: Dr. Hikmah Buroidah, Universitas Jember, Indonesia
    - Anggota: Prof. Dr. Mauro Mocerino, Curtin University, Australia
  - Di HP grid menjadi satu kolom: logo di atas, kartu di bawah.
  - Semua teks masuk `about.*` di `id.json`. Versi `en.json` adalah terjemahan saya, perlu dicek.
  - Logo memiliki latar putihnya sendiri, jadi di dark mode tetap tampil dalam bingkai kartu terang.
- **Tujuan pembelajaran:** empat kartu dengan ikon lucide di badge teal seragam (bukan biru/ungu/merah). Judul pindah ke `objectives.items.*` di kedua bahasa (sekarang hardcoded bahasa Inggris).
- **Footer:** "© 2026 WAVES-SSI · Tim Peneliti WAEJUC" (sebelumnya "© 2026 E-Learning Platform."), dengan latar `--primary` (light) atau `--card` (dark).

### 8.2 Sign in (`src/app/signin/page.js`)
- Desktop: dua kolom. Kiri panel gradasi navy–teal berisi brand dan satu baris tagline. Kanan form di atas `--card`. Di HP hanya form.
- Satu alert error di atas form (`role="alert"`), bukan diulang di bawah tiap kolom.
- Kolom: label tetap (`signin.label`, "Password"). Placeholder password dari `signin.password_placeholder` (baru). Atribut `autoComplete="username"` dan `"current-password"`. Tombol lihat password diberi `aria-label`.
- Tombol `loading` selama proses. Overlay penuh layar hanya muncul saat `isSyncing` setelah login berhasil.
- Brand berganti dari "WAVES-SSI Auth" menjadi WAVES-SSI.

### 8.3 Mission (`src/app/learning/mission/`)
Struktur tetap. Kartu dan stat memakai `Card`. Ikon rantai memakai teal atau sand. Tombol mulai memakai `Button loading`.

### 8.4 Step lesson (`src/features/lessons/components/`)
Semua step memakai `Callout` untuk tugas dan `QuestionCard` per pertanyaan. Nomor pertanyaan berurutan di dalam step.
- **initial:** video sebagai kartu media (ikon ▶, "YouTube ↗"). StakeholderCard memakai `Card`; tombol play 40px dengan `aria-label`; progress bar audio mendukung keyboard (`role="slider"`, panah kiri/kanan ±5 detik). Tabel ekosistem dan pertanyaannya dalam satu QuestionCard.
- **qualitative / explanation:** DiagramInput dan editor dalam QuestionCard. Ilustrasi plastik/fiber memakai badge teal/sand.
- **quantitative:** data stasiun dan trofik memakai `font-mono` dan tabel bergaris tipis.
- **decision:** tabel strategi di desktop. Di <768px setiap baris tampil sebagai kartu dengan label per kolom. Nama field `decision_strategy.${i}.*` tetap.
- **reflection:** rating wajah tetap. Saat dipilih, warnanya `--secondary` seragam ditambah label teks tebal. Tombol rating memakai `role="radio"` dalam `role="radiogroup"`.
- **complete:** kartu survei memakai `Card`. Animasi `animate-ping` dihapus saat reduced motion.
- **not-found:** memakai token dan tombol baru.

## 9. Perbaikan bug yang ikut dikerjakan
- `learning/mission/page.js`: `Object.keys(responses)[responses.length - 1]` → `Object.keys(responses).at(-1)`. Sebelumnya `responses` adalah objek, sehingga indeksnya `undefined`.
- `initial.js`: typo class `text-primarya` → `text-primary`.
- Placeholder password hardcoded dipindah ke i18n.

## 10. Testing
- **Vitest** ditambahkan sebagai devDependency dengan script `npm test`, khusus untuk `draftStorage.js` dan `cleanDiagram.js`:
  - simpan lalu muat dengan kunci per user dan per slug
  - JSON rusak menghasilkan `null`
  - quota atau `setItem` melempar error menghasilkan `{ ok: false }`
  - `clearDraft`
  - `isSameContent` untuk HTML, array tabel, dan diagram dengan field runtime React Flow
- `npm run lint` dan `npm run build` harus lolos.

## 11. QA manual sebelum merge
Diuji di preview deploy dengan akun uji yang sudah punya jawaban di beberapa step:
1. Login. Brand WAVES-SSI muncul di semua halaman.
2. Jawaban lama tampil utuh di setiap step yang sudah dikirim, termasuk teks, tabel, diagram, dan rating.
3. Submit tiap step: urutan unlock benar, step berikutnya terbuka, dan `/learning/complete` tercapai.
4. Validasi gagal: halaman menggulir dan fokus ke field pertama yang error.
5. Autosave: ketik, tunggu status "tersimpan", muat ulang, banner "dipulihkan" muncul. Uji juga "Buang draft". Setelah submit, tidak ada banner.
6. Mode privat atau localStorage diblokir: status "tidak bisa disimpan", tetapi submit tetap berfungsi.
7. Ekspor PDF tetap berfungsi.
8. Light dan dark mode di semua halaman, dengan kontras sesuai §3.
9. Lebar 375px, 768px, dan 1440px: tidak ada scroll horizontal di level halaman, drawer dan ActionBar tidak tertutup apa pun.
10. Keyboard: navigasi Tab di seluruh shell dan form, ring terlihat, drawer bisa ditutup dengan Esc.
11. Bahasa EN: tidak ada kunci terjemahan yang tampil mentah.

## 12. Keputusan dari review
1. "ChemSystem" di teks Tentang diganti "WAVES-SSI".
2. Sasaran: calon guru **biologi**; kata "kimia" dari teks yang diberikan diganti "biologi".
3. Video hero diaktifkan dengan versi terkompresi dan aturan pemuatan di §8.1.
4. Branch dibuat dari `origin/master` (isi kodenya sama dengan `feature`).

## 13. Di luar cakupan
Perubahan database, sinkronisasi draft antarperangkat, perubahan isi pertanyaan, desain ulang ekspor PDF, route guard untuk step terkunci, dan migrasi ke TypeScript.
