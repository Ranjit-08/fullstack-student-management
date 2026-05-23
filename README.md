# 🎓 EduBatch — Student Management System

A full-stack student registration and management application built with React, Node.js, Express, and MySQL — deployed on AWS with a secure, production-grade architecture.

> Students select a batch timing (07:30 / 09:00 / 10:30 AM), register with their name, email, and phone number, and admins can view and manage all enrollments.

---

## 📸 Screenshots

| Registration | Student List |
|---|---|
| Dark themed registration form with batch selector | Full student table with search, filter, and delete |

---

## 🏗️ Architecture

```
User Browser (HTTPS)
        ↓
   CloudFront CDN
   (d1hbem9l0nam33.cloudfront.net)
        ↓
 Frontend ALB (public, HTTP:80)
        ↓
 Frontend EC2 — Nginx (private subnet)
   ├── /*       → serves React dist/
   └── /api/*   → proxies to Internal Backend ALB
                          ↓
               Backend ALB (internal, HTTP:80)
                          ↓
               Backend EC2 — Node.js :5000 (private subnet)
                          ↓
                    RDS MySQL 8 (private subnet)
```

### Security Group Chain
```
Internet → Frontend ALB SG (80 from 0.0.0.0/0)
               ↓
         Frontend EC2 SG (80 from Frontend ALB SG)
               ↓
         Backend ALB SG (80 from Frontend EC2 SG)
               ↓
         Backend EC2 SG (5000 from Backend ALB SG)
               ↓
         RDS SG (3306 from Backend EC2 SG)
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios |
| Backend | Node.js, Express 4, mysql2 |
| Database | MySQL 8 on AWS RDS |
| Web Server | Nginx (reverse proxy) |
| Process Manager | PM2 |
| CDN | AWS CloudFront |
| Compute | AWS EC2 (Amazon Linux 2023) |
| Load Balancing | AWS ALB (public frontend, internal backend) |
| Networking | AWS VPC, public + private subnets |

---

## 📁 Project Structure

```
student-management/
├── README.md
├── .gitignore
│
├── frontend/                         ← React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx                   ← page router + top navbar
│       ├── main.jsx
│       ├── components/
│       │   ├── BatchSelector.jsx     ← 3-card batch picker
│       │   └── FormInput.jsx         ← reusable labeled input
│       ├── pages/
│       │   ├── RegistrationPage.jsx  ← main enrollment form
│       │   ├── SuccessPage.jsx       ← confirmation screen
│       │   └── StudentsPage.jsx      ← student list with search/filter/delete
│       ├── services/
│       │   └── api.js                ← axios client
│       └── styles/
│           └── global.css            ← dark theme, CSS variables
│
└── backend/                          ← Node.js + Express
    ├── package.json
    ├── schema.sql                    ← reference SQL for RDS
    ├── .env.example
    └── src/
        ├── server.js                 ← entry point
        ├── app.js                    ← express setup
        ├── config/
        │   ├── database.js           ← mysql2 connection pool
        │   └── initDB.js             ← auto-creates students table
        ├── models/
        │   └── studentModel.js       ← all SQL queries
        ├── controllers/
        │   └── studentController.js  ← route handlers
        ├── middleware/
        │   ├── validate.js           ← express-validator rules
        │   └── errorHandler.js       ← central error handler
        └── routes/
            ├── studentRoutes.js      ← /api/students/*
            └── healthRoutes.js       ← /health
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students/register` | Register a new student |
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/:id` | Get student by ID |
| `GET` | `/api/students/batch/:batch` | Filter by batch (07:30, 09:00, 10:30) |
| `DELETE` | `/api/students/:id` | Delete a student |
| `GET` | `/health` | ALB health check |

### Register Student — Request Body
```json
{
  "name": "Ranjit Kumar",
  "email": "ranjit@example.com",
  "phone": "9876543210",
  "batch": "07:30"
}
```

### Register Student — Response
```json
{
  "success": true,
  "message": "Student registered successfully",
  "id": 1
}
```

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- MySQL 8 running locally

### 1. Clone the repo
```bash
git clone https://github.com/Ranjit-08/fullstack-student-management.git
cd fullstack-student-management
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env — set DB_HOST, DB_USER, DB_PASSWORD
npm install
npm run dev        # runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm install
npm run dev        # runs on http://localhost:3000
```

---

## ☁️ AWS Deployment

### Infrastructure Overview

| Resource | Type | Subnet |
|---|---|---|
| Frontend EC2 | t2.micro, Amazon Linux 2023 | Private |
| Backend EC2 | t2.micro, Amazon Linux 2023 | Private |
| RDS MySQL | db.t3.micro, MySQL 8 | Private (Multi-AZ subnet group) |
| Frontend ALB | Internet-facing, HTTP:80 | Public |
| Backend ALB | Internal, HTTP:80 | Private |
| CloudFront | Distribution | Edge |

---

### Backend EC2 Setup
```bash
git clone https://github.com/Ranjit-08/fullstack-student-management.git
cd fullstack-student-management/backend
cp .env.example .env
vi .env   # fill in RDS endpoint, credentials, CORS origin

sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

npm install

# Run with PM2 (auto-restart on reboot)
npm install -g pm2
pm2 start src/server.js --name backend
pm2 save
pm2 startup
```

### Frontend EC2 Setup
```bash
git clone https://github.com/Ranjit-08/fullstack-student-management.git
cd fullstack-student-management/frontend
cp .env.example .env
vi .env   # set VITE_API_URL= (empty — nginx handles proxying)

sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y nginx

npm install
npm run build

# Nginx config
sudo vi /etc/nginx/conf.d/student.conf
```

Paste into student.conf:
```nginx
server {
    listen 80;
    root /root/fullstack-student-management/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://internal-backend-alb-dns.us-east-1.elb.amazonaws.com;
        proxy_http_version 1.1;
        proxy_set_header Host internal-backend-alb-dns.us-east-1.elb.amazonaws.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Set permissions and start nginx
chmod 755 /root
chmod -R 755 /root/fullstack-student-management/frontend/dist
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
```

### RDS Setup
```bash
# Run schema from backend EC2
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p < schema.sql
```

### CloudFront Setup
```
Origin: frontend ALB DNS
Protocol: HTTP only
Viewer protocol policy: Redirect HTTP to HTTPS
Cache policy: CachingDisabled
Default root object: index.html

Add behavior for /api/*:
  Cache policy: CachingDisabled
  Allowed methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=production
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_NAME=studentdb
DB_USER=admin
DB_PASSWORD=your_password
CORS_ORIGIN=https://your-cloudfront-domain.cloudfront.net
```

### Frontend `.env`
```env
# Leave empty when using Nginx reverse proxy
VITE_API_URL=
```

---

## 🔄 Updating the App

```bash
# On backend EC2
cd /root/fullstack-student-management
git pull origin main
cd backend && npm install
pm2 restart backend

# On frontend EC2
cd /root/fullstack-student-management
git pull origin main
cd frontend && npm run build
sudo systemctl reload nginx
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `CORS error` | Update `CORS_ORIGIN` in backend `.env` to match exact frontend URL |
| `502 Bad Gateway` (CloudFront) | Check frontend ALB SG allows HTTP:80 from 0.0.0.0/0 |
| `Registration failed` | Check backend is running: `pm2 status` |
| Target group unhealthy | Check health check path `/health` for backend, `/` for frontend |
| Nginx 500 error | Run `chmod 755 /root` and `chmod -R 755 frontend/dist` |
| RDS connection failed | Check RDS SG allows port 3306 from backend EC2 SG |

---

## 👤 Author

**Ranjit Samal**
GitHub: [@Ranjit-08](https://github.com/Ranjit-08)

---

## 📄 License

MIT License — free to use and modify.
