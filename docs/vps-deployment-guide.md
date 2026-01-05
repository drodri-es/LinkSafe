# VPS Deployment Guide for LinkSafe

This guide provides step-by-step instructions for deploying the LinkSafe Next.js application to a Virtual Private Server (VPS) running a Linux distribution like Ubuntu.

This setup uses **Nginx** as a reverse proxy and **PM2** as a process manager to keep your application running continuously.

---

## Prerequisites

1.  **A VPS**: A server from any cloud provider (e.g., DigitalOcean, Vultr, Linode, AWS EC2) with root/sudo access. Ubuntu 22.04 LTS is a good choice.
2.  **Node.js**: Your server needs Node.js. Version 20.x or later is recommended.
3.  **Domain Name (Optional)**: If you want to access your app via a custom domain (e.g., `www.your-linksafe-app.com`).

---

## Step 1: Prepare Your Server

Connect to your VPS via SSH and perform these initial setup steps.

### 1.1. Install Node.js

We'll use `nvm` (Node Version Manager) to easily install and manage Node.js versions.

```bash
# Update package lists
sudo apt update

# Install curl to download nvm
sudo apt install curl -y

# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm into the current shell session
# You may need to close and reopen your terminal for this to take effect
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install a recent LTS version of Node.js
nvm install 20

# Verify installation
node -v # Should output v20.x.x
npm -v  # Should output a version number
```

### 1.2. Install PM2 Process Manager

PM2 is a production process manager for Node.js applications that will keep your app online, automatically restart it if it crashes, and manage logs.

```bash
# Install PM2 globally using npm
npm install pm2 -g
```

### 1.3. Install Nginx Web Server

Nginx will act as a "reverse proxy." It listens for public web traffic (on ports 80 for HTTP and 443 for HTTPS) and forwards it to your Next.js application, which will be running on a local port (e.g., 3000).

```bash
# Install Nginx
sudo apt install nginx -y

# Allow Nginx through the firewall
sudo ufw allow 'Nginx Full'
```

---

## Step 2: Deploy Your Application Code

### 2.1. Clone the Repository

Clone your project from GitHub onto your VPS. Store your projects in a directory like `/var/www`.

```bash
# Create a directory for your projects
sudo mkdir -p /var/www/linksafe
sudo chown $USER:$USER /var/www/linksafe

# Clone your project into the new directory
git clone <your_github_repository_url> /var/www/linksafe

# Navigate into your project folder
cd /var/www/linksafe
```

### 2.2. Install Dependencies

```bash
npm install
```

### 2.3. Set Up Environment Variables

Your application needs Firebase configuration keys to run. Instead of hard-coding them, you should use environment variables.

1.  **Create a `.env.local` file** in your project root (`/var/www/linksafe`).

    ```bash
    nano .env.local
    ```

2.  **Get Your Firebase Config**: Go to your Firebase Console -> Project Settings -> Your Apps -> SDK setup and configuration, and select "Config".

3.  **Add the variables** to the `.env.local` file. Your server-side code will automatically load these during the build and runtime.

    ```ini
    # Firebase public config
    NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="12345..."
    NEXT_PUBLIC_FIREBASE_APP_ID="1:12345...:web:..."

    # The port your Next.js app will run on. Nginx will forward to this.
    PORT=3000
    ```
    *Note: For the Next.js App router, environment variables need to be prefixed with `NEXT_PUBLIC_` to be available on the client side.*

### 2.4. Build the Application

Create a production-optimized build of your Next.js app.

```bash
npm run build
```

---

## Step 3: Run the Application with PM2

Now, start your built application using PM2.

```bash
# Start the app with a name
pm2 start npm --name "linksafe" -- start

# Tell PM2 to automatically restart on server reboots
pm2 startup

# Follow the on-screen instructions, which will look something like:
# sudo env PATH=$PATH:/home/user/.nvm/versions/node/v20.x.x/bin /home/user/.nvm/versions/node/v20.x.x/lib/node_modules/pm2/bin/pm2 startup systemd -u user --hp /home/user

# Save the current process list
pm2 save
```

You can check the status and logs of your app with `pm2 status` and `pm2 logs linksafe`.

---

## Step 4: Configure Nginx as a Reverse Proxy

Create an Nginx server block file for your application.

### 4.1. Create Nginx Configuration File

```bash
# Create a new config file
sudo nano /etc/nginx/sites-available/linksafe

# Paste the following configuration, replacing your_domain.com with your actual domain
# If you don't have a domain, you can use your server's IP address.
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    location / {
        proxy_pass http://localhost:3000; # The port must match the PORT in .env.local
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.2. Enable the Site

```bash
# Create a symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/linksafe /etc/nginx/sites-enabled/

# Test for syntax errors
sudo nginx -t

# If syntax is OK, restart Nginx
sudo systemctl restart nginx
```

Your application should now be accessible via your domain or IP address!

---

## Step 5: (Recommended) Set Up SSL with Let's Encrypt

To secure your site with a free SSL certificate:

```bash
# Install Certbot, the Let's Encrypt client
sudo apt install certbot python3-certbot-nginx -y

# Run Certbot and follow the prompts
# Replace your_domain.com with your actual domain
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

Certbot will automatically obtain the certificate and update your Nginx configuration to handle HTTPS traffic.

---

## Maintaining Your Deployment

To deploy updates:
1.  SSH into your server.
2.  `cd /var/www/linksafe`
3.  `git pull`
4.  `npm install` (if dependencies changed)
5.  `npm run build`
6.  `pm2 restart linksafe`
