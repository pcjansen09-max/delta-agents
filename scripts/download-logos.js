const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS = [
  { name: 'whatsapp', url: 'https://cdn.simpleicons.org/whatsapp/25D366' },
  { name: 'gmail', url: 'https://cdn.simpleicons.org/gmail/EA4335' },
  { name: 'googlecalendar', url: 'https://cdn.simpleicons.org/googlecalendar/4285F4' },
  { name: 'microsoftoutlook', url: 'https://cdn.simpleicons.org/microsoftoutlook/0078D4' },
  { name: 'slack', url: 'https://cdn.simpleicons.org/slack/4A154B' },
  { name: 'zapier', url: 'https://cdn.simpleicons.org/zapier/FF4A00' },
  { name: 'stripe', url: 'https://cdn.simpleicons.org/stripe/635BFF' },
  { name: 'shopify', url: 'https://cdn.simpleicons.org/shopify/96BF48' },
  { name: 'hubspot', url: 'https://cdn.simpleicons.org/hubspot/FF7A59' },
  { name: 'notion', url: 'https://cdn.simpleicons.org/notion/000000' },
  { name: 'mollie', url: 'https://cdn.simpleicons.org/mollie/000000' },
  { name: 'googledrive', url: 'https://cdn.simpleicons.org/googledrive/4285F4' },
  { name: 'moneybird', url: 'https://cdn.simpleicons.org/moneybird/1AB5C1' },
];

const DIR = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

function download(name, url) {
  return new Promise((resolve) => {
    const file = path.join(DIR, `${name}.svg`);
    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          const stream = fs.createWriteStream(file);
          res2.pipe(stream);
          stream.on('finish', () => { console.log(`✓ ${name}.svg`); resolve(); });
          stream.on('error', () => { console.log(`✗ ${name}.svg (write error)`); resolve(); });
        }).on('error', () => { console.log(`✗ ${name}.svg (redirect error)`); resolve(); });
        return;
      }
      const stream = fs.createWriteStream(file);
      res.pipe(stream);
      stream.on('finish', () => { console.log(`✓ ${name}.svg`); resolve(); });
      stream.on('error', () => { console.log(`✗ ${name}.svg (write error)`); resolve(); });
    });
    req.on('error', () => { console.log(`✗ ${name}.svg (request error)`); resolve(); });
    req.setTimeout(8000, () => { req.destroy(); console.log(`✗ ${name}.svg (timeout)`); resolve(); });
  });
}

(async () => {
  console.log('Downloading logos...');
  for (const { name, url } of LOGOS) {
    await download(name, url);
  }
  console.log('Done.');
})();
