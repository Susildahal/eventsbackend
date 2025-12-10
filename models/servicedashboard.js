import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  title: { type: String },
  mainTitle: { type: String },
  subtitle: { type: String },
   image: { type: String, required: false },  
  // Allow mixed types for criteria to accept objects or stringified JSON from clients
  criteria: [{ type: mongoose.Schema.Types.Mixed }],

});
const IdSchema = new mongoose.Schema({
  id: { required: true, type: String   , message:"ID is required"},
  name: { type: String },
});







const VenueSourcingSchema = new mongoose.Schema(
  {
    serviceid: IdSchema,
    name: { type: String },
    hero: HeroSchema,

    criteria: [{ type: mongoose.Schema.Types.Mixed }],
   
  },
  { timestamps: true }
);


export default mongoose.model("VenueSourcing", VenueSourcingSchema);
