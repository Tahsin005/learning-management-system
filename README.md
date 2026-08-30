# Scholler LMS — Learning Management System

> A production-grade, full-stack Learning Management System (LMS) built with **Next.js 16**, **Strapi v5**, and **PostgreSQL**. Featuring a strict 4-role RBAC architecture, HD video + Markdown curriculum player, real-time persistent progress tracking, server-side auto-graded assessments, editorial blogging, and an administrative telemetry control center.

---

## 🧱 Tech Stack

| Layer | Technology | Deployment / Hosting |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router, Turbopack, TypeScript, TailwindCSS, TanStack Query) | **Vercel** |
| **Backend** | Strapi v5 (Headless CMS, Document Service, REST API, JWT Auth) | **Railway** |
| **Database** | PostgreSQL (Neon Cloud) / SQLite (Local Dev) | **Neon AWS / Railway** |

---

## 👥 Role-Based Permission Matrix

Access is strictly enforced at the **controller and database level** on the backend:

| Action | Admin | Content Manager | Instructor | Student |
| :--- | :---: | :---: | :---: | :---: |
| **Manage users & mutate roles** | ✅ | ❌ | ❌ | ❌ |
| **Platform Telemetry & Stats** | ✅ | ❌ | ❌ | ❌ |
| **Create / Edit / Delete Any Course** | ✅ | ✅ | Own courses only | ❌ |
| **Add / Edit / Delete Lessons & Quizzes** | ✅ | ✅ | Own courses only | ❌ |
| **View Enrolled Student Progress & Gradebook** | ✅ | ✅ | Own courses only | Own only |
| **Write / Manage Blog Posts (Draft / Publish)** | ✅ | ✅ | ❌ | ❌ |
| **Enroll in Courses** | ❌ *(403)* | ❌ *(403)* | ❌ *(403)* | ✅ |
| **Take Quizzes & Submit Assessments** | ❌ *(403)* | ❌ *(403)* | ❌ *(403)* | ✅ |

---

## ✨ Features Completed

### 1. 🛡️ Authentication & Strict 4-Role RBAC
* **Custom Role Enforcement**: 4 isolated roles (`Admin`, `Content Manager`, `Instructor`, `Student`) provisioned automatically on bootstrap.
* **Server-Side Authorization**: Endpoints strictly return `403 Forbidden` if an unauthorized role attempts mutations (e.g. non-students attempting enrollment or quiz submission).
* **JWT Authentication**: Secure token-based session handling with Bearer token authentication.

### 2. 👨‍🎓 Student Experience & Learning Portal
* **Course Catalog & Search**: Instant full-text search with category badges and lesson counters.
* **1-Click Enrollment**: Seamless enrollment saved to the student's personal dashboard.
* **Dual Lesson Player**: Synchronized HD YouTube video player paired with GitHub-flavored Markdown lesson content.
* **Persistent Progress Engine**: Students mark lessons as completed; progress percentages (e.g., $3/5 = 60\%$) are computed server-side and persist permanently across browser refreshes.

### 3. ⚡ Quiz Engine & Automated Server-Side Grading
* **Secure Answer Key Sanitization**: The `correctAnswerIndex` is stripped from API responses for students, preventing cheating via browser devtools.
* **Instant Auto-Grading**: Real-time evaluation against passing score thresholds upon submission.
* **Detailed Question Review**: Explanations for correct answers and submission attempt history stored in the database.
* **Single Attempt Enforcement**: Prevents duplicate quiz submissions.

### 4. 👨‍🏫 Instructor Studio & Gradebook
* **Course Studio**: Full CRUD operations for courses, markdown curricula, and YouTube lesson integrations.
* **Quiz Builder**: Create MCQ assessments with customizable options, correct answer keys, and passing thresholds.
* **Student Telemetry & Gradebook**: Instructors can view all enrolled students, their completion percentage, and quiz scores for their courses.

### 5. ✍️ Content Manager & Editorial Blog Suite
* **Draft vs. Published Lifecycle**: Content managers and admins can draft articles with live Markdown preview; drafts are strictly invisible to students and the public.
* **Author Attribution & Tags**: Editorial articles feature formatted publishing dates, read times, and author badges.

### 6. 👑 Admin Command Center
* **Platform-Wide Telemetry**: Live metric cards displaying total users per role, total courses, lessons, quizzes, and enrollments.
* **User Management**: Instant 1-click role mutation (Student $\leftrightarrow$ Instructor $\leftrightarrow$ Content Manager $\leftrightarrow$ Admin).
* **Global Catalogs**: Administrative overview and management of all platform courses and articles.

---

## 🔑 Standard Seeded Test Credentials

All standard test accounts use the password: **`Tahsin005`**

| Role | Username | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | `tahsin_admin` | `tahsin.admin@gmail.com` | `Tahsin005` |
| **Content Manager** | `tahsin_content` | `tahsin.con@gmail.com` | `Tahsin005` |
| **Instructor** | `tahsin_instructor` | `tahsin.ins@gmail.com` | `Tahsin005` |
| **Lead Instructor** | `tahsin_instructor_lead` | `tahsin.ins1@gmail.com` | `Tahsin005` |
| **Student** | `tahsin_student` | `tahsin.stu@gmail.com` | `Tahsin005` |

---

## 🚀 How to Run Locally

### Prerequisites
* **Node.js**: `v18.x` or higher (Node 20+ recommended)
* **npm**: `v9.x` or higher

---

### Step 1: Clone Repository
```bash
git clone https://github.com/Tahsin005/learning-management-system.git
cd learning-management-system
```

---

### Step 2: Backend Setup (Strapi v5)

1. Navigate to the `server/` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in `server/` (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Ensure your `server/.env` contains the required secrets:
   ```env
   HOST=0.0.0.0
   PORT=1337

   # Database (uses SQLite for instant local dev, or Neon PostgreSQL)
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=.tmp/data.db

   # App Secrets
   APP_KEYS=wyWjGP9ZgqMvTnTVSwleSA==,zbdLg8yPJ+Ijt2l/0pnHwQ==,Mssh3QBcCgukIX/UJ792kA==,VrGyQU5lP0gzODgWSV8y2w==
   API_TOKEN_SALT=r8rAwOM8+qf9KQmAR4UTPQ==
   ADMIN_JWT_SECRET=Kj7Ws+ikG21nWs6o0fb8Jg==
   JWT_SECRET=L432EcdSeb1Izqd6E+9TiQ==
   TRANSFER_TOKEN_SALT=Ye3WOpgUSM5n56qHfhLp3Q==
   ENCRYPTION_KEY=5Ren19ybyhhkcw6afRMWhA==
   ```

4. Populate the database with standard roles, 10 courses, 20 lessons, quizzes, and users:
   ```bash
   npm run seed:lms
   ```

5. Start the Strapi development server:
   ```bash
   npm run develop
   ```
   *Strapi will be running at:* **`http://localhost:1337`**

---

### Step 3: Frontend Setup (Next.js 16)

1. Open a new terminal, navigate to `client/`, and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env.local` file in `client/`:
   ```bash
   cp .env.example .env.local
   ```

3. Set your backend URL in `client/.env.local`:
   ```env
   # Local Backend:
   NEXT_PUBLIC_API_URL=http://localhost:1337

   # Or Live Cloud Railway Backend:
   # NEXT_PUBLIC_API_URL=https://learning-management-system-production-82b3.up.railway.app
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Open your browser at:* **`http://localhost:3000`**

---

## 🌐 Production Deployment Summary

* **Frontend**: Hosted on [Vercel](https://vercel.com) pointing to `client/` directory with `NEXT_PUBLIC_API_URL` set to the Railway endpoint.
* **Backend**: Hosted on [Railway](https://railway.com) pointing to `server/` directory with `DATABASE_URL` linked to Neon PostgreSQL.
