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
});

const AddOnSchema = new mongoose.Schema({
  id: { required: true, type: String },
  title: { type: String },
  description: { type: String },
});

const BeverageProgramSchema = new mongoose.Schema({
  id: { required: true, type: String },
  icon: { type: String },
  label: { type: String },
  description: { type: String },
});

const CriteriaSchema = new mongoose.Schema({
  id: { required: true, type: String },
  label: { type: String },
  description: { type: String },
});

const TimelineSchema = new mongoose.Schema({
  id: { required: true, type: String },
  step: { type: String },
  title: { type: String },
  duration: { type: String },
});

const VenueSourcingSchema = new mongoose.Schema(
  {
    serviceid: IdSchema,
    hero: HeroSchema,
    addOns: [AddOnSchema],
    beverageProgram: [BeverageProgramSchema],
    criteria: [CriteriaSchema],
    timeline: [TimelineSchema],
  },
  { timestamps: true }
);


export default mongoose.model("VenueSourcing", VenueSourcingSchema);
