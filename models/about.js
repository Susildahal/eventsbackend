import mongoose from "mongoose";



const HeroSchema = new mongoose.Schema({
  title: { type: String },
  mainTitle: { type: String },
  subtitle: { type: String },
  image: { type: String },
  description: { type: String },
});





const MissionVisionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String }, // "mission" or "vision"
  title: { type: String },
  description: { type: String },
  
});








// Main Schema
const AboutUsSchema = new mongoose.Schema(
  {
 

    hero: HeroSchema,



   
    description: { type: String },
    mainTitle: { type: String },
    title: { type: String },

    missionandvisionTitle: { type: String },
    missionDescription: { type: String },
    visionDescription: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("AboutUs", AboutUsSchema);
