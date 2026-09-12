// src/data/blogs.js
//
// Local dummy blog posts. `content` is raw HTML (the real app renders
// it via dangerouslySetInnerHTML, since it comes from the Jodit rich
// text editor in the admin) — same for admin-authored posts.

import fruitIcon from "../assets/images/fruit.png";
import vegeIcon from "../assets/images/vege.png";
import cookingIcon from "../assets/images/cooking.png";
import snacksIcon from "../assets/images/snacks.png";
import beautyIcon from "../assets/images/beauty.png";
import bakingIcon from "../assets/images/baking.png";

const blogs = [
  {
    _id: "blog-001",
    slug: "5-health-benefits-of-fresh-fruit",
    title: { en: "5 Health Benefits of Eating Fresh Fruit Daily", bn: "প্রতিদিন তাজা ফল খাওয়ার ৫টি স্বাস্থ্য উপকারিতা" },
    content: {
      en: `<p>Fresh fruit is one of the simplest ways to improve your daily diet. Here are five reasons to make it a habit.</p>
<h3>1. Packed with vitamins</h3>
<p>Fruits like oranges and mangoes are rich in vitamin C, which supports your immune system.</p>
<h3>2. Natural energy</h3>
<p>The natural sugars in fruit give you a steady energy boost without the crash that comes from processed snacks.</p>
<h3>3. High in fiber</h3>
<p>Fiber keeps you feeling full longer and supports healthy digestion.</p>
<h3>4. Hydration</h3>
<p>Many fruits, like watermelon, are over 90% water — a tasty way to stay hydrated.</p>
<h3>5. Naturally low in calories</h3>
<p>Compared to packaged snacks, whole fruit is a much lighter option for the same satisfaction.</p>
<p>Try adding one extra serving of fruit to your day this week and see how you feel.</p>`,
      bn: `<p>তাজা ফল আপনার দৈনন্দিন খাদ্যাভ্যাস উন্নত করার সবচেয়ে সহজ উপায়গুলোর একটি। এখানে এটি অভ্যাসে পরিণত করার পাঁচটি কারণ দেওয়া হলো।</p>
<h3>১. ভিটামিনে ভরপুর</h3>
<p>কমলা ও আমের মতো ফলে ভিটামিন সি প্রচুর পরিমাণে থাকে, যা রোগ প্রতিরোধ ক্ষমতা বাড়াতে সাহায্য করে।</p>
<h3>২. প্রাকৃতিক শক্তি</h3>
<p>ফলের প্রাকৃতিক চিনি ধীরে ধীরে শক্তি জোগায়, প্রক্রিয়াজাত খাবারের মতো হঠাৎ ক্লান্তি আসে না।</p>
<h3>৩. আঁশ সমৃদ্ধ</h3>
<p>আঁশ দীর্ঘক্ষণ পেট ভরা রাখে এবং হজমে সহায়তা করে।</p>
<h3>৪. পানিশূন্যতা রোধ</h3>
<p>তরমুজের মতো অনেক ফলে ৯০% এরও বেশি পানি থাকে — সতেজ থাকার একটি সুস্বাদু উপায়।</p>
<h3>৫. স্বাভাবিকভাবে কম ক্যালরি</h3>
<p>প্যাকেটজাত স্ন্যাকসের তুলনায় গোটা ফল অনেক হালকা একটি বিকল্প।</p>`,
    },
    category: { _id: "cat-001", name: { en: "Fresh Fruit", bn: "তাজা ফল" } },
    tags: { en: ["Fruit", "Healthy", "Vitamins"], bn: ["ফল", "স্বাস্থ্যকর"] },
    author: { name: "Ecobazar Team", avatar: null },
    image: fruitIcon,
    type: "image",
    status: "published",
    readTime: "4 min read",
    createdAt: "2026-08-18T09:00:00.000Z",
  },
  {
    _id: "blog-002",
    slug: "store-vegetables-fresh-longer",
    title: { en: "How to Store Vegetables So They Stay Fresh Longer", bn: "সবজি কীভাবে সংরক্ষণ করলে বেশিদিন তাজা থাকে" },
    content: {
      en: `<p>A little know-how goes a long way in reducing food waste. Here's how to store common vegetables properly.</p>
<h3>Leafy greens</h3>
<p>Wrap them loosely in a slightly damp paper towel and store in the crisper drawer.</p>
<h3>Root vegetables</h3>
<p>Potatoes and onions prefer a cool, dark, dry place — not the fridge.</p>
<h3>Tomatoes</h3>
<p>Keep at room temperature until ripe, away from direct sunlight, for the best flavour.</p>
<h3>Cut vegetables</h3>
<p>Store in an airtight container and use within 2–3 days for best quality.</p>`,
      bn: `<p>খাবার নষ্ট হওয়া কমাতে সামান্য জ্ঞানই যথেষ্ট। সাধারণ সবজিগুলো সঠিকভাবে সংরক্ষণের উপায় জেনে নিন।</p>
<h3>শাক-সবজি</h3>
<p>হালকা ভেজা টিস্যু পেপারে ঢিলেভাবে মুড়িয়ে ফ্রিজের ক্রিসপার ড্রয়ারে রাখুন।</p>
<h3>মূল জাতীয় সবজি</h3>
<p>আলু ও পেঁয়াজ ঠান্ডা, অন্ধকার ও শুকনো জায়গায় ভালো থাকে — ফ্রিজে নয়।</p>
<h3>টমেটো</h3>
<p>সরাসরি রোদ এড়িয়ে ঘরের তাপমাত্রায় রাখুন যতক্ষণ না পাকে।</p>`,
    },
    category: { _id: "cat-002", name: { en: "Fresh Vegetables", bn: "তাজা সবজি" } },
    tags: { en: ["Vegetarian", "Healthy"], bn: ["সবজি"] },
    author: { name: "Ecobazar Team", avatar: null },
    image: vegeIcon,
    type: "image",
    status: "published",
    readTime: "3 min read",
    createdAt: "2026-08-05T09:00:00.000Z",
  },
  {
    _id: "blog-003",
    slug: "beginners-guide-bangladeshi-home-cooking",
    title: { en: "A Beginner's Guide to Bangladeshi Home Cooking", bn: "বাংলাদেশি ঘরোয়া রান্নার একটি সহজ গাইড" },
    content: {
      en: `<p>New to cooking Bangladeshi food at home? Start with these pantry staples.</p>
<h3>Build a base</h3>
<p>Onion, garlic, ginger, and green chili form the base of most everyday curries.</p>
<h3>Stock your spices</h3>
<p>Turmeric, cumin, and coriander powder cover a surprising number of dishes on their own.</p>
<h3>Rice and dal, done right</h3>
<p>A well-cooked pot of rice and a simple masoor dal is a complete, comforting meal.</p>
<p>Start simple, taste as you go, and adjust spice levels to your own preference.</p>`,
      bn: `<p>ঘরে বাংলাদেশি খাবার রান্না শুরু করতে চান? এই সাধারণ উপকরণগুলো দিয়ে শুরু করুন।</p>
<h3>একটি বেস তৈরি করুন</h3>
<p>পেঁয়াজ, রসুন, আদা ও কাঁচা মরিচ বেশিরভাগ তরকারির মূল ভিত্তি তৈরি করে।</p>
<h3>মসলা মজুত রাখুন</h3>
<p>হলুদ, জিরা ও ধনে গুঁড়া দিয়েই অনেক পদ রান্না করা যায়।</p>
<h3>ভাত ও ডাল ঠিকমতো রান্না</h3>
<p>ভালোভাবে রান্না করা ভাত আর সাধারণ মসুর ডাল একটি সম্পূর্ণ ও আরামদায়ক খাবার।</p>`,
    },
    category: { _id: "cat-003", name: { en: "Cooking", bn: "রান্নার উপকরণ" } },
    tags: { en: ["Vegetarian"], bn: [] },
    author: { name: "Ecobazar Team", avatar: null },
    image: cookingIcon,
    type: "image",
    status: "published",
    readTime: "5 min read",
    createdAt: "2026-07-22T09:00:00.000Z",
  },
  {
    _id: "blog-004",
    slug: "healthy-snacking-tips",
    title: { en: "Healthy Snacking: Simple Tips for Better Choices", bn: "স্বাস্থ্যকর নাস্তা: ভালো পছন্দের জন্য সহজ টিপস" },
    content: {
      en: `<p>Snacking isn't the enemy — what you reach for makes the difference.</p>
<h3>Pair protein with carbs</h3>
<p>A handful of nuts with fruit keeps you fuller longer than fruit alone.</p>
<h3>Watch portion sizes</h3>
<p>Pre-portioning snacks into small bags helps avoid mindless overeating.</p>
<h3>Keep it visible</h3>
<p>Put healthier snacks at eye level in the fridge and pantry — you'll reach for them first.</p>`,
      bn: `<p>নাস্তা করা খারাপ কিছু নয় — কী খাচ্ছেন সেটাই আসল পার্থক্য তৈরি করে।</p>
<h3>প্রোটিন ও কার্বোহাইড্রেট একসাথে</h3>
<p>ফলের সাথে এক মুঠো বাদাম খেলে শুধু ফলের চেয়ে বেশিক্ষণ পেট ভরা থাকে।</p>
<h3>পরিমাণের দিকে খেয়াল রাখুন</h3>
<p>ছোট প্যাকেটে ভাগ করে রাখলে অতিরিক্ত খাওয়া এড়ানো যায়।</p>`,
    },
    category: { _id: "cat-004", name: { en: "Snacks", bn: "নাস্তা ও স্ন্যাকস" } },
    tags: { en: ["Snacks", "Healthy", "Kid foods"], bn: [] },
    author: { name: "Ecobazar Team", avatar: null },
    image: snacksIcon,
    type: "image",
    status: "published",
    readTime: "3 min read",
    createdAt: "2026-07-10T09:00:00.000Z",
  },
  {
    _id: "blog-005",
    slug: "why-we-started-ecobazar",
    title: { en: "Why We Started Ecobazar", bn: "কেন আমরা ইকোবাজার শুরু করেছিলাম" },
    content: {
      en: `<p>Ecobazar began with a simple frustration: finding genuinely fresh groceries online shouldn't be this hard.</p>
<p>We started small, working directly with local farms and trusted suppliers, and built our delivery process around one question: would we be happy receiving this ourselves?</p>
<p>That question still guides every product we add to the catalogue today.</p>`,
      bn: `<p>ইকোবাজারের শুরু হয়েছিল একটি সাধারণ হতাশা থেকে: অনলাইনে সত্যিকারের তাজা মুদি পণ্য খুঁজে পাওয়া এত কঠিন হওয়ার কথা নয়।</p>
<p>আমরা ছোট পরিসরে শুরু করেছিলাম, স্থানীয় খামার ও বিশ্বস্ত সরবরাহকারীদের সাথে সরাসরি কাজ করে।</p>
<p>এই প্রশ্নই আজও আমাদের ক্যাটালগে যোগ করা প্রতিটি পণ্যকে পথ দেখায়।</p>`,
    },
    category: { _id: "cat-006", name: { en: "Beauty & Health", bn: "রূপচর্চা ও স্বাস্থ্য" } },
    tags: { en: ["Healthy"], bn: [] },
    author: { name: "Ecobazar Team", avatar: null },
    image: bakingIcon,
    type: "image",
    status: "published",
    readTime: "2 min read",
    createdAt: "2026-06-28T09:00:00.000Z",
  },
  {
    _id: "blog-006",
    slug: "guide-to-reading-nutrition-labels",
    title: { en: "Your Guide to Reading Nutrition Labels", bn: "পুষ্টি লেবেল পড়ার সহজ গাইড" },
    content: {
      en: `<p>Nutrition labels can feel overwhelming — here's what actually matters.</p>
<h3>Start with serving size</h3>
<p>Every number on the label is based on this, so check it first.</p>
<h3>Look at added sugar</h3>
<p>This is separate from naturally occurring sugar and worth watching closely.</p>
<h3>Don't ignore fiber</h3>
<p>Higher fiber content generally means a more filling, better-for-you option.</p>`,
      bn: `<p>পুষ্টি লেবেল দেখলে অনেক সময় জটিল মনে হয় — আসলে কোন বিষয়গুলো গুরুত্বপূর্ণ তা জেনে নিন।</p>
<h3>পরিবেশনের পরিমাণ দিয়ে শুরু করুন</h3>
<p>লেবেলের প্রতিটি সংখ্যা এর উপর ভিত্তি করেই দেওয়া, তাই প্রথমে এটি দেখুন।</p>
<h3>অতিরিক্ত চিনির দিকে খেয়াল রাখুন</h3>
<p>এটি প্রাকৃতিক চিনি থেকে আলাদা এবং সতর্কভাবে দেখা উচিত।</p>`,
    },
    category: { _id: "cat-006", name: { en: "Beauty & Health", bn: "রূপচর্চা ও স্বাস্থ্য" } },
    tags: { en: ["Healthy", "Vitamins"], bn: [] },
    author: { name: "Ecobazar Team", avatar: null },
    image: beautyIcon,
    type: "image",
    status: "published",
    readTime: "4 min read",
    createdAt: "2026-06-12T09:00:00.000Z",
  },
];

export default blogs;
