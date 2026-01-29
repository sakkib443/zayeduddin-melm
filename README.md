# 🎓 BD Calling Academy - E-Learning Platform

![Project Banner](https://bac-next.vercel.app/images/logo.png)

> **Live Demo:** [https://bac-next.vercel.app/](https://bac-next.vercel.app/)

A comprehensive, bilingual (English & Bengali) e-learning platform designed to bridge the gap between students and professional skill development. Built with **Next.js 16** and **Tailwind CSS**, this application features a dynamic user interface, role-based dashboards, and seamless course management.

## ✨ Key Features

*   **🌍 Bilingual Support:** Complete English and Bengali localization with automatic font adjustment (Hind Siliguri for Bengali).
*   **🎨 Interactive UI/UX:**
    *   **Floating Action Buttons:** Smart, expandable buttons for "Join Seminar" and "Language Program" with animated gradients.
    *   **Micro-Animations:** "Flying particles" and floating emojis in feature cards for a lively organic feel.
    *   **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop devices with touch-friendly navigation.
*   **🚀 Course Management:**
    *   Filter courses by Type (Online, Offline, Recorded), Category, or Skill Level.
    *   Real-time search and sorting capabilities.
*   **👥 Role-Based Access:**
    *   **Student Portal:** For tracking progress, certificates, and payments.
    *   **Mentor Dashboard:** For managing classes and content.
    *   **Admin Panel:** Full control over platform resources.
*   **🔐 Authentication:** Secure Login and Registration system.

## 🛠️ Technology Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
*   **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sakkib443/Bac-next-frontend.git
    cd Bac-next-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in your browser:**
    Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

```bash
src/
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
│   ├── Home/           # Homepage specific components
│   ├── sheard/         # Shared components (Navbar, Footer, Buttons)
│   ├── User/           # Student Dashboard components
│   └── ...
├── context/            # React Context (Language, etc.)
├── redux/              # Redux store and slices
├── locales/            # Translation files (en.json, bn.json)
└── utils/              # Helper functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<p align="center">
  Developed with ❤️ by <a href="https://github.com/sakkib443">Sakib</a>
</p>
