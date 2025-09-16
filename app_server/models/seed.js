// Run the seed command manually: from main dir to seed the database -> 
// $ node .\app_server\models\seed

const fs = require('fs');

// Import the DB connection
const Mongoose = require('./db');

// Import the Schemas
const Index = require('./indexSchema');
const Trip = require('./tripsSchema');
const Trip = require('./roomsSchema');
// Read seed data drom the json files
var items = JSON.parse(fs.readFileSync('./data/index.json', 'utf8'));
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));
var trips = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf8'));


// Populate the travel collection if empty
var seedIndex = async () => {
  try {
    // Count docs in the travel collection. Seed if empty, skip othrwise.
    const count = await Index.estimatedDocumentCount();
    if (count === 0) {
      console.log('Index collection is empty, seeding data...');
      await Index.insertMany(items);
      console.log('Seeding complete!');
    } else {
      console.log(`Index collection already has ${count} documents. Skipping seeding.`);
    }
  } catch (err) {
    console.error('Error during seeding:', err);
  }
};


// Populate the travel collection if empty
var seedTravel = async () => {
  try {
    // Count docs in the travel collection. Seed if empty, skip othrwise.
    const count = await Trip.estimatedDocumentCount();
    if (count === 0) {
      console.log('Travel collection is empty, seeding data...');
      await Trip.insertMany(trips);
      console.log('Seeding complete!');
    } else {
      console.log(`Travel collection already has ${count} documents. Skipping seeding.`);
    }
  } catch (err) {
    console.error('Error during seeding:', err);
  }
};



// Close connection after all collections are seeded.
const seedAll = async () => {
  await seedIndex();
  await seedTravel();
  await seedRooms();
};


// Close connection after all collections are seeded.
seedAll().then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
});