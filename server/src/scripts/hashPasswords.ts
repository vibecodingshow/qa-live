import fs from 'fs';
import path from 'path';
import { hashPassword } from '../utils/passwordUtils';

const speakersFilePath = path.join(__dirname, '../data/speakers.json');

async function hashExistingPasswords() {
  try {
    console.log('Reading speakers data...');
    const speakersData = fs.readFileSync(speakersFilePath, 'utf8');
    const speakers = JSON.parse(speakersData);

    console.log('Hashing passwords...');
    for (let i = 0; i < speakers.length; i++) {
      const originalPassword = speakers[i].password;
      speakers[i].password = await hashPassword(originalPassword);
      console.log(`Hashed password for ${speakers[i].username}`);
    }

    // Create backup of original file
    const backupPath = speakersFilePath + '.backup';
    fs.writeFileSync(backupPath, speakersData);
    console.log(`Backup created at: ${backupPath}`);

    // Write updated speakers with hashed passwords
    fs.writeFileSync(speakersFilePath, JSON.stringify(speakers, null, 2));
    console.log('Passwords successfully hashed and saved!');
    
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
}

hashExistingPasswords();
