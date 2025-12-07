import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    }, { timestamps: true }
);



const PortfolioImageSchema = new mongoose.Schema(
    {
      portfolioId: {
          type:String,
          required: true,
      },
        image: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    }, { timestamps: true }
);
const PortfolioImage = mongoose.model("PortfolioImage", PortfolioImageSchema);
const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export { Portfolio, PortfolioImage };