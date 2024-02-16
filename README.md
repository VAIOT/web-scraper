<div align="center">
    <img src="assets/vaiotLogo.svg" alt="VAIOT Logo" width="400"/>
</div>

</br>
</br>

# VAIOT web scraper

This web scraper is designed to extract data from websites by simulating user interaction with a headless browser. It can be used for various scraping tasks such as fetching whole page contents, extracting articles, or gathering data for analysis.

## Installation
```bash
git clone https://github.com/VAIOT/web-scraper.git
cd web-scraper
npm i
```

### Local Development
```bash
npm run build
npm run start
```

### Manual deployment to Azure Functions App
1. Download Chrome Shell from https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/120.0.6099.109/linux64/chrome-headless-shell-linux64.zip
2. Copy contents of the downloaded archive to ``chrome/chrome-headless-shell-linux64``
3. Run ``npm run build``
4. Deploy to azure using func azure functionapp publish ``<function name>``

## Usage
To use the web scraper API, send a GET request to the endpoint with ```page``` parameter.
```bash
https://your_function.azurewebsites.net/api/scraper?page=https://example.com
```

Page parameter specifies the URL of the web page you want to scrape. You can also include additional parameters in the URL as needed.

### Response
The API will return the content of the scraped web page as plain text.

## Testing

Run the unit tests to ensure code reliability:

```bash
npm run test
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
