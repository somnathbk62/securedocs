# 📄 Secure Docs – Document Management System

Secure Docs is a web-based document management system for educational institutions. It empowers **administrators** to manage student data, ID cards, and certificates, while **students** can securely view and request their personal academic documents.

## Built with **React** and **Firebase**, the system ensures real-time updates, seamless authentication, and role-based access control.

## 🧪 Demo Access

**Student Demo Credentials:**

- **Email:** riya.sharma.demo@gmail.com
- **Password:** Demo@123

_Use these credentials to test the student side of the application._

## 🔗 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [👩‍💼 Usage](#-usage)
- [📜 Scripts](#-scripts)
- [📂 Folder Highlights](#-folder-highlights)
- [🪪 License](#-license)

---

## ✨ Features

### 👨‍🎓 For Students

- 🔐 **Login & Authentication** – Secure sign-in using email/password.
- 📄 **Profile Management** – View personal and academic information.
- 🪪 **ID Card Management** – Access digital student ID cards.
- 🏆 **Certificate Access** – View issued academic certificates.
- 📨 **Request System** – Submit and track document requests or corrections.

### 🛡️ For Administrators

- 📊 **Admin Dashboard** – View analytics on students, requests, and documents.
- 👥 **Student Management** – Add, update, or deactivate student profiles.
- 🪪 **ID Card Management** – Issue or revoke student ID cards.
- 🏆 **Certificate Management** – Issue and update certificates.
- 📩 **Request Management** – Approve or reject student requests.
- 🔒 **Role-Based Access** – Secure routing based on user roles (admin/student)

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Bootstrap, React Toastify, React Spinners
- **Backend / Database**: Firebase (Authentication, Firestore, Storage)

---

## 📁 Project Structure

````plaintext
secure-docs-updated/
├── public/                  # Static files (HTML, icons, etc.)
├── src/
│   ├── Admin/               # Admin-specific pages and logic
│   ├── Authentication/      # Login and password management
│   ├── User/                # Student dashboard and pages
│   ├── components/          # Reusable UI components
│   ├── context/             # Auth context and user role logic
│   ├── Firebase.js          # Firebase configuration
│   └── App.js               # Main app routes
├── createAdmin.js           # Script to create an admin account
├── updateAdmin.js           # Script to modify admin details
├── resetAdminPassword.js    # Script to reset admin credentials
├── package.json             # Dependencies and build scripts
└── README.md                # Project documentation

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- npm (comes with Node.js)

---

### 📦 Installation

**Clone the repository:**

```bash
git clone <your-repo-url>
cd secure-docs-updated

###  Install dependencies:
   npm install

###  Start the development server:
   npm start
   Open your browser and go to:
   http://localhost:3000

###🔧 Firebase Setup
Update the Firebase configuration in src/Firebase.js

Enable the following in your Firebase project:

✅ Authentication

✅ Firestore

✅ Storage

👨‍💼 Admin User Setup
###Create an initial admin:
   node createAdmin.js

###Update admin details:
    node updateAdmin.js

###Reset admin password:
    node resetAdminPassword.js

👩‍💼 Usage
###Students:
   .Register/login using email and password
   .View profile, certificates, ID cards
   .Submit document or correction requests

###Admins:
   .Login via /adminlogin
   .Manage students, certificates, ID cards, and requests

📜 Scripts
Command	                    Description
npm start	                Run the app in development mode
npm run build	            Build the app for production
npm test	                Run unit tests (if available)

📂 Folder Highlights
src/Admin/ – Admin dashboard and document management

src/User/ – Student views for profile and certificates

src/Authentication/ – Login, password reset, admin login

src/context/AuthContext.js – Role management and auth handling

src/components/ProtectedRoute.js – Role-based route protection
````

## 🚀 Live Demo

Check out the live project: [securefileshub.netlify.app](https://securefileshub.netlify.app/)

```
🪪 License
This project is created for educational use. You can modify the code as needed to suit your use case.

Developed with ❤️ using React and Firebase.
---
```
