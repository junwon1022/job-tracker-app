# Job Tracker App

A full-stack **Job Application Tracker** built with **React, Node.js, Express, and MongoDB**. This app allows users to **register, log in, and track job applications** efficiently. 
The project is designed to be **scalable, modern, and developer-friendly**.

---

## 🚀 Why This Tech Stack?
### **1️⃣ Backend: Node.js + Express.js**
✅ **TypeScript Everywhere**: Using **Node.js** allows us to write TypeScript for both **frontend and backend**, making full-stack development more seamless.\
✅ **Fast & Asynchronous**: Node.js uses a **non-blocking, event-driven architecture**, making it **highly efficient** for handling multiple user requests simultaneously.\
✅ **Scalability**: Express.js is lightweight and **flexible**, perfect for building **RESTful APIs** with minimal boilerplate code.\
✅ **Community & Ecosystem**: With **npm**, we have access to thousands of packages, including **authentication (jsonwebtoken), security (bcryptjs), and database management (mongoose)**.

### **2️⃣ Database: MongoDB + Mongoose**
✅ **NoSQL & Flexibility**: MongoDB is a **NoSQL database**, allowing flexible document-based storage for user and job data.\
✅ **Scalability & Performance**: Suitable for high-speed data access and scaling applications.\
✅ **Mongoose ORM**: Provides an easy way to structure data and enforce validation rules, making interactions with MongoDB more robust.

### **3️⃣ Frontend: React.js (Vite + Tailwind CSS)**
✅ **Component-Based Architecture**: React makes it easy to **reuse components** and **manage state** efficiently.\
✅ **Vite for Performance**: Instead of **Create React App**, we use **Vite**, which offers **faster builds and hot module replacement**.\
✅ **Tailwind CSS for Styling**: Instead of traditional CSS, **Tailwind** speeds up UI development with **utility-first styling**.\
✅ **React Router**: Enables seamless **page navigation** between login, register, and dashboard pages.

### **4️⃣ Authentication: JWT (JSON Web Token)**
✅ **Stateless Authentication**: Unlike traditional session-based auth, **JWT allows authentication without storing user sessions on the server**, making it more scalable.\
✅ **Secure**: Passwords are hashed using **bcrypt.js**, and tokens are signed using **JWT_SECRET** to prevent unauthorized access.\
✅ **Easy API Integration**: Tokens can be sent in **HTTP headers**, making it easy to use with frontend clients like React.

### **5️⃣ Deployment (Optional)**
✅ **Backend Hosting**: Deployed using **Render/Railway/Heroku** for easy backend scaling.\
✅ **Frontend Hosting**: Hosted on **Vercel/Netlify**, allowing fast deployments with CI/CD support.\
✅ **Database**: MongoDB Atlas ensures a **cloud-hosted database**, eliminating the need for local database setup.

---

## 🔧 Features
✅ **User Authentication** (Register/Login with JWT)\
✅ **Track Job Applications** (CRUD: Create, Read, Update, Delete Jobs)\
✅ **Filter & Manage Jobs** (Pending, Interview, Rejected, Hired)\
✅ **User Dashboard** (View Job Statistics & Charts)\
✅ **Responsive UI** (Mobile-Friendly, Tailwind CSS)

---

## 🔨 Installation Guide
1️⃣ **Clone the Repository**
```sh
git clone https://github.com/your-repo/job-tracker-app.git
cd job-tracker-app
```

2️⃣ **Set Up Backend**
```sh
cd server
npm install
node index.js
```

3️⃣ **Set Up Frontend**
```sh
cd ../client
npm install
npm run dev
```

4️⃣ **Environment Variables** (`server/.env`)
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📌 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login (returns JWT token) |
| GET | `/api/jobs` | Get all jobs for logged-in user |
| POST | `/api/jobs` | Add a new job application |
| PUT | `/api/jobs/:id` | Update a job status |
| DELETE | `/api/jobs/:id` | Delete a job |

---

## 💡 Future Enhancements
- 🔹 **OAuth Integration** (Google/Facebook Login)
- 🔹 **Job Application Reminders** (Email notifications)
- 🔹 **Advanced Job Filtering** (By company, date, status)
- 🔹 **AI Resume Analyzer** (Using GPT/ML models)

---

## 🙌 Contributing
Contributions are welcome! Feel free to submit **issues** or **pull requests**.

---

## 📄 License
This project is **MIT Licensed**. Feel free to modify and use it for your portfolio! 🚀

