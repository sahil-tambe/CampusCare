# CampusCare : College Lost & Found Management System

A web-based Lost and Found Management System designed to help college students report, discover, and recover lost belongings through a centralized platform.

<p align="center">
  <a href="https://campuscare-163f8.web.app">
    <strong>🌐 Live Demo</strong>
  </a>
</p>

## 📌 About the Project

CampusCare is a college-focused Lost and Found Management System developed as an MCA academic project.

Losing personal belongings on campus can be frustrating, while managing found items and verifying ownership can be challenging. CampusCare addresses this problem by providing a centralized platform where students can report lost or found items, browse available reports, and submit claims.

The system also provides dedicated dashboards for administrators and recovery officers to manage reports, review claims, and maintain recovery records.

## ✨ Features

### 👨‍🎓 Student Features
- **Authentication:** Register and log in using institutional email addresses.
- **Email Verification:** Verify student accounts through email authentication.
- **Report Lost Items:** Submit reports for belongings that have been lost.
- **Report Found Items:** Register items found on campus.
- **Image Uploads:** Attach optional item photographs to reports.
- **Browse Items:** Explore reported lost and found items.
- **Search & Filter:** Filter reports by item type and category.
- **Submit Claims:** Submit claims for found belongings.
- **My Claims:** Track submitted claims and their status.
- **My Reports:** View previously submitted item reports.

### 🛡️ Administrator Features
- View dashboard statistics.
- Manage all lost and found reports.
- Review and approve or reject claims.
- Update item statuses.
- View registered users.
- Search and filter user records.

### 🔎 Recovery Officer Features
- Dedicated recovery officer dashboard.
- View and manage reported items.
- Review student claims.
- Mark items as recovered or close reports.
- Access recovery records.

### 🔐 Security Features
- Firebase Authentication.
- Email verification.
- Role-based access control.
- Firestore Security Rules.
- Protected dashboards and restricted operations.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and layout |
| JavaScript | Application logic and interactions |
| Bootstrap 5 | Responsive UI components |
| Firebase Authentication | User authentication and email verification |
| Cloud Firestore | NoSQL database |
| Firebase Hosting | Website deployment |

## 🏗️ System Architecture

CampusCare follows a client-side web architecture integrated with Firebase backend services.

```text
                 CampusCare
                      |
             HTML, CSS, JavaScript
                      |
              Firebase Services
                      |
          +-----------+-----------+
          |                       |
   Firebase Auth            Cloud Firestore
          |                       |
   User Authentication     Application Data
   Email Verification      Users
   Session Management      Items
                           Claims
                      |
               Firebase Hosting
                      |
                Live Website
```

## 👥 User Roles

CampusCare supports three user roles:

| Role | Responsibilities |
|---|---|
| Student | Report items, browse reports, submit and track claims |
| Administrator | Manage users, reports, claims and system activities |
| Recovery Officer | Manage item recovery, review claims and maintain recovery records |

Administrative roles are assigned through the Firebase database by an authorized administrator.

## 🗄️ Database Structure

CampusCare uses Cloud Firestore as its NoSQL database.

The main collections are:

| Collection | Description |
|---|---|
| `users` | Stores user profiles and assigned roles |
| `items` | Stores lost and found item reports, including optional image data |
| `claims` | Stores student claims and their review information |

### Item Statuses
- `open`
- `recovered`
- `closed`

### Claim Statuses
- `pending`
- `approved`
- `rejected`

## 🚀 Getting Started

Follow these instructions to run CampusCare locally.

### Prerequisites

- A modern web browser.
- Visual Studio Code or another code editor.
- Firebase account.
- Firebase project with Authentication and Cloud Firestore enabled.
- Live Server extension or another local HTTP server.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CampusCare.git
```

### 2. Navigate to the Project

```bash
cd CampusCare
```

### 3. Configure Firebase

Create a Firebase project through the [Firebase Console](https://console.firebase.google.com/).

Enable the following services:

- Firebase Authentication – Email/Password provider.
- Cloud Firestore Database.

Copy `firebase-config.example.js` to `firebase-config.js`, then add your Firebase Web App configuration to `firebase-config.js`.

`firebase-config.js` is ignored by Git and must not be committed. Firebase web API keys are client-side identifiers rather than server secrets, but restrict them in Google Cloud and apply appropriate Firebase Security Rules before using the application.

### 4. Run the Application

Open the project folder in Visual Studio Code.

Use the Live Server extension to launch `index.html`.

Alternatively, run a local HTTP server that supports JavaScript ES modules.

### 5. Access the Application

Open the local URL provided by your development server.

## 🌐 Live Deployment

CampusCare is deployed using Firebase Hosting.

**Live Application:**  
https://campuscare-163f8.web.app

## 📂 Project Structure

```text
CampusCare/
│
├── index.html
├── login.html
├── signup.html
├── dashboard.html
│
├── report-item.html
├── browse-items.html
├── claim-item.html
├── my-claims.html
├── my-reports.html
│
├── admin-dashboard.html
├── officer-dashboard.html
├── manage-claims.html
├── manage-items.html
├── recovery-records.html
├── manage-users.html
│
├── style.css
├── script.js
│
├── firebase.json
├── .firebaserc
└── README.md
```

## 🔮 Future Improvements

Potential enhancements for future versions include:

- Advanced search functionality.
- Real-time notifications for claim updates.
- Improved item discovery and matching.
- More detailed reporting and analytics.
- Enhanced user experience and accessibility.

## 🎓 Project Information

**Project Name:** CampusCare  
**Application:** College Lost & Found Management System

CampusCare is an independently developed academic project and is not an official institutional platform.

## 📄 License

This project is available for educational and learning purposes. A formal open-source license can be added to define permissions for reuse and distribution.

---

**Built with the goal of making lost and found management easier on campus.**
