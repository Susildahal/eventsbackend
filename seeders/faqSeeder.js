import mongoose from "mongoose";
import Faq from "../models/faq.js";
import dotenv from "dotenv";

dotenv.config();

const faqCategories = {
  General: [
    {
      question: "How do I book an event with Events OC?",
      answer:
        "Start by sharing your date, guest count, vibe and budget guide. We will send a tailored proposal. Your date is secured once the non-refundable deposit is paid (see your invoice for the amount).",
    },
    {
      question: "What payment schedule do you use?",
      answer:
        "Your invoice confirms due dates. If a payment is not received on time, we may cancel services per our Terms.",
    },
    {
      question: "What is included in your proposals?",
      answer:
        "Clear scope, inclusions, and an itemised price. Typical inclusions are producer time, venue sourcing (if requested), supplier bookings, run sheet, and on-day coordination. Optional extras (e.g., live streaming, custom fabrication) are listed separately.",
    },
    {
      question: "Do you work outside the Gold Coast?",
      answer:
        "Yes—Gold Coast & surrounds. Travel and logistics fees may apply and will be listed in your quote.",
    },
  ],
  Cancellations: [
    {
      question: "Can I change my date, time, location or services?",
      answer:
        "We will make reasonable efforts to accommodate advance requests. Availability is not guaranteed and additional costs may apply.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Within 48 hours of the event: no refund. More than 2 days out: you may be eligible for a partial refund (the deposit is non-refundable). All third-party supplier policies flow through to you and will be clarified at time of booking.",
    },
    {
      question: "Who is responsible for guest behaviour and safety?",
      answer:
        "You are responsible for the safety and conduct of your guests. We're not liable for loss, damage, injury or expense except where caused by our proven negligence.",
    },
  ],
  Permits: [
    {
      question: "Do you find and book the venue?",
      answer:
        "Yes—our Venue Sourcing service shortlists 3 to 6 options with specs, floor plans and indicative pricing. We arrange site visits, date holds and handle contracting once you approve.",
    },
    {
      question: "Do beach or public-space events need permits?",
      answer:
        "Some locations require council or foreshore permits. We will advise and apply where relevant, and we will build a Plan B for weather.",
    },
    {
      question: "Can you work in private homes or Airbnbs?",
      answer:
        "Absolutely. We will assess access, noise, power and any owner/host rules before confirming.",
    },
  ],
  Catering: [
    {
      question: "What catering styles do you offer?",
      answer:
        "Canapés, chef stations, grazing tables, feasting or plated menus, plus late-night bites. Dietaries are planned in advance and clearly labelled.",
    },
    {
      question: "Do you do BYO bars?",
      answer:
        "Yes—where the venue permits. We can manage glassware (including premium, safe polycarbonate for pool/beach), ice, bar kit and RSA-certified staff.",
    },
    {
      question: "Are tastings available?",
      answer:
        "Where our partner caterers offer tastings, we will let you know availability and any fees.",
    },
  ],
};

const seedFAQs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");

    // Clear existing FAQs (optional - remove if you want to keep existing data)
    await Faq.deleteMany({});
    console.log("Existing FAQs cleared");

    // Prepare FAQ data for insertion
    const faqsToInsert = [];
    
    for (const [category, questions] of Object.entries(faqCategories)) {
      questions.forEach((faq) => {
        faqsToInsert.push({
          question: faq.question,
          answer: faq.answer,
          title: category,
          status: true,
        });
      });
    }

    // Insert all FAQs
    const insertedFaqs = await Faq.insertMany(faqsToInsert);
    console.log(`✅ Successfully seeded ${insertedFaqs.length} FAQs`);
    
    // Display summary
    console.log("\n📊 Summary:");
    console.log(`   General: ${faqCategories.General.length} FAQs`);
    console.log(`   Cancellations: ${faqCategories.Cancellations.length} FAQs`);
    console.log(`   Permits: ${faqCategories.Permits.length} FAQs`);
    console.log(`   Catering: ${faqCategories.Catering.length} FAQs`);

    // Disconnect from database
    await mongoose.disconnect();
    console.log("\n✅ Database disconnected. Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding FAQs:", error);
    process.exit(1);
  }
};

// Run the seeder
seedFAQs();

export { seedFAQs as faqSeeder };
