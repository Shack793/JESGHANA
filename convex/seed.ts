import { internalMutation, mutation, type MutationCtx } from "./_generated/server";
import { requireStaff } from "./lib/auth";
import type { Doc } from "./_generated/dataModel.d.ts";

const IMG = {
  plumber: "https://hercules-cdn.com/file_QpxCBMWdCjU90CVAl5j7d4m1",
  heater: "https://hercules-cdn.com/file_bhxysMK4l123CaJcm1kznG6i",
  pipes: "https://images.unsplash.com/photo-1538474705339-e87de81450e8?auto=format&fit=crop&w=1600&q=80",
  valves: "https://images.unsplash.com/photo-1759148414485-5f624fe9d1ea?auto=format&fit=crop&w=1600&q=80",
  tablet: "https://hercules-cdn.com/file_bE0qxePOYKZeKJYaRU5dUYkN",
  crane: "https://images.unsplash.com/photo-1763665814778-82543e6be5e8?auto=format&fit=crop&w=1600&q=80",
  faucet: "https://images.unsplash.com/photo-1542855368-ca6ea825bca2?auto=format&fit=crop&w=1600&q=80",
  electrician: "https://hercules-cdn.com/file_h4RIRi1BuDksLA4ryu4MSivx",
  factory: "https://images.unsplash.com/photo-1773517459133-be9768f6cac9?auto=format&fit=crop&w=1600&q=80",
  tank: "https://images.unsplash.com/photo-1707249907742-4d4984281f3a?auto=format&fit=crop&w=1600&q=80",
  sink: "https://images.unsplash.com/photo-1613849925387-6e7f31f0cf40?auto=format&fit=crop&w=1600&q=80",
  panel: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1600&q=80",
  team: "https://hercules-cdn.com/file_5vwDYaU0RY2y1c7fA473cmxC",
};

type Banner = Omit<Doc<"banners">, "_id" | "_creationTime" | "order" | "active">;
type Block = [Doc<"contentBlocks">["type"], string, string, string?];

const BANNERS: Banner[] = [
  { page: "home", title: "Plumbing and Engineering You Can Trust", subtitle: "Mechanical, electrical, plumbing and civil works delivered across Ghana.", ctaLabel: "Our services", ctaLink: "/services", imageUrl: IMG.plumber },
  { page: "home", title: "Industrial Piping and Pumps", subtitle: "Pipeline installation, pump systems, valves and process equipment.", ctaLabel: "Get a quote", ctaLink: "/contact", imageUrl: IMG.valves },
  { page: "home", title: "Water Heating and Boiler Systems", subtitle: "Installation, servicing and repair for homes, hotels and factories.", ctaLabel: "Book a service", ctaLink: "/contact", imageUrl: IMG.heater },
  { page: "home", title: "Powering Industry", subtitle: "Electrical installations, substations, power distribution and control systems.", ctaLabel: "About us", ctaLink: "/about", imageUrl: IMG.electrician },
  { page: "home", title: "Built to Last", subtitle: "Site development, drainage, water and sewer systems engineered for the long term.", ctaLabel: "See our work", ctaLink: "/services", imageUrl: IMG.crane },
  { page: "about", title: "About Jurhette Engineering", subtitle: "Qualified engineers with unmatched expertise.", imageUrl: IMG.team },
  { page: "about", title: "Our Mission and Vision", subtitle: "Value for customers, recognised across Ghana and beyond.", imageUrl: IMG.tablet },
  { page: "about", title: "Experts at Large-Scale Works", subtitle: "Safety, quality and transparency on every project.", imageUrl: IMG.factory },
  { page: "services", title: "Our Services", subtitle: "Customized plumbing and engineering solutions, delivered on time.", imageUrl: IMG.pipes },
  { page: "services", title: "Plumbing for Homes and Industry", subtitle: "Water supply, drainage, sanitary fittings and pipework.", imageUrl: IMG.faucet },
  { page: "services", title: "Power and Control", subtitle: "Substations, generators, UPS and automation.", imageUrl: IMG.panel },
  { page: "blog", title: "News and Insights", subtitle: "Updates from the world of plumbing, construction and engineering.", imageUrl: IMG.tank },
  { page: "blog", title: "Practical Guides", subtitle: "Advice for facility owners, builders and homeowners.", imageUrl: IMG.sink },
  { page: "contact", title: "Contact Us", subtitle: "We would love to hear from you. Just a call away.", imageUrl: IMG.tablet },
  { page: "contact", title: "Request a Quote", subtitle: "Tell us about your project and we will respond quickly.", imageUrl: IMG.plumber },
];

const BLOCKS: Block[] = [
  ["service", "Plumbing and Sanitary", "Water supply, soil and waste systems, bathrooms, kitchens and fittings for homes and commercial buildings."],
  ["service", "Pipeline Installation", "Underground and overground pipelines, relocation, testing and commissioning."],
  ["service", "Pumps and Water Systems", "Booster pumps, borehole systems, tanks and pump refurbishment."],
  ["service", "HVAC and Ducting", "Air conditioning, ventilation and ducting design and installation."],
  ["service", "Electrical Installations", "Power distribution, substations, lighting, generators and UPS systems."],
  ["service", "Civil and Drainage", "Site development, retaining walls, drainage studies and sewer systems."],
  ["service", "Safety and Security", "CCTV, intruder alarms, fire systems and emergency lighting."],
  ["service", "Maintenance and Repairs", "Planned maintenance, leak detection and emergency call-outs."],
  ["scope", "Mechanical and Plumbing", "Plumbing and sanitary installation\nPiping systems\nRotating and reciprocating equipment\nPumps and flow hydraulics\nAlignment services\nPump refurbishment\nFixed equipment\nMachine overhaul\nHVAC and ducting systems and installation\nPlumbing"],
  ["scope", "Electricals", "Grounding and lighting protection\nControl systems troubleshooting and optimization\nControl systems upgrade\nAnalyzer/CEM installation\nSubstation\nPower distribution analysis and design\nIndustrial network\nCCTV / intruder alarms\nGenerator/UPS systems\nFiber optics\nFull installation and periodic test and inspection\nEmergency power and lighting systems\nDomestic wiring"],
  ["scope", "Civil", "Site development\nUnderground pipeline installation / relocation\nRetaining walls\nErosion and sediment control\nWater and sewer systems design\nDrainage studies and improvement"],
  ["feature", "Customized engineering solutions", "Designed around your site and needs."],
  ["feature", "High-quality products and services", "Best engineering practice on every job."],
  ["feature", "Timely delivery and support", "On schedule, with support after handover."],
  ["feature", "Collaborative approach", "We work closely with architects and builders."],
  ["value", "Integrity", "We conduct our business with honesty, transparency, and accountability."],
  ["value", "Excellence", "We strive for the highest standards, delivering quality that exceeds expectations."],
  ["value", "Innovation", "We embrace creativity and technology to develop smarter engineering solutions."],
  ["value", "Customer Focus", "Our clients are at the heart of our operations. We listen, adapt, and tailor our solutions."],
  ["value", "Sustainability", "Responsible engineering that supports long-term environmental and economic growth."],
  ["value", "Teamwork", "Success is built on collaboration, respect, and shared commitment."],
  ["partner", "Food & Beverages", "OEM work in food and beverage production."],
  ["partner", "Water & Sewage", "OEM work in water and sewage treatment."],
  ["partner", "Energy", "OEM work in the energy sector."],
  ["partner", "Cement Manufacturing", "OEM work in cement manufacturing."],
  ["partner", "Industrial Automation", "OEM work in industrial automation."],
  ["process", "Concept design", "We study your needs and develop the concept."],
  ["process", "Detail engineering", "Detailed mechanical, electrical, plumbing and civil design."],
  ["process", "Contract and delivery", "Procurement, installation and project management."],
  ["process", "Service and support", "Periodic testing, inspection and maintenance."],
  ["faq", "What is a structural engineer?", "Structural engineers help in the design of buildings and structures so they withstand stresses such as weather and human use. They work closely with architects and builders."],
  ["faq", "Where are you located?", "We are at Tema Community 22, Plot No. 20 Z4.1, and serve clients across Ghana."],
  ["faq", "What are your main services?", "Mechanical, electrical, plumbing and civil engineering, plus automation, HVAC and oil and gas field services."],
  ["faq", "What is construction management?", "Planning, coordinating and controlling a project from start to finish so it is delivered on time, on budget and safely."],
  ["testimonial", "Thomas Smith", "They exceeded my expectations and will definitely be working with them again in the future.", "Ghana"],
  ["testimonial", "Stella Smith", "Excellent team. They exceeded my expectations and will definitely be working with them again.", "Kumasi, Ghana"],
  ["testimonial", "Ernest Smith", "Very professional. We will definitely be working with them again in the future.", "USA"],
];

async function insertAll(ctx: MutationCtx): Promise<void> {
  await ctx.db.insert("settings", {
    companyName: "Jurhette Engineering Services",
    tagline: "One For All Engineering Services",
    intro:
      "Providing contractual engineering services like electrical installations, lighting, safety & security, process equipment, motors, generators, pumps, water, drainage, plumbing, pipelines & fittings, oil & gas field services, factory installations, automatic control, BMS & automation, HVAC systems and more.",
    about:
      "Jurhette Engineering Services is a Ghanaian (MEP) and Civil engineering company offering quality engineering and contractual services. The company is made up of qualified and experienced engineers who adopt best engineering practices. The company focuses on concept design, detail engineering, contracts and services for mechanical, electrical, plumbing and civil works.",
    mission:
      "To provide our customers with value through the provision of both industrial and domestic MEP engineering services, procurement and management.",
    vision:
      "To be widely recognized as one of the leading MEP engineering service companies in Ghana and worldwide for its working method, technology and human resource competence.",
    address: "Tema Community 22, Plot No. 20 Z4.1",
    hours: "Monday - Friday: 9:00am - 5:00pm",
    phones: "0503884224 / 0249651593",
    email: "info@jesghana.com",
  });
  let n = 0;
  for (const b of BANNERS) await ctx.db.insert("banners", { ...b, order: ++n, active: true });
  for (const [type, title, description, meta] of BLOCKS) {
    await ctx.db.insert("contentBlocks", { type, title, description, meta, order: ++n, active: true });
  }
  const posts = [
    ["Why preventive plumbing maintenance saves money", "Regular inspection of pipes, pumps, motors and electrical systems reduces downtime and extends equipment life."],
    ["Choosing the right generator and UPS system", "A guide to sizing backup power for factories, offices and homes."],
    ["Five signs your pipes need attention", "Low water pressure, damp walls and discoloured water are early warnings worth checking."],
    ["Drainage design basics for Ghanaian sites", "How good drainage studies protect buildings and roads during the rainy season."],
  ];
  const images = [IMG.valves, IMG.faucet, IMG.panel, IMG.pipes];
  for (const [i, [title, excerpt]] of posts.entries()) {
    await ctx.db.insert("posts", {
      title,
      excerpt,
      body: `${excerpt}\n\nThis is a sample article. Edit or replace it from the admin dashboard.`,
      imageUrl: images[i],
      published: true,
      publishedAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    });
  }
}

// Admin button on the dashboard
export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx, true);
    if ((await ctx.db.query("settings").first()) !== null) return false;
    await insertAll(ctx);
    return true;
  },
});

// Run once from the builder to load sample content without signing in
export const seedInitial = internalMutation({
  args: {},
  handler: async (ctx) => {
    if ((await ctx.db.query("settings").first()) !== null) return false;
    await insertAll(ctx);
    return true;
  },
});
