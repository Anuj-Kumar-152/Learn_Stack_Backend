const express = require("express");
const router = express.Router();

const Topic = require("../models/Topic.js");
const matter = require("gray-matter");
 


// ✅ ALL TOPICS (NO CHANGE)
router.get("/topics", async (req, res) => {
   try {
      const topics = await Topic.find();
      res.json(topics);
   } catch (err) {
      res.status(500).json({ error: "Failed to fetch topics" });
   }
});


// 🔥 UPDATED (MULTI VIDEO SUPPORT)
router.get("/topics/:slug", async (req, res) => {
   try {

      const topic = await Topic.findOne({ slug: req.params.slug });

      if (!topic) {
         return res.status(404).json({ error: "Topic not found" });
      }

      // ✅ MD parse
      const parsed = matter(topic.content || "");

      // 🔥 MULTI VIDEO LOGIC
      let videos = [];

      if (parsed.data.videos && Array.isArray(parsed.data.videos)) {
         // ✅ multiple videos
         videos = parsed.data.videos;
      } else if (parsed.data.videoId) {
         // ✅ backward compatibility (single video)
         videos = [
            {
               id: parsed.data.videoId,
               title: topic.title,
               channel: parsed.data.channel || "CodeNexus"
            }
         ];
      }

      res.json({
         ...topic._doc,           // ✅ old data same
         content: parsed.content, // ✅ markdown clean
         videos: videos           // 🔥 NEW (array always)
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
   }
});


// ✅ CATEGORIES (SAFE)
router.get("/categories", async (req, res) => {
   try {
      const categories = await Category.find();
      res.json(categories);
   } catch (err) {
      res.status(500).json({ error: "Failed to fetch categories" });
   }
});


// ✅ CATEGORY TOPICS (NO CHANGE + SAFE)
router.get("/topics/category/:category", async (req, res) => {
   try {
      const topics = await Topic.find({
         category: req.params.category
      });

      res.json(topics);
   } catch (err) {
      res.status(500).json({ error: "Failed to fetch category topics" });
   }
});

module.exports = router;







// const express = require("express");
// const router = express.Router();

// const Topic = require("../models/Topic.js");

// router.get("/topics", async (req, res) => {
//    const topics = await Topic.find();
    
//    res.json(topics);
// });


// router.get("/topics/:slug", async (req, res) => {
//    const topic = await Topic.findOne({ slug: req.params.slug });
//    res.json(topic);
// });

// router.get("/categories", async (req, res) => {
//    const categories = await Category.find();
//    res.json(categories);
// });

// router.get("/topics/category/:category", async (req, res) => {

//    const topics = await Topic.find({
//       category: req.params.category
//    });

//    res.json(topics);

// });

// module.exports = router;

