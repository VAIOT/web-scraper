# vaiot web scraper 2023

To deploy on Azure Functions App:
1. Download Chrome Shell from https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/120.0.6099.109/linux64/chrome-headless-shell-linux64.zip (Linux only)
2. Copy the contents of the downloaded archive to cache/puppeteer/chrome-headless-shell-linux64
3. Run npm run build
4. Deploy to azure using func azure functionapp publish vaiot-webscraper (this is a prod environment)