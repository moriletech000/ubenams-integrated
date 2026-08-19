# Neon Database Migration Guide

## Why Migrate to Neon?
- ✅ **Permanent free tier** (no 90-day expiration like Render)
- ✅ **10 GB storage** (vs Render's 1GB)
- ✅ **Better performance**
- ✅ **Automatic backups**
- ✅ **Your data will never be deleted**

---

## Step 1: Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** (top right)
3. Sign up with:
   - GitHub (recommended - fastest)
   - OR Google
   - OR Email

---

## Step 2: Create Your Database

1. After signing in, click **"Create a project"**
2. Fill in the details:
   - **Project name**: `ubenams-integrated` (or any name you like)
   - **PostgreSQL version**: Leave as default (latest version)
   - **Region**: Choose closest to your location:
     - **US East (Ohio)** - if you're in US/Americas
     - **Europe (Frankfurt)** - if you're in Europe/Africa
     - **Asia Pacific (Singapore)** - if you're in Asia
   - Click **"Create Project"**

---

## Step 3: Get Your Connection String

1. After project creation, you'll see a **Connection Details** screen
2. Look for **"Connection string"** section
3. Select the **"Pooled connection"** tab (recommended for Node.js)
4. Copy the connection string - it looks like:
   ```
   postgres://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
5. **SAVE THIS STRING** - you'll need it in the next step

---

## Step 4: Update Your Render Backend

### Option A: Update via Render Dashboard (Easiest)

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your **backend service** (ubenams-integrated-backend or similar)
3. Click **"Environment"** tab (left sidebar)
4. Find the **`DATABASE_URL`** variable
5. Click **"Edit"** (pencil icon)
6. **Replace the old Render database URL** with your **new Neon connection string**
7. Click **"Save Changes"**
8. **Important**: Click **"Manual Deploy"** → **"Deploy latest commit"** to restart with new database

### Option B: Update via .env File (If you redeploy from GitHub)

1. Update your `.env.example` file:
   ```env
   # Neon Database Connection
   DATABASE_URL=postgres://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
   
   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Admin Credentials
   ADMIN_EMAIL=admin@ubenams.com
   ADMIN_PASSWORD=your-secure-password
   
   # Frontend URL
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

---

## Step 5: Initialize Your Neon Database

### Method 1: Run Setup Script (Recommended)

1. Open your terminal in the backend folder:
   ```bash
   cd backend
   ```

2. Set your Neon DATABASE_URL temporarily (for setup only):
   ```bash
   # Windows Command Prompt
   set DATABASE_URL=postgres://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
   
   # Windows PowerShell
   $env:DATABASE_URL="postgres://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require"
   
   # Mac/Linux
   export DATABASE_URL="postgres://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

3. Run the database setup:
   ```bash
   node setup.js
   ```

4. You should see:
   ```
   ✓ Database tables created successfully
   ✓ Admin user created successfully
   ✓ Database setup completed!
   ```

### Method 2: Manual SQL Execution (Alternative)

1. Go to Neon dashboard
2. Click **"SQL Editor"** in your project
3. Copy and paste the entire contents of `backend/database.sql`
4. Click **"Run"** to execute

---

## Step 6: Verify Migration

### Test Your Backend

1. Visit your Render backend URL:
   ```
   https://your-backend-name.onrender.com/api/test
   ```
   
2. You should see:
   ```json
   {
     "message": "Backend is running",
     "timestamp": "2025-01-09T..."
   }
   ```

### Test Database Connection

1. Try logging in to your admin dashboard:
   - Go to your website: `https://your-frontend.onrender.com/admin-login.html`
   - Email: `admin@ubenams.com` (or the admin email you set)
   - Password: (your admin password)

2. If login works → Database is connected! ✅

---

## Step 7: Migrate Existing Data (If You Have Data)

### If you already have users/orders in Render database:

1. **Export data from Render** (do this BEFORE it expires):
   ```bash
   # Install PostgreSQL tools if you don't have them
   # Then run:
   pg_dump "YOUR_OLD_RENDER_DATABASE_URL" > backup.sql
   ```

2. **Import to Neon**:
   ```bash
   psql "YOUR_NEW_NEON_DATABASE_URL" < backup.sql
   ```

3. **Alternatively**: Use a database GUI tool like:
   - **DBeaver** (free, recommended)
   - **pgAdmin**
   - **TablePlus**

---

## Step 8: Update Your Local Development

1. Open your local `backend/.env` file
2. Update the DATABASE_URL:
   ```env
   DATABASE_URL=postgres://username:password@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

3. Test locally:
   ```bash
   cd backend
   npm start
   ```

---

## Troubleshooting

### Issue: "Connection timeout" or "Cannot connect"

**Solution**: Check your connection string format. It should have `?sslmode=require` at the end:
```
postgres://username:password@host/database?sslmode=require
```

### Issue: "Database not found"

**Solution**: Make sure you copied the **pooled connection** string from Neon, not the direct connection.

### Issue: "Tables not found"

**Solution**: You forgot to run `setup.js` or execute `database.sql`. Go back to Step 5.

### Issue: "Admin login doesn't work"

**Solution**: 
1. Check that you ran `setup.js` successfully
2. Make sure ADMIN_EMAIL and ADMIN_PASSWORD environment variables are set on Render
3. Try running `node setup-auth.js` to recreate the admin user

---

## Monitoring Your Neon Database

### Check Database Usage

1. Go to Neon dashboard
2. Click on your project
3. View **"Usage"** tab to see:
   - Storage used
   - Compute hours used
   - Data transfer

### Free Tier Limits

- **Storage**: 10 GB (plenty for your shop)
- **Compute hours**: 300 hrs/month (191 hours always-on is allowed)
- **Data transfer**: 5 GB/month

**Your e-commerce site will easily stay within these limits!**

---

## Benefits After Migration

✅ **No more 90-day expiration**
✅ **Your data is permanent**
✅ **Better performance**
✅ **More storage space**
✅ **Automatic backups**
✅ **Peace of mind for your business**

---

## Need Help?

If you encounter any issues during migration:

1. **Check Neon status**: [https://neonstatus.com](https://neonstatus.com)
2. **Neon docs**: [https://neon.tech/docs](https://neon.tech/docs)
3. **Contact me** for assistance

---

## Summary Checklist

- [ ] Created Neon account
- [ ] Created new project/database
- [ ] Copied connection string (pooled)
- [ ] Updated DATABASE_URL on Render
- [ ] Redeployed Render backend
- [ ] Ran setup.js to create tables
- [ ] Tested admin login
- [ ] Updated local .env file
- [ ] Verified everything works

**Once completed, your database will last forever on the free tier! 🎉**
