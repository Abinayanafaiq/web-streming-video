import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@kuantriset.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "riset12345";

const ARTICLES = [
  {
    title: "Mengapa Mean Reversion Gagal pada Pasar Ber momentum: Sebuah Studi Empiris",
    slug: "mean-reversion-vs-momentum",
    excerpt:
      "Eksplorasi statistik mengapa strategi mean reversion sederhana gagal pada saham ber-momentum kuat, dengan data S&P 500 20 tahun.",
    tags: ["statistik", "equity", "mean-reversion"],
    content: `Pendahuluan

Mean reversion adalah salah satu anomali pasar yang paling banyak diteliti. Namun penerapannya naif sering gagal ketika dihadapkan pada saham dengan momentum kuat.

Metodologi

Kami menguji z-score 20 hari pada universe S&P 500 periode 2005-2025, membandingkan kinerja short-reversal pada kuanti terbawah vs kuintil teratas berdasarkan 12 bulan momentum.

Temuan

1. Pada kuintil momentum terendah, sinyal reversal menghasilkan win-rate 54%.
2. Pada kuintil momentum tertinggi, win-rate jatuh ke 41% dengan ekor kerugian lebih tebal.
3. Volatilitas terimplisit menjelaskan sebagian besar perbedaan.

Kesimpulan

Filter momentum sederhana cukup untuk menghindari mayoritas kegagalan mean reversion. Riset lanjutan akan menguji interaksi dengan likuiditas.

Disclaimer: artikel ini bersifat edukatif, bukan rekomendasi investasi.`,
  },
  {
    title: "Volatilitas Terimplisit vs Historis: Kapan Premiasi Berlebih Terjadi",
    slug: "iv-vs-hv-premia",
    excerpt:
      "Mengukur spread IV-HV sebagai indikator sentimen, dan kapan spread tersebut paling sering memberi sinyal palsu.",
    tags: ["volatilitas", "opsi", "statistik"],
    content: `Kerangka

Selisih antara implied volatility (IV) dan realized volatility (HV) dikenal sebagai variance risk premium. Artikel ini memetakan kapan premiasi tersebut melebar secara tidak wajar.

Data

VIX sebagai proksi IV indeks, HV20 sebagai proksi realizasi. Periode 2006-2025.

Hasil

Spread rata-rata 3,2 poin, namun distribusinya sangat menceng. Ekstrem spread (>10 poin) lebih sering mendahului pasar tenang, bukan krisis.

Implikasi

Membeli proteksi saat spread ekstrem secara historis mahal. Strategi harvesting premiasi membawa tail risk yang tidak boleh diabaikan.

Disclaimer: bukan nasihat keuangan.`,
  },
  {
    title: "Ukuran Risiko yang Sering Salah Dibaca: Sortino, VaR, dan Drawdown",
    slug: "miskonsepsi-ukuran-risiko",
    excerpt:
      "Tiga metrik risiko populer, bias-bias halus di baliknya, dan cara membacanya dengan benar.",
    tags: ["risiko", "edukasi"],
    content: `Sortino Ratio

Sortino memisahkan volatilitas naik dan turun. Masalahnya, estimasi downside deviation pada sampel kecil sangat tidak stabil.

Value at Risk

VaR 95% tidak memberi tahu apa pun tentang seberapa buruk 5% sisanya. Conditional VaR lebih informatif, tetapi lebih sulit di-backtest.

Maximum Drawdown

Drawdown historis adalah lantai, bukan plafon. Strategi dengan drawdown historis 15% bisa mengalami 30% di masa depan.

Penutup

Gunakan beberapa metrik sekaligus, pahami asumsi di balik tiap formula, dan selalu uji pada data out-of-sample.`,
  },
];

const INSTRUMENTS = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", exchange: "NYSEArca", sector: "Indeks", featured: true },
  { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NasdaqGM", sector: "Indeks", featured: true },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NasdaqGS", sector: "Teknologi", featured: false },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NasdaqGS", sector: "Teknologi", featured: false },
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond ETF", exchange: "NasdaqGM", sector: "Obligasi", featured: false },
  { symbol: "GLD", name: "SPDR Gold Shares", exchange: "NYSEArca", sector: "Komoditas", featured: false },
];

const VIDEOS = [
  {
    title: "Pengantar Pasar Modal untuk Pemula",
    description:
      "Video pengenalan dasar-dasar pasar modal: instrumen, risiko, dan cara membaca pergerakan harga. Cocok untuk penonton baru.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    featured: true,
  },
  {
    title: "Membaca Candlestick dengan Benar",
    description:
      "Tutorial membaca pola candlestick dan konteks di baliknya. Dilengkapi contoh kasus pada data historis nyata.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    featured: false,
  },
  {
    title: "Strategi Diversifikasi Portofolio",
    description:
      "Pembahasan prinsip diversifikasi, korelasi antar aset, dan cara menyusun alokasi yang tahan terhadap volatilitas.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    featured: false,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      name: "Administrator",
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const article of ARTICLES) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { published: true, publishedAt: new Date() },
      create: {
        ...article,
        published: true,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
  }

  for (const instrument of INSTRUMENTS) {
    await prisma.instrument.upsert({
      where: { symbol: instrument.symbol },
      update: {},
      create: instrument,
    });
  }

  for (const video of VIDEOS) {
    const existing = await prisma.video.findFirst({
      where: { title: video.title },
    });
    if (existing) {
      await prisma.video.update({
        where: { id: existing.id },
        data: { title: video.title, description: video.description, url: video.url, featured: video.featured },
      });
    } else {
      await prisma.video.create({
        data: { ...video, published: true },
      });
    }
  }

  console.log("Seed selesai. Admin:", admin.email);
  console.log("Password admin (ubah segera):", ADMIN_PASSWORD);
  console.log(`Artikel: ${ARTICLES.length}, Instrumen: ${INSTRUMENTS.length}, Video: ${VIDEOS.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
