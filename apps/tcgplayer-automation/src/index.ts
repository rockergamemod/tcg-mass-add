import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

async function run() {
  const username = process.env.TCGPLAYER_USERNAME;
  const password = process.env.TCGPLAYER_PASSWORD;

  if (!username || !password) {
    throw new Error('TCGPLAYER_USERNAME or TCGPLAYER_PASSWORD not set in environment');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to TCGPlayer login...');
    await page.goto('https://store.tcgplayer.com/admin/pricing');

    // Handle login
    // Note: The actual selectors will need to be verified by the user or via observation
    console.log('Logging in...');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForURL('**/admin/**');
    console.log('Logged in successfully.');

    // Navigate to pricing export if not already there
    // The user mentioned "click on 'Export Filtered CSV'"
    console.log('Navigating to Export Filtered CSV section...');
    
    // This part is highly dependent on the actual page structure.
    // I'll use a generic approach of looking for the text.
    await page.getByText('Export Filtered CSV').click();

    // Fill out the form
    // Assuming there's a form that needs to be submitted.
    // We'll wait for the download event.
    console.log('Waiting for download...');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export' }).click(),
    ]);

    const downloadPath = path.join(process.cwd(), 'downloads', download.suggestedFilename());
    
    // Ensure downloads directory exists
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    await download.saveAs(downloadPath);
    console.log(`Download complete: ${downloadPath}`);

    return downloadPath;

  } catch (error) {
    console.error('An error occurred during the automation process:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  run()
    .then((downloadPath) => {
      console.log('Automation finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { run };
