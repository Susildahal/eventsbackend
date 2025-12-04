import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
    // Ensure there's no leftover unique index on serviceid.id that causes E11000 for null
    try {
      const coll = mongoose.connection.db.collection('venuesourcings');
      // Try to drop the old index if it exists
      try {
        await coll.dropIndex('serviceid.id_1');
        console.log('Dropped existing index serviceid.id_1');
      } catch (dropErr) {
        if (dropErr && (dropErr.codeName === 'IndexNotFound' || /index not found/i.test(dropErr.message))) {
          // index not present — ignore
        } else {
          // Log and continue
          console.warn('Could not drop index serviceid.id_1:', dropErr.message || dropErr);
        }
      }

      // Create a non-unique index (allows nulls / duplicates)
      try {
        await coll.createIndex({ 'serviceid.id': 1 }, { unique: false });
        console.log('Ensured non-unique index on serviceid.id');
      } catch (createErr) {
        console.warn('Could not create index serviceid.id (may already exist):', createErr.message || createErr);
      }
    } catch (idxErr) {
      console.warn('Index adjustment skipped:', idxErr.message || idxErr);
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;