#!/usr/bin/env tsx
/**
 * Copies tarot card images from the cloned GitHub repository
 * Maps from GitHub naming (maj00.jpg, cups01.jpg) to our naming (major-0.jpg, cups-ace.jpg)
 */

import fs from 'fs';
import path from 'path';

const SOURCE_DIR = '/tmp/tarot/img/big';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'cards');

// Mapping from GitHub naming to our card IDs
const cardMappings = [
  // Major Arcana (maj00-maj21)
  { source: 'maj00.jpg', id: 'major-0' },
  { source: 'maj01.jpg', id: 'major-1' },
  { source: 'maj02.jpg', id: 'major-2' },
  { source: 'maj03.jpg', id: 'major-3' },
  { source: 'maj04.jpg', id: 'major-4' },
  { source: 'maj05.jpg', id: 'major-5' },
  { source: 'maj06.jpg', id: 'major-6' },
  { source: 'maj07.jpg', id: 'major-7' },
  { source: 'maj08.jpg', id: 'major-8' },
  { source: 'maj09.jpg', id: 'major-9' },
  { source: 'maj10.jpg', id: 'major-10' },
  { source: 'maj11.jpg', id: 'major-11' },
  { source: 'maj12.jpg', id: 'major-12' },
  { source: 'maj13.jpg', id: 'major-13' },
  { source: 'maj14.jpg', id: 'major-14' },
  { source: 'maj15.jpg', id: 'major-15' },
  { source: 'maj16.jpg', id: 'major-16' },
  { source: 'maj17.jpg', id: 'major-17' },
  { source: 'maj18.jpg', id: 'major-18' },
  { source: 'maj19.jpg', id: 'major-19' },
  { source: 'maj20.jpg', id: 'major-20' },
  { source: 'maj21.jpg', id: 'major-21' },

  // Wands (wands01-wands14)
  { source: 'wands01.jpg', id: 'wands-ace' },
  { source: 'wands02.jpg', id: 'wands-2' },
  { source: 'wands03.jpg', id: 'wands-3' },
  { source: 'wands04.jpg', id: 'wands-4' },
  { source: 'wands05.jpg', id: 'wands-5' },
  { source: 'wands06.jpg', id: 'wands-6' },
  { source: 'wands07.jpg', id: 'wands-7' },
  { source: 'wands08.jpg', id: 'wands-8' },
  { source: 'wands09.jpg', id: 'wands-9' },
  { source: 'wands10.jpg', id: 'wands-10' },
  { source: 'wands11.jpg', id: 'wands-page' },
  { source: 'wands12.jpg', id: 'wands-knight' },
  { source: 'wands13.jpg', id: 'wands-queen' },
  { source: 'wands14.jpg', id: 'wands-king' },

  // Cups (cups01-cups14)
  { source: 'cups01.jpg', id: 'cups-ace' },
  { source: 'cups02.jpg', id: 'cups-2' },
  { source: 'cups03.jpg', id: 'cups-3' },
  { source: 'cups04.jpg', id: 'cups-4' },
  { source: 'cups05.jpg', id: 'cups-5' },
  { source: 'cups06.jpg', id: 'cups-6' },
  { source: 'cups07.jpg', id: 'cups-7' },
  { source: 'cups08.jpg', id: 'cups-8' },
  { source: 'cups09.jpg', id: 'cups-9' },
  { source: 'cups10.jpg', id: 'cups-10' },
  { source: 'cups11.jpg', id: 'cups-page' },
  { source: 'cups12.jpg', id: 'cups-knight' },
  { source: 'cups13.jpg', id: 'cups-queen' },
  { source: 'cups14.jpg', id: 'cups-king' },

  // Swords (swords01-swords14)
  { source: 'swords01.jpg', id: 'swords-ace' },
  { source: 'swords02.jpg', id: 'swords-2' },
  { source: 'swords03.jpg', id: 'swords-3' },
  { source: 'swords04.jpg', id: 'swords-4' },
  { source: 'swords05.jpg', id: 'swords-5' },
  { source: 'swords06.jpg', id: 'swords-6' },
  { source: 'swords07.jpg', id: 'swords-7' },
  { source: 'swords08.jpg', id: 'swords-8' },
  { source: 'swords09.jpg', id: 'swords-9' },
  { source: 'swords10.jpg', id: 'swords-10' },
  { source: 'swords11.jpg', id: 'swords-page' },
  { source: 'swords12.jpg', id: 'swords-knight' },
  { source: 'swords13.jpg', id: 'swords-queen' },
  { source: 'swords14.jpg', id: 'swords-king' },

  // Pentacles (pents01-pents14)
  { source: 'pents01.jpg', id: 'pentacles-ace' },
  { source: 'pents02.jpg', id: 'pentacles-2' },
  { source: 'pents03.jpg', id: 'pentacles-3' },
  { source: 'pents04.jpg', id: 'pentacles-4' },
  { source: 'pents05.jpg', id: 'pentacles-5' },
  { source: 'pents06.jpg', id: 'pentacles-6' },
  { source: 'pents07.jpg', id: 'pentacles-7' },
  { source: 'pents08.jpg', id: 'pentacles-8' },
  { source: 'pents09.jpg', id: 'pentacles-9' },
  { source: 'pents10.jpg', id: 'pentacles-10' },
  { source: 'pents11.jpg', id: 'pentacles-page' },
  { source: 'pents12.jpg', id: 'pentacles-knight' },
  { source: 'pents13.jpg', id: 'pentacles-queen' },
  { source: 'pents14.jpg', id: 'pentacles-king' },
];

function main() {
  console.log(`Copying ${cardMappings.length} tarot card images from GitHub repository...`);
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Destination: ${OUTPUT_DIR}\n`);

  let copied = 0;
  let skipped = 0;
  let failed = 0;

  for (const card of cardMappings) {
    const sourcePath = path.join(SOURCE_DIR, card.source);
    const destPath = path.join(OUTPUT_DIR, `${card.id}.jpg`);

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      console.log(`Skipping ${card.id} (already exists)...`);
      skipped++;
      continue;
    }

    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${card.id} from ${card.source}`);
      copied++;
    } catch (error) {
      console.error(`Failed to copy ${card.id}:`, error);
      failed++;
    }
  }

  console.log(`\nCopy complete!`);
  if (skipped > 0) {
    console.log(`⊘ ${skipped} cards already existed`);
  }
  console.log(`✓ ${copied} cards copied successfully`);
  if (failed > 0) {
    console.log(`✗ ${failed} cards failed to copy`);
    process.exit(1);
  }
}

main();
