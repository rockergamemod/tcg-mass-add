import { run } from './index';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from the automation app's .env
dotenv.config();

async function main() {
  try {
    console.log('Starting TCGPlayer automation...');
    const csvPath = await run();

    if (csvPath && fs.existsSync(csvPath)) {
      console.log(`CSV downloaded: ${csvPath}`);
      console.log('Starting ETL pipeline...');

      // The importer is in apps/backend/src/etl/tcgplayer/tcgplayer-importer.ts
      const backendDir = path.resolve(__dirname, '../../apps/backend');
      
      // Load backend's .env
      const backendEnvPath = path.join(backendDir, '.env');
      const backendEnv = fs.existsSync(backendEnvPath) ? dotenv.parse(fs.readFileSync(backendEnvPath)) as any : {};

      // Combine environment variables
      const combinedEnv = { ...process.env, ...dotenv.config().parsed, ...backendEnv };

      // Use npx ts-node to run the importer script.
      const command = `npx ts-node src/etl/tcgplayer/tcgplayer-importer.ts ${csvPath}`;
      
      console.log(`Executing in ${backendDir}: ${command}`);
      
      execSync(command, { 
        cwd: backendDir,
        stdio: 'inherit', 
        env: combinedEnv 
      });
      
      console.log('ETL pipeline completed successfully.');
    } else {
      console.error('CSV file not found. ETL pipeline aborted.');
      process.exit(1);
    }
  } catch (error) {
    console.error('An error occurred in the main orchestration flow:', error);
    process.exit(1);
  }
}

main();
