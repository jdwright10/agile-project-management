# Agile Project Management App

A modern web application for managing agile projects, sprints, and teams.

## Features

- **Dashboard**: Overview of project statuses, timelines, and team velocities
- **Project Management**: Track multiple projects with detailed status reporting
- **Sprint Board**: Kanban-style board for managing sprint tasks and user stories
- **Backlog Management**: Organize and prioritize your product backlog
- **Team Management**: Assign tasks to team members and track performance
- **Executive Reports**: Visual reports for stakeholders with key metrics

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Font Awesome

## Getting Started

### Running Locally

1. Clone this repository to your local machine
2. Navigate to the project directory
3. Start a local HTTP server:

```bash
# Option 1: Use our provided script
./start-server.sh

# Option 2: Use Python directly
python3 -m http.server
```

4. Open your browser and navigate to `http://localhost:8000`

## Deploying to Share with Others

This app can be easily deployed to the web so you can share it with others.

We've provided multiple deployment options:

### 1. Netlify Drop (Easiest)

Simply drag and drop your project folder onto [Netlify Drop](https://app.netlify.com/drop) to get an instant public URL.

### 2. GitHub Pages

If you have a GitHub account, you can deploy using GitHub Pages for ongoing development.

### 3. Local Network Sharing

Share with people on the same network by running the local server.

For complete deployment instructions, see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Overview of all deployment options
- [netlify-deployment.md](netlify-deployment.md) - Netlify Drop instructions
- [deploy-instructions.md](deploy-instructions.md) - GitHub Pages instructions

## Helper Scripts

We've included several helper scripts to make deployment easier:

- `start-server.sh` - Starts a local HTTP server
- `find-ip.sh` - Finds your local IP address for network sharing
- `git-setup.sh` - Helps configure git for GitHub deployment

Make the scripts executable before running:
```bash
chmod +x *.sh
```

## Directory Structure

- `index.html` - Main dashboard page
- `src/` - Source code directory
  - `app.js` - Main JavaScript file
  - `styles/` - CSS stylesheets
  - `pages/` - HTML pages for different views
    - `backlog.html` - Product backlog management
    - `sprints.html` - Sprint board and planning
    - `teams.html` - Team management
    - `projects.html` - Project overview
    - `reports.html` - Executive reporting dashboard

## License

This project is available for personal and educational use.

## Acknowledgments

- Bootstrap for the responsive UI components
- Font Awesome for the icon set 