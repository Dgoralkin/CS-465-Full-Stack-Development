// This file use used to establish the connection to the MongoDB database through Mongoose
// And require it in app.js

const mongoose = require('mongoose');

// Define the host (for a local DB)
// const host = process.env.DB_HOST || '127.0.0.1';

// Add the database connection and connect to a local DB:
// const dbURI = `mongodb://${host}/travlr`;

// ====================================================================================================================== //
//                                                                                                                        //
//                          FIXME: remove connection string before deployment                                             //
// const dbURI = process.env.ATLAS_DB_HOST || 'mongodb+srv://g______n:P_______!@cluster0.td8gcls.mongodb.net/travlr';    //
//                                                                                                                        //
// ====================================================================================================================== //

// Connect to the Atlas DB.
const dbURI = process.env.ATLAS_DB_HOST;

// Async function to connect with try/catch
async function connectDB() {
  try {
    // Connect to the database:
    await mongoose.connect(dbURI);
    // Display db connection status
    console.log(`Mongoose connected to ${dbURI}`);
  } catch (err) {
    console.error('Mongoose connection error:', err);
  }
}

// Call the connection function
connectDB();

// Registers a listener (callback function) that runs whenever the event occurs.
// Display db connection status via events
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
}); 

// Close connection gracefully when app is terminated
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose disconnected on app termination');
  process.exit(0);
});

// Outout the connection state:
console.log('Connection state:', mongoose.connection.readyState);

// Expose the database schema from the models dir
// Import Mongoose schema from the travlr dir
require('./tripsSchema');
require('./indexSchema');
require('./roomsSchema');
require('./mealsSchema');
require('./aboutSchema');
require('./contactSchema');
module.exports = mongoose;