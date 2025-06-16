# TeamCode Hub

TeamCode Hub is a collaborative online coding platform for teams. It features real-time code editing, project management, chat, terminal/runner support for multiple languages, and seamless GitHub integration.

---

## Features

- **Real-time Collaboration:** Edit code together with your team in a VS Code-like environment.
- **Multi-language Support:** Run code in JavaScript, Python, C++, and Java.
- **Project & File Management:** Create, rename, and delete files in your projects.
- **Integrated Terminal:** Execute code and commands directly in the browser.
- **Chat Panel:** Communicate with your team in real time.
- **GitHub Integration:** Create repos and push code directly from the app.
- **Beautiful UI:** Modern, responsive interface with interactive backgrounds.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Three.js (for backgrounds)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** GitHub OAuth
- **Real-time:** Socket.io

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- [Optional] G++, Python, and Java installed for code execution

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/teamcode-hub.git
cd teamcode-hub
```

### 2. Setup Environment Variables

Create a `.env` file in `backend/` with:

```
MONGODB_URI=your_mongodb_connection_string
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_session_secret
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run the App

**Start Backend:**

```bash
cd backend
npm start
```

**Start Frontend:**

```bash
cd ../frontend
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

- **Login:** Use GitHub OAuth to sign in.
- **Create Project:** Add a new project and invite team members.
- **Edit & Run Code:** Open files, edit, and run code in supported languages.
- **Chat:** Use the chat panel for team communication.
- **GitHub:** Create and push to GitHub repos from the UI.

---

## Folder Structure

```
TeamCodeHub/
  backend/
    controllers/
    models/
    routes/
    server.js
    .env
    ...
  frontend/
    src/
      components/
      pages/
      index.css
      App.jsx
    public/
      logo.svg
    ...
```

---

## Notes

- For C++/Java/Python code execution, make sure the respective compilers/interpreters are installed and available in your system PATH.
- On Windows, C++ executables are run as `main.exe`, on Linux/macOS as `./main`.
- GitHub integration requires valid OAuth credentials.

---

## License

MIT

---

## Credits

Built by the TeamCode Hub team, 2025.
