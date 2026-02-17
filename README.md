# Soft Time Tracker

A modern, intuitive time tracking application built with **Next.js**, **Supabase**, and **Tailwind CSS**. Designed with a "Soft Organic" aesthetic, focusing on visual excellence and ease of use.

## 🚀 Live Demo
[https://time-tracker-test-arctic-web.netlify.app](https://time-tracker-test-arctic-web.netlify.app)

## ✨ Features

- **Intuitive Timer**: Start and stop tasks with a single click. Real-time visual feedback and automatic persistent storage.
- **Project Management**: Organize tasks under specific projects. Each project can have a unique color code.
- **Inline Editing**: Full CRUD (Create, Read, Update, Delete) for both tasks and projects directly within the UI — no annoying browser dialogs.
- **Smart Reports**:
  - Filter by day, week, or month.
  - Periodic project distribution analysis.
  - Export to **CSV** (optimized for Microsoft Excel with UTF-8 BOM and proper escaping).
- **Responsive Design**: Premium dark/light themes with smooth animations via `framer-motion`.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State & Animation**: React Hooks, [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment**: [Netlify](https://www.netlify.com/) (Static Export)

## 💻 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Viacheslav-Semenyuk/time-tracker-test.git
   cd time-tracker-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📊 Database Schema

The project uses two main tables:
- `projects`: Stores project names and hex color codes.
- `time_entries`: Stores task names, project associations, start/end timestamps, and duration.

Refer to `schema.sql` for the full PostgreSQL definitions.

---
*Created as part of an AI Developer Test Task.*
