# Enabling GitHub Pages for Your Repository

Your code has been successfully pushed to GitHub! Now you need to enable GitHub Pages to make your website publicly accessible.

## Follow these steps:

1. Go to your repository on GitHub: https://github.com/jdwright10/agile-project-management

2. Click on the **Settings** tab (it's in the top navigation bar)

3. In the left sidebar, scroll down and click on **Pages** (under "Code and automation" section)

4. Under "Branch", select **main** from the dropdown menu and keep **/(root)** as the folder, then click **Save**

5. Wait a few minutes, then refresh the page. You should see a message that says:
   "Your site is published at https://jdwright10.github.io/agile-project-management/"

6. Click on that URL to view your published website!

## Your Website URL

Once published, your website will be available at:
**https://jdwright10.github.io/agile-project-management/**

## Troubleshooting

- It may take up to 10 minutes for your site to be published after enabling GitHub Pages
- If your site doesn't appear, make sure all file paths in your HTML files use relative paths
- Check that you've selected the right branch in the GitHub Pages settings
- Ensure that your repository is public, or that you have GitHub Pro for private repository deployment

## Updating Your Site

Whenever you make changes to your site, simply:

```bash
git add .
git commit -m "Description of your changes"
git push
```

GitHub Pages will automatically update with your new changes within a few minutes. 