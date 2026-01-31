const PostModel = require("../models/postsModel");

// Create a new post
const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = await PostModel.create(post);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPost,
};
