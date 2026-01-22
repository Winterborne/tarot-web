#!/usr/bin/env tsx
/**
 * Downloads Rider-Waite-Smith tarot card images from sacred-texts.com
 * These images are in the public domain (1909 Pamela Coleman Smith deck)
 * Source: https://sacred-texts.com/tarot/xr/index.htm
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE_URL = 'https://sacred-texts.com/tarot/pkt/img';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'cards');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mapping from our card IDs to sacred-texts naming
const cardMappings = [
  // Major Arcana (ar00-ar21)
  { id: 'major-0', file: 'ar00.jpg', name: 'The Fool' },
  { id: 'major-1', file: 'ar01.jpg', name: 'The Magician' },
  { id: 'major-2', file: 'ar02.jpg', name: 'The High Priestess' },
  { id: 'major-3', file: 'ar03.jpg', name: 'The Empress' },
  { id: 'major-4', file: 'ar04.jpg', name: 'The Emperor' },
  { id: 'major-5', file: 'ar05.jpg', name: 'The Hierophant' },
  { id: 'major-6', file: 'ar06.jpg', name: 'The Lovers' },
  { id: 'major-7', file: 'ar07.jpg', name: 'The Chariot' },
  { id: 'major-8', file: 'ar08.jpg', name: 'Strength' },
  { id: 'major-9', file: 'ar09.jpg', name: 'The Hermit' },
  { id: 'major-10', file: 'ar10.jpg', name: 'Wheel of Fortune' },
  { id: 'major-11', file: 'ar11.jpg', name: 'Justice' },
  { id: 'major-12', file: 'ar12.jpg', name: 'The Hanged Man' },
  { id: 'major-13', file: 'ar13.jpg', name: 'Death' },
  { id: 'major-14', file: 'ar14.jpg', name: 'Temperance' },
  { id: 'major-15', file: 'ar15.jpg', name: 'The Devil' },
  { id: 'major-16', file: 'ar16.jpg', name: 'The Tower' },
  { id: 'major-17', file: 'ar17.jpg', name: 'The Star' },
  { id: 'major-18', file: 'ar18.jpg', name: 'The Moon' },
  { id: 'major-19', file: 'ar19.jpg', name: 'The Sun' },
  { id: 'major-20', file: 'ar20.jpg', name: 'Judgement' },
  { id: 'major-21', file: 'ar21.jpg', name: 'The World' },

  // Wands (wa)
  { id: 'wands-ace', file: 'waac.jpg', name: 'Ace of Wands' },
  { id: 'wands-2', file: 'wa02.jpg', name: 'Two of Wands' },
  { id: 'wands-3', file: 'wa03.jpg', name: 'Three of Wands' },
  { id: 'wands-4', file: 'wa04.jpg', name: 'Four of Wands' },
  { id: 'wands-5', file: 'wa05.jpg', name: 'Five of Wands' },
  { id: 'wands-6', file: 'wa06.jpg', name: 'Six of Wands' },
  { id: 'wands-7', file: 'wa07.jpg', name: 'Seven of Wands' },
  { id: 'wands-8', file: 'wa08.jpg', name: 'Eight of Wands' },
  { id: 'wands-9', file: 'wa09.jpg', name: 'Nine of Wands' },
  { id: 'wands-10', file: 'wa10.jpg', name: 'Ten of Wands' },
  { id: 'wands-page', file: 'wapa.jpg', name: 'Page of Wands' },
  { id: 'wands-knight', file: 'wakn.jpg', name: 'Knight of Wands' },
  { id: 'wands-queen', file: 'waqu.jpg', name: 'Queen of Wands' },
  { id: 'wands-king', file: 'waki.jpg', name: 'King of Wands' },

  // Cups (cu)
  { id: 'cups-ace', file: 'cuac.jpg', name: 'Ace of Cups' },
  { id: 'cups-2', file: 'cu02.jpg', name: 'Two of Cups' },
  { id: 'cups-3', file: 'cu03.jpg', name: 'Three of Cups' },
  { id: 'cups-4', file: 'cu04.jpg', name: 'Four of Cups' },
  { id: 'cups-5', file: 'cu05.jpg', name: 'Five of Cups' },
  { id: 'cups-6', file: 'cu06.jpg', name: 'Six of Cups' },
  { id: 'cups-7', file: 'cu07.jpg', name: 'Seven of Cups' },
  { id: 'cups-8', file: 'cu08.jpg', name: 'Eight of Cups' },
  { id: 'cups-9', file: 'cu09.jpg', name: 'Nine of Cups' },
  { id: 'cups-10', file: 'cu10.jpg', name: 'Ten of Cups' },
  { id: 'cups-page', file: 'cupa.jpg', name: 'Page of Cups' },
  { id: 'cups-knight', file: 'cukn.jpg', name: 'Knight of Cups' },
  { id: 'cups-queen', file: 'cuqu.jpg', name: 'Queen of Cups' },
  { id: 'cups-king', file: 'cuki.jpg', name: 'King of Cups' },

  // Swords (sw)
  { id: 'swords-ace', file: 'swac.jpg', name: 'Ace of Swords' },
  { id: 'swords-2', file: 'sw02.jpg', name: 'Two of Swords' },
  { id: 'swords-3', file: 'sw03.jpg', name: 'Three of Swords' },
  { id: 'swords-4', file: 'sw04.jpg', name: 'Four of Swords' },
  { id: 'swords-5', file: 'sw05.jpg', name: 'Five of Swords' },
  { id: 'swords-6', file: 'sw06.jpg', name: 'Six of Swords' },
  { id: 'swords-7', file: 'sw07.jpg', name: 'Seven of Swords' },
  { id: 'swords-8', file: 'sw08.jpg', name: 'Eight of Swords' },
  { id: 'swords-9', file: 'sw09.jpg', name: 'Nine of Swords' },
  { id: 'swords-10', file: 'sw10.jpg', name: 'Ten of Swords' },
  { id: 'swords-page', file: 'swpa.jpg', name: 'Page of Swords' },
  { id: 'swords-knight', file: 'swkn.jpg', name: 'Knight of Swords' },
  { id: 'swords-queen', file: 'swqu.jpg', name: 'Queen of Swords' },
  { id: 'swords-king', file: 'swki.jpg', name: 'King of Swords' },

  // Pentacles (pe)
  { id: 'pentacles-ace', file: 'peac.jpg', name: 'Ace of Pentacles' },
  { id: 'pentacles-2', file: 'pe02.jpg', name: 'Two of Pentacles' },
  { id: 'pentacles-3', file: 'pe03.jpg', name: 'Three of Pentacles' },
  { id: 'pentacles-4', file: 'pe04.jpg', name: 'Four of Pentacles' },
  { id: 'pentacles-5', file: 'pe05.jpg', name: 'Five of Pentacles' },
  { id: 'pentacles-6', file: 'pe06.jpg', name: 'Six of Pentacles' },
  { id: 'pentacles-7', file: 'pe07.jpg', name: 'Seven of Pentacles' },
  { id: 'pentacles-8', file: 'pe08.jpg', name: 'Eight of Pentacles' },
  { id: 'pentacles-9', file: 'pe09.jpg', name: 'Nine of Pentacles' },
  { id: 'pentacles-10', file: 'pe10.jpg', name: 'Ten of Pentacles' },
  { id: 'pentacles-page', file: 'pepa.jpg', name: 'Page of Pentacles' },
  { id: 'pentacles-knight', file: 'pekn.jpg', name: 'Knight of Pentacles' },
  { id: 'pentacles-queen', file: 'pequ.jpg', name: 'Queen of Pentacles' },
  { id: 'pentacles-king', file: 'peki.jpg', name: 'King of Pentacles' },
];

async function downloadImage(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => reject(err));
      });
    }).on('error', reject);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Downloading ${cardMappings.length} tarot card images...`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (const card of cardMappings) {
    const url = `${BASE_URL}/${card.file}`;
    const outputPath = path.join(OUTPUT_DIR, `${card.id}.jpg`);

    // Skip if already downloaded
    if (fs.existsSync(outputPath)) {
      console.log(`Skipping ${card.name} (already exists)...`);
      skipped++;
      continue;
    }

    try {
      console.log(`Downloading ${card.name} (${card.id})...`);
      await downloadImage(url, outputPath);
      succeeded++;
      // Add delay to avoid rate limiting (3 seconds between downloads)
      await delay(3000);
    } catch (error) {
      console.error(`Failed to download ${card.name}:`, error);
      failed++;
    }
  }

  console.log(`\nDownload complete!`);
  if (skipped > 0) {
    console.log(`⊘ ${skipped} cards already existed`);
  }
  console.log(`✓ ${succeeded} cards downloaded successfully`);
  if (failed > 0) {
    console.log(`✗ ${failed} cards failed to download`);
    process.exit(1);
  }
}

main().catch(console.error);
