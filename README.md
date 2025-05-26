# 🌐 Fullstack File Sharing App

This is a fullstack project built with:

- **Frontend**: React.js (with Redux Toolkit)
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (hosted on Railway)
- **File Uploads**: Multer middleware
- **Rich Text**: TipTap editor
- **File Sharing**: Email-based + public link sharing



------------------------------------------------------------
## Project Structure:

/backend       --> Express API (Node.js)
/frontend      --> React client with Redux
README.txt     --> Project documentation and setup guide
.env           --> Environment configuration file (not committed)

------------------------------------------------------------
## Requirements:

- Node.js (v18+ recommended)
- PostgreSQL Database
- npm or yarn

------------------------------------------------------------
## 🚀 Getting Started

1. Clone the repository:

   git clone https://github.com/yourusername/spotdraft.git
   cd spotdraft
   
3. Create .env files:

   In the /backend folder, create a `.env` file with the following:
     PORT=5000
     DATABASE_URL=postgresql://your_user:your_pass@your_host:5432/your_db
     JWT_SECRET=your_jwt_secret

   In the /frontend folder, create a `.env` file with the following:
     REACT_APP_API_BASE_URL=http://localhost:5000

4. Install dependencies:

   For the backend:
     cd backend
     npm install

   For the frontend:
     cd ../frontend
     npm install

5. Run the app:

   Start the backend server:
     cd backend
     npm run dev

   Start the frontend dev server:
     cd ../frontend
     npm start

   The frontend will be accessible at:
     http://localhost:3000

------------------------------------------------------------
## Key Features:

- User Authentication with JWT
- File upload to PostgreSQL (stored as binary)
- File sharing via email and public links
- Rich text editor for file annotations (TipTap)
- Permissions management for shared files
- Redux state management for authentication

![image](https://github.com/user-attachments/assets/d9b99738-7ed0-43aa-9631-ba3a7341aa7a)


------------------------------------------------------------
## API Endpoints Summary:

POST   /api/auth/signup           - Register a new user
POST   /api/auth/login            - Login and receive JWT
POST   /api/files/upload          - Upload a new file
GET    /api/files                 - Retrieve all files for the user
POST   /api/files/share           - Share a file via email/public link
GET    /api/files/:id/download    - Download a specific file

------------------------------------------------------------
## Deployment Notes:


- Backend can be hosted on Railway (https://railway.app)
- Frontend can be deployed on Netlify or Vercel
- Make sure to configure CORS in the backend
- Environment variables should be added in the dashboard of the host

------------------------------------------------------------
## Contributing:

Pull requests are welcome. Open an issue to discuss any major changes
beforehand. Contributions should follow consistent code style and logic.

------------------------------------------------------------
## License:

This project is licensed under the MIT License.

------------------------------------------------------------
## Author:


Created by @meghna70
