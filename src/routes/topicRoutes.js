const express = require("express");
const router = express.Router();

const Topic = require("../models/Topic.js");

router.get("/topics", async (req, res) => {
   const topics = await Topic.find();
    
   res.json(topics);
});


router.get("/topics/:slug", async (req, res) => {
   const topic = await Topic.findOne({ slug: req.params.slug });
   res.json(topic);
});

router.get("/categories", async (req, res) => {
   const categories = await Category.find();
   res.json(categories);
});

router.get("/topics/category/:category", async (req, res) => {

   const topics = await Topic.find({
      category: req.params.category
   });

   res.json(topics);

});

module.exports = router;