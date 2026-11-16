import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import Series from "../models/Series.js";
import Chapter from "../models/Chapter.js";
import Product from "../models/Product.js";

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`;

async function seed() {
  await connectDatabase();
  await Promise.all([Chapter.deleteMany({}), Series.deleteMany({}), Product.deleteMany({})]);

  const series = await Series.create({
    title: "THE GENTLE ARMOR™",
    slug: "the-gentle-armor",
    description: "A collection about the strength it takes to remain gentle in a world that asks you to be hard.",
    coverImage: photo("photo-1529139574466-a303027c1d8b")
  });

  const product = await Product.create({
    name: "The Gentle Armor Tee",
    slug: "the-gentle-armor-tee",
    description: "A considered everyday layer. Clean lines, a relaxed shape, and a reminder that softness can be its own kind of strength.",
    price: 1899,
    image: photo("photo-1521572163474-6864f9cf17ab"),
    sizes: ["S", "M", "L", "XL"]
  });

  const chapterDetails = [
    ["The Quiet Beginning", "Strength does not always arrive loudly. Sometimes it begins with the decision to keep going.", "There are beginnings no one notices. A small decision made in private. A promise kept when there is no one around to see it.\n\nThis chapter is about that first moment: the quiet beginning of becoming someone you can depend on."],
    ["The Weight We Carry", "Every person carries a story that cannot be read from the outside.", "Some weight is visible. Most of it is not. We carry expectations, memories, unfinished conversations, and hopes that have not found their moment yet.\n\nThe weight does not make us less. It becomes part of the shape of who we are."],
    ["Room to Breathe", "A pause is not a retreat. It can be the space where strength returns.", "We are often taught to keep moving. But there is courage in stopping long enough to listen.\n\nRoom to breathe is a reminder that rest belongs in the story too."],
    ["Softness Is Strength", "Gentleness is not the absence of courage. It is courage with intention.", "There is strength in choosing kindness without losing your boundaries. There is strength in staying open after a difficult season.\n\nSoftness is not surrender. It is a way of standing in the world."],
    ["What Remains", "The things that shape us stay with us, even after the moment has passed.", "A battle changes its shape with time. What remains is not only what we lost, but what we learned to protect.\n\nThis is not an ending. It is a way of carrying the story forward."]
  ];

  await Chapter.insertMany(chapterDetails.map((item, index) => ({
    title: item[0],
    slug: ["the-quiet-beginning", "the-weight-we-carry", "room-to-breathe", "softness-is-strength", "what-remains"][index],
    number: index + 1,
    summary: item[1],
    content: item[2],
    image: photo(["photo-1515886657613-9f3515b0c78f", "photo-1529139574466-a303027c1d8b", "photo-1483985988355-763728e1935b", "photo-1539109136881-3be0616acf4b", "photo-1525507119028-ed4c629a60a3"][index]),
    series: series._id,
    product: index === 3 ? product._id : null
  })));

  console.log("Sample series, five chapters, and one product have been added.");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
