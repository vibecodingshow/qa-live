import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const speakersFilePath = path.join(__dirname, '../data/speakers.json');

// Original passwords (for reference)
const originalPasswords = {
  'drsmith': 'speaker123',
  'janedev': 'dev456', 
  'techexpert': 'expert789'
};

function updatePasswordsForClientHashing() {
  try {
    console.log('Reading speakers data...');
    const speakersData = fs.readFileSync(speakersFilePath, 'utf8');
    const speakers = JSON.parse(speakersData);

    console.log('Updating passwords for client-side hashing...');
    
    for (let i = 0; i < speakers.length; i++) {
      const speaker = speakers[i];
      const originalPassword = originalPasswords[speaker.username as keyof typeof originalPasswords];
      
      if (originalPassword) {
        // Create a consistent salt for each user (in production, this should be random)
        const salt = crypto.createHash('sha256').update(speaker.username + 'server-salt').digest('hex').substring(0, 16);
        
        // Hash the original password with the salt (same as client will do)
        const hashedPassword = crypto.createHash('sha256')
          .update(originalPassword + salt)
          .digest('hex');
        
        speakers[i].password = hashedPassword;
        speakers[i].salt = salt; // Store the salt for verification
        
        console.log(`Updated password for ${speaker.username} with salt: ${salt.substring(0, 8)}...`);
      }
    }

    // Create backup
    const backupPath = speakersFilePath + '.client-hash-backup';
    fs.writeFileSync(backupPath, speakersData);
    console.log(`Backup created at: ${backupPath}`);

    // Write updated speakers
    fs.writeFileSync(speakersFilePath, JSON.stringify(speakers, null, 2));
    console.log('Passwords successfully updated for client-side hashing!');
    
  } catch (error) {
    console.error('Error updating passwords:', error);
  }
}

updatePasswordsForClientHashing();
