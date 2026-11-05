# Project Context & Implementation Documentation: Student CRUD Application

## 1. Project Overview
A complete, responsive Student Management CRUD (Create, Read, Update, Delete) web application built with:
- **Frontend**: Vite + React (JavaScript) + **Tailwind CSS**
- **Design Paradigm**: **100% Non-Modal Architecture** — uses a streamlined dual-panel layout (Student Form card + Student Directory table) with inline edit mode, row-level inline delete confirmation, and auto-dismissing alert banners.
- **Backend**: Spring Boot REST API (`user-api`) with Spring Data JPA and PostgreSQL (`db_user`)
- **Target Entity**: Student / User (`id`, `name`, `email`)

---

## 2. Implemented Backend Architecture (`user-api`)

- **File**: `user-api/src/main/java/com/teves/user/UserController.java`
- **CORS Configuration**: `@CrossOrigin(origins = "*")`
- **Base Route**: `/teves`
- **Supported Endpoints**:
  | Method | Path | Description | Payload Format |
  |---|---|---|---|
  | `GET` | `/teves/all` | Retrieve all student records | None |
  | `GET` | `/teves/{id}` | Retrieve a student record by ID | Path variable |
  | `POST` | `/teves/add` | Create a new student | JSON `{ "name": "...", "email": "..." }` or URL Params |
  | `PUT` | `/teves/{id}` & `/teves/update/{id}` | Update student details | JSON `{ "name": "...", "email": "..." }` or URL Params |
  | `DELETE` | `/teves/{id}` & `/teves/delete/{id}` | Delete student by ID | Path variable |

---

## 3. Implemented Frontend Architecture (`student-frontend`)

### Technology Stack:
- **Vite 8** + **React 19** (JavaScript / JSX)
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **Icons**: `lucide-react`
- **HTTP Client**: `axios` with configured timeouts and base API URL

### Directory Structure:
```
student-frontend/
├── index.html
├── vite.config.js            # Tailwind v4 plugin + /teves dev proxy
├── package.json
└── src/
    ├── index.css             # Tailwind CSS directives
    ├── App.jsx               # Layout, state management & API coordinator
    ├── main.jsx              # Application entry point
    ├── services/
    │   └── studentService.js # Full CRUD axios calls to /teves
    └── components/
        ├── Header.jsx        # Navbar, live total student counter & refresh button
        ├── Notification.jsx  # Inline alert banners (success, error, info)
        ├── StudentForm.jsx   # Non-modal Add / Edit card form with client validation
        └── StudentTable.jsx  # Non-modal table with live search and inline delete confirm
```

### Non-Modal UI Highlights:
1. **Side-by-Side Dual-Panel Card Layout**:
   - The left panel holds the **Student Form**.
   - Default mode is **"Add New Student"** with empty fields.
   - Clicking **"Edit"** on any row dynamically switches the form to **"Edit Student (ID: #)"**, highlights the card in indigo, pre-fills the input fields, and provides a **"Cancel Edit"** button.
2. **Row-Level Inline Delete Confirmation**:
   - Clicking **"Delete"** changes that row's action buttons to `Confirm? [Yes] [No]` directly inside the row cell. No popups or modals appear.
3. **Inline Notifications**:
   - Operation outcomes (create, edit, delete, server connection status) appear as alert banners above the cards and auto-dismiss after 4.5 seconds.

---

## 4. How to Run the Entire Project

### Step 1: Start the Backend (Spring Boot)
1. Ensure PostgreSQL is running on `localhost:5432` with database `db_user` and user `postgres`/`admin` (or update `user-api/src/main/resources/application.properties`).
2. Open a terminal in `user-api`:
   ```bash
   cd user-api
   ./mvnw.cmd spring-boot:run
   ```
   Backend will start on `http://localhost:8080`.

### Step 2: Start the Frontend (Vite React)
1. Open a new terminal in `student-frontend`:
   ```bash
   cd student-frontend
   npm run dev
   ```
2. Open your browser at:
   ```
   http://localhost:5173
   ```
   The Vite proxy forwards `/teves` API requests directly to `http://localhost:8080`, and CORS is also enabled on the backend.

---

## 5. Build & Quality Verification
- **Frontend Build**: Verified with `npm run build` (Clean production output in `dist/`, 0 errors).
- **Backend Build**: Verified with `./mvnw.cmd compile` and `./mvnw.cmd package -DskipTests` (Build Success).

---

## 6. Render.com Deployment (Infrastructure as Code)

The repository is configured for automated deployment on Render using [render.yaml](file:///C:/Users/Student-00/Desktop/TEVES/BSIT-3ADA/STUDENT-CRUD/render.yaml) (Blueprint):

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Prepare for Render deployment"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```
2. **Deploy on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Click **New +** -> **Blueprint**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and provision:
     - **Database**: Managed PostgreSQL instance (`student-db`)
     - **Backend**: Containerized Spring Boot service (`student-backend`) via Dockerfile
     - **Frontend**: Static Web App (`student-frontend`) with URL rewriting and dynamic backend linking
