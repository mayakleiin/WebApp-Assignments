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

// Get All Posts + Get Posts by Sender
const getAllPosts = async (req, res) => {
  const filter = req.query.sender; // Get Posts by Sender (as required)
  try {
    if (filter) {
      const posts = await PostModel.find({ sender: filter });
      return res.status(200).send(posts);
    }

    const posts = await PostModel.find();
    return res.status(200).send(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createPost,
  getAllPosts,
};
