# 🏠 Moroccan Housing Platform

A full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js) where users can publish and search for properties to rent across Morocco.

## ✨ Features

- 🔐 User authentication (register, login)
- 🏡 Add & manage property listings (title, photos, description, price, etc.)
- 📷 Upload property images (via Cloudinary)
- 🔍 Search and filter accommodations
- 📆 Reserve a property for a specific period
- 🌍 Designed specifically for Moroccan residents

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Image Storage:** Cloudinary
- **Deployment:** Railway (Backend), Netlify (Frontend)

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repo:

```bash
git clone https://github.com/Abde03/Logement.ma.git
cd logemment.ma
```

📦 Folder Structure

logement.ma/
├── frontend/         # React frontend
├── server/         # Express backend
├── README.md

2. Create a .env file in the server and frontend folder

3. Install dependencies:

```bash
# Backend
cd server
npm install

# Frontend
cd frontend
npm install
```

4. Run locally:

```bash
# Backend
cd server
node index

# Frontend
cd frontend
npm run dev
```

📄 License
MIT
