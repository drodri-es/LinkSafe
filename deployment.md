# Deployment Guide for LinkSafe

This guide provides step-by-step instructions for deploying the LinkSafe application from a GitHub repository using Firebase App Hosting.

## Prerequisites

Before you begin, ensure you have the following installed and set up:

1.  **Node.js**: [Download and install Node.js](https://nodejs.org/) (LTS version is recommended).
2.  **Firebase CLI**: Install the Firebase command-line tools globally by running:
    ```bash
    npm install -g firebase-tools
    ```
3.  **Google Account**: To create and manage Firebase projects.
4.  **GitHub Account**: To host your application's source code.

## Step 1: Set Up Your Firebase Project

1.  **Create a Firebase Project**:
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the on-screen instructions to create a new project.

2.  **Upgrade to the Blaze Plan**:
    *   Firebase App Hosting requires your project to be on the "Blaze (Pay as you go)" plan.
    *   In your new project, click the gear icon next to "Project Overview" and select "Usage and billing".
    *   Select the "Blaze" plan and follow the prompts to set up a billing account.

3.  **Enable Required Services**:
    *   **Authentication**: In the Firebase Console, navigate to "Authentication" (under the "Build" menu) and click "Get started". Enable the "Email/Password" sign-in provider.
    *   **Firestore**: Navigate to "Firestore Database" (under the "Build" menu) and click "Create database". Start in **production mode** and choose a location for your database.

4.  **Set Up Firestore Security Rules**:
    *   Go to the "Rules" tab within Firestore.
    *   Copy the contents of the `firestore.rules` file from your repository and paste them into the editor, replacing the default rules.
    *   Click "Publish".

## Step 2: Set Up Your GitHub Repository

1.  **Create a GitHub Repository**:
    *   Create a new repository on GitHub (it can be public or private).

2.  **Push Your Code**:
    *   Clone your new repository to your local machine.
    *   Copy all the project files (including `.github/workflows` if it exists) into the cloned repository.
    *   Commit and push the code to your GitHub repository.
    ```bash
    git add .
    git commit -m "Initial commit of LinkSafe application"
    git push origin main
    ```

## Step 3: Connect Firebase App Hosting to GitHub

1.  **Create an App Hosting Backend**:
    *   In the Firebase Console, go to "App Hosting" (under the "Build" menu).
    *   Click "Get started".
    *   You will be prompted to connect to GitHub. Authorize Firebase to access your repositories.

2.  **Configure the Backend**:
    *   **Repository**: Select the GitHub repository you just created.
    *   **Branch**: Choose the branch you want to deploy from (e.g., `main`).
    *   **Root Directory**: Leave this as the default (`/`).

3.  **Initial Deployment**:
    *   Firebase will automatically trigger the first deployment as soon as the backend is created. You can monitor the progress in the App Hosting dashboard.

## Step 4: Environment Variables (Important!)

The application needs Firebase configuration keys to connect to your project's services. These are stored as secrets in Firebase App Hosting.

1.  **Find Your Firebase Config**:
    *   In the Firebase Console, go to "Project Settings" (gear icon).
    *   Scroll down to the "Your apps" card. If you don't have a web app registered, create one.
    *   In the web app's settings, find the "Firebase SDK snippet" and select "Config".

2.  **The application code uses the following environment variables. Set them in the App Hosting backend settings:**

    *   `PROJECT_ID`
    *   `APP_ID`
    *   `STORAGE_BUCKET`
    *   `API_KEY`
    *   `AUTH_DOMAIN`
    *   `MESSAGING_SENDER_ID`

3.  **Update `src/lib/firebase.ts` and `src/ai/genkit.ts`**:
    *   Manually replace the placeholder values in these files with the actual values from your Firebase project's configuration. This is crucial for both client-side and server-side functionality.

## Step 5: Automatic Deployments

Once App Hosting is connected to your GitHub repository, deployments are fully automated.

*   **Push to Deploy**: Every time you push a new commit to your designated branch (`main`), a new deployment will be automatically triggered.
*   **Pull Requests**: When you open a pull request against the `main` branch, App Hosting will create a temporary preview URL for you to test the changes before merging.

Your site will be live at the URL provided in the Firebase App Hosting dashboard (e.g., `your-app-name.web.app`).