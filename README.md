# Shopfinity 🛒

> A full-stack e-commerce platform with Customer, Seller & Admin roles.

---

## 📋 Prerequisites

- **Git** (to clone repo)  
- **Node.js & npm** (v16+)  
- **MongoDB Community Edition** (running locally)  
- **Cloudinary account** (for image uploads)

---

## 1. Clone & Inspect

```bash
git clone https://github.com/your-username/shopfinity.git
cd shopfinity
You should now see two folders:

bash
Copy
Edit
/backend
/frontend
2. Backend Setup
2.1 Install dependencies
bash
Copy
Edit
cd backend
npm install
2.2 Configure environment variables
Create a file backend/.env with:

ini
Copy
Edit
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopfinity
JWT_SECRET=some_long_random_string
MONGO_URI

mongodb://localhost:27017 is the default for a local MongoDB server

shopfinity is the database name

JWT_SECRET

Any long random string (used to sign your JSON Web Tokens)

2.3 Install & start MongoDB
Windows

Download & install MongoDB Community Edition from https://www.mongodb.com/try/download/community

In an elevated PowerShell:

powershell
Copy
Edit
net start MongoDB
macOS (with Homebrew)

bash
Copy
Edit
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
Linux (systemd)

bash
Copy
Edit
sudo apt install -y mongodb
sudo systemctl start mongodb
🔎 You can verify by opening MongoDB Compass and connecting to mongodb://localhost:27017. You should see the empty shopfinity database.

2.4 Run the backend
bash
Copy
Edit
npm run dev
You should see:

arduino
Copy
Edit
Server running on 5000
✅ Mongo connected
3. Cloudinary Setup
Go to https://cloudinary.com and sign up (or log in).

In the Dashboard you’ll see your Cloud name; copy it.

Navigate to Settings → Upload → Upload presets.

Click “Add upload preset”:

Give it a name, e.g. shopfinity_preset

Under Signing Mode, choose Unsigned

Save.

You’ll need two values:

Cloud name

Upload preset name

4. Frontend Setup
4.1 Install dependencies
Open a new terminal:

bash
Copy
Edit
cd ../frontend
npm install
4.2 Configure environment variables
Create frontend/.env with:

ini
Copy
Edit
# frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=shopfinity_preset
VITE_API_URL points to your backend’s /api root

VITE_CLOUDINARY_CLOUD_NAME & _UPLOAD_PRESET you got above

4.3 Run the frontend
bash
Copy
Edit
npm run dev
By default, Vite serves at http://localhost:5173.

