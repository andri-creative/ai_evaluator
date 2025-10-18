# AI Evaluator Backend

Sistem evaluasi otomatis untuk CV dan Project Report kandidat menggunakan AI (Google Gemini) dan RAG (Retrieval-Augmented Generation).

## 📋 Deskripsi

Aplikasi backend ini secara otomatis mengevaluasi kandidat berdasarkan:
- **CV Analysis**: Menilai kesesuaian kandidat dengan job description
- **Project Report Analysis**: Mengevaluasi kualitas teknis proyek
- **Overall Summary**: Memberikan rekomendasi keputusan rekrutmen

## 🚀 Fitur Utama

- ✅ Upload CV dan Project Report (PDF)
- ✅ Evaluasi CV berdasarkan Technical Skills, Experience, Achievements, Cultural Fit
- ✅ Evaluasi Project berdasarkan Correctness, Code Quality, Resilience, Documentation
- ✅ Asynchronous job processing
- ✅ RAG system dengan ChromaDB untuk context retrieval
- ✅ Retry mechanism dengan exponential backoff
- ✅ Comprehensive logging system

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Gemini 2.0 Flash
- **Vector DB**: ChromaDB
- **File Processing**: pdf-parse, express-fileupload

## 📦 Prerequisites

Pastikan sudah terinstall:
- Node.js (v18 atau lebih tinggi)
- PostgreSQL (v14 atau lebih tinggi)
- npm atau yarn
- Google Gemini API Key

## 🔧 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ai-evaluator-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

**Install PostgreSQL** (jika belum):

**Windows:**
- Download dari [postgresql.org](https://www.postgresql.org/download/windows/)
- Install dan set password untuk user `postgres`

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Buat Database:**
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE ai_evaluator;

# Keluar
\q
```

### 4. Setup Environment Variables

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_evaluator?schema=public"

# Server Port
PORT=4602

# Google Gemini API Key
API_KEY=YOUR_GEMINI_API_KEY

# Environment
NODE_ENV=development
```

**Cara mendapatkan Gemini API Key:**
1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy API key dan paste ke `.env`

### 5. Setup Prisma & Database Migration

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio untuk melihat database
npx prisma studio
```

### 6. Setup ChromaDB (Optional - untuk RAG)

**Install ChromaDB:**

```bash
pip install chromadb
```

**Run ChromaDB Server:**

```bash
chroma run --path ./chroma_data --port 4602
```

Atau jalankan di terminal terpisah:

```bash
python -m chromadb.cli run --path ./chroma_data --port 4602
```

### 7. Create Upload Directory

```bash
mkdir uploads
```

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:4602`

### Production Build

```bash
# Build
npm run build

# Start
npm start
```

## 📡 API Endpoints

### 1. Health Check

```http
GET /
```

**Response:**
```json
{
  "success": true,
  "message": "CV Ai Evaluator!",
  "data": {
    "app": "Express + TypeScript + Prisma",
    "version": "1.0.0"
  }
}
```

### 2. Upload Documents

```http
POST /api/upload
Content-Type: multipart/form-data
```

**Body:**
- `cv`: File (PDF)
- `project_report`: File (PDF)

**Response:**
```json
{
  "message": "Documents uploaded successfully",
  "cv_id": "uuid",
  "project_report_id": "uuid"
}
```

### 3. Start Evaluation

```http
POST /api/evaluate
Content-Type: application/json
```

**Body:**
```json
{
  "job_title": "Backend Developer",
  "cv_id": "uuid",
  "project_report_id": "uuid"
}
```

**Response:**
```json
{
  "id": "job-uuid",
  "status": "queued"
}
```

### 4. Get Evaluation Result

```http
GET /api/result/:id
```

**Response (Completed):**
```json
{
  "id": "job-uuid",
  "status": "completed",
  "job_title": "Backend Developer",
  "created_at": "2025-01-01T00:00:00.000Z",
  "completed_at": "2025-01-01T00:05:00.000Z",
  "result": {
    "cv_match_rate": 0.75,
    "cv_feedback": "Kandidat memiliki...",
    "project_score": 13.5,
    "project_feedback": "Proyek menunjukkan...",
    "overall_summary": "Kandidat sangat cocok...",
    "final_score": 51.0
  }
}
```

## 🧪 Testing dengan cURL

### Upload Documents

```bash
curl -X POST http://localhost:4602/api/upload \
  -F "cv=@/path/to/cv.pdf" \
  -F "project_report=@/path/to/report.pdf"
```

### Start Evaluation

```bash
curl -X POST http://localhost:4602/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Backend Developer",
    "cv_id": "your-cv-id",
    "project_report_id": "your-report-id"
  }'
```

### Get Result

```bash
curl http://localhost:4602/api/result/your-job-id
```

## 📊 Scoring System

### CV Evaluation (0-5 scale)

| Kriteria | Bobot |
|----------|-------|
| Technical Skills Match | 40% |
| Experience Level | 25% |
| Relevant Achievements | 20% |
| Cultural/Collaboration Fit | 15% |

**Formula:**
```
cv_match_rate = (technical * 0.4 + experience * 0.25 + achievements * 0.2 + cultural * 0.15) * 0.2
```

### Project Evaluation (0-15 scale)

| Kriteria | Bobot |
|----------|-------|
| Correctness | 30% |
| Code Quality | 25% |
| Resilience | 20% |
| Documentation | 15% |
| Creativity | 10% |

**Formula:**
```
project_score = (correctness * 0.3 + quality * 0.25 + resilience * 0.2 + docs * 0.15 + creativity * 0.1)
```

### Final Score

```
final_score = (cv_match_rate * 100 + project_score * 20) / 2
```

## 🗂️ Project Structure

```
ai-evaluator-backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── ai/
│   │   ├── evaluators/        # CV, Project, Summary evaluators
│   │   ├── prompts/           # AI prompts
│   │   ├── vectorDB/          # ChromaDB integration
│   │   ├── geminiClient.ts    # Gemini API client
│   │   └── ragService.ts      # RAG service
│   ├── config/
│   │   ├── env.ts             # Environment config
│   │   └── prisma.ts          # Prisma client
│   ├── controllers/           # Route controllers
│   ├── libs/
│   │   ├── pdf/               # PDF parsing
│   │   └── scoring/           # Score calculation
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── types/                 # TypeScript types
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Entry point
├── uploads/                   # Uploaded files
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

## 🔍 Troubleshooting

### Error: Database connection failed

```bash
# Check PostgreSQL status
# Windows
pg_ctl status

# macOS/Linux
sudo systemctl status postgresql

# Restart PostgreSQL
# Windows: restart dari Services
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql
```

### Error: API_KEY not found

Pastikan file `.env` ada dan berisi `API_KEY` yang valid dari Google AI Studio.

### Error: Cannot parse PDF

Pastikan file PDF:
- Bukan hasil scan (harus text-based PDF)
- Tidak ter-password protected
- Ukuran < 10MB

### ChromaDB Connection Failed

Jika tidak menggunakan RAG, Anda bisa disable ChromaDB di kode atau pastikan ChromaDB server running di port yang benar.

## 📝 Development Notes

### Adding New Evaluation Criteria

1. Edit prompt di `src/ai/prompts/`
2. Update evaluator di `src/ai/evaluators/`
3. Adjust scoring di `src/libs/scoring/`

### Database Schema Changes

```bash
# Buat migration baru
npx prisma migrate dev --name your_migration_name

# Reset database (DANGER: deletes all data)
npx prisma migrate reset
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

ISC License

## 👥 Contact

Untuk pertanyaan atau support, silakan buat issue di repository.

---

**Happy Evaluating! 🚀**
