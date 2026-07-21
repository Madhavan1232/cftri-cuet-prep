# 🌐 How to Deploy & Share the Dashboard with Your Friend

Here are the easiest, 100% free ways to deploy your app and get a live public URL (e.g. `https://cftri-cuet-prep.onrender.com`) to share with your friend.

---

## 🏆 Method 1: Render.com (Recommended Free Single-Service Deployment)

Render allows you to host both backend API & React frontend on a **single live URL** for free.

### Step 1: Create a Free MongoDB Database (MongoDB Atlas)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create Cluster** and select the **M0 Free Tier**.
3. Under **Database Access**, create a database username & password.
4. Under **Network Access**, click **Add IP Address** and choose `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** -> **Drivers** and copy your MongoDB connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/cftri_cuet_prep?retryWrites=true&w=majority
   ```

### Step 2: Push Project to GitHub
1. Create a new repository on [GitHub](https://github.com).
2. Push your project code:
   ```bash
   git init
   git add .
   git commit -m "Deploy CFTRI & CUET Exam Prep Dashboard"
   git branch -M main
   git remote add origin https://github.com/your-username/cftri-cuet-prep.git
   git push -u origin main
   ```

### Step 3: Deploy on Render.com
1. Go to [render.com](https://render.com) and log in with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect your `cftri-cuet-prep` GitHub repository.
4. Fill in the build & start settings:
   - **Name**: `cftri-cuet-prep` (or any custom name)
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Scroll down to **Environment Variables** and add:
   - `MONGO_URI` = *(your MongoDB Atlas connection string from Step 1)*
   - `NODE_ENV` = `production`
6. Click **Create Web Service**.

🎉 **Done!** Render will build the app and give you a live link like `https://cftri-cuet-prep.onrender.com` that you can send to your friend!

---

## 🚀 Method 2: Local Network Access (Share on Same Wi-Fi instantly)

If your friend is connected to the same Wi-Fi network as you, you can share access immediately without cloud hosting!

1. Open your terminal and run `ipconfig` (on Windows) to find your IPv4 Address (e.g., `192.168.1.15`).
2. Run `start_app.bat` on your laptop.
3. Your friend can open their phone or laptop browser and go to:
   ```
   http://192.168.1.15:3000
   ```
