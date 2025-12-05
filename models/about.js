import mongoose from "mongoose";



const HeroSchema = new mongoose.Schema({
  title: { type: String },
  mainTitle: { type: String },
  subtitle: { type: String },
  image: { type: String },
  description: { type: String },
});

const BudgetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  icon: { type: String },
  title: { type: String },
  description: { type: String },
});



const MissionVisionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String }, // "mission" or "vision"
  title: { type: String },
  description: { type: String },
  
});

const SustainabilitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  icon: { type: String },
  title: { type: String },
  description: { type: String },
});

const TechnologySchema = new mongoose.Schema({
  id: { type: String, required: true },
  icon: { type: String },
  title: { type: String },
  description: { type: String },
});

const OcMethodSchema = new mongoose.Schema({
  id: { type: String, required: true },
  number: { type: String },
  title: { type: String },
  description: { type: String },
});

const WhatWeBelieveSchema = new mongoose.Schema({
  id: { type: String, required: true },
  icon: { type: String },
  title: { type: String },
  description: { type: String },
});

// Main Schema
const AboutUsSchema = new mongoose.Schema(
  {
 

    hero: HeroSchema,

    budgetsTitle: { type: String },
    budgets: [BudgetSchema],

    cta: { type: String },
    description: { type: String },
    mainTitle: { type: String },
    title: { type: String },

    missionTitle: { type: String },
    missionDescription: { type: String },
    visionDescription: { type: String },
    missionVision: [MissionVisionSchema],


    sustainabilityTitle: { type: String },
    sustainability: [SustainabilitySchema],

    technology: [TechnologySchema],

    theOcMethodTitle: { type: String },
    theOcMethod: [OcMethodSchema],

    whatWeBelieveTitle: { type: String },
    whatWeBelieve: [WhatWeBelieveSchema],
  },
  { timestamps: true }
);

export default mongoose.model("AboutUs", AboutUsSchema);
