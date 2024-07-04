### Sonarcloud API - Hotspots and Vulnerabilities

This provides functionality for printing out information from Sonarcloud.io. Information includes:
- Open vulnerabilities
- Open security hotspots


## How to use

1) Create a config.json file in `src/config`. This should match the example in `src/config/config-template.json`

2) Add project keys that you wish to be analysed into the config.json file

3) Add your Sonar API token to your environment variables:

```bash
export SONAR_TOKEN = <sonar token>
```

4) Install dependencies
```bash
npm install
```

5) Generate output
```bash
npm run sonar
```

6) Run tests
```bash
npm run test
```

7) Run formatter
```bash
npm run format
```