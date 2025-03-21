# Deploying Your Agile Project Management App to GitHub Pages

This guide walks you through deploying your application to GitHub Pages so that you can share it with others using a public URL.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (for example, "agile-project-management")
4. Keep it public if you want others to see your code
5. Do not initialize with a README, .gitignore, or license (we'll push your existing code)
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands to push your existing code. Since we've already initialized git locally, run these commands in your terminal:

```bash
# Add all your files to git
git add .

# Commit your changes
git commit -m "Initial commit of Agile Project Management app"

# Add the GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/agile-project-management.git

# Push your code to GitHub
git push -u origin main
```

Note: Replace `YOUR_USERNAME` with your actual GitHub username and `agile-project-management` with your repository name if different.

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to the "GitHub Pages" section (or click "Pages" in the left sidebar)
4. Under "Source", select "main" branch
5. Click "Save"

GitHub will process your request and provide a URL where your site is published (typically `https://YOUR_USERNAME.github.io/agile-project-management/`).

## Step 4: Verify Deployment

1. Wait a few minutes for GitHub to deploy your site
2. Visit the provided URL to make sure everything works correctly
3. Share this URL with anyone you want to show your app to!

## Updating Your Deployed App

Whenever you make changes to your app and want to update the deployed version:

```bash
git add .
git commit -m "Description of your changes"
git push
```

GitHub Pages will automatically update with your new changes within a few minutes.

## Troubleshooting

- If your site doesn't appear, check that GitHub Pages is configured correctly
- Make sure all file paths in your HTML and JavaScript files are relative, not absolute
- Check that all resource URLs (CSS, JavaScript) are correctly linked
- If you see 404 errors, verify that all files are properly committed to your repository 