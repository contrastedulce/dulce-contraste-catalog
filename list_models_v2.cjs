const https = require('https');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const apiKeyLine = envContent.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
const apiKey = apiKeyLine.split('=')[1].split(',')[0].trim();

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models?key=${apiKey}`,
  method: 'GET'
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', d => { data += d; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const names = parsed.models.map(m => m.name.replace('models/', ''));
      fs.writeFileSync(path.join(process.cwd(), 'models_clean.txt'), names.join('\n'), 'utf8');
      console.log("Models found and saved to models_clean.txt");
    } catch (e) {
      console.error("Error parsing models:", e);
      console.log(data);
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
