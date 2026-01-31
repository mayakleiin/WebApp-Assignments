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

// Get a Post by ID
const getPostById = async (req, res) => {
  const postId = req.params.post_id;
  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    return res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Update a Post
const updatePost = async (req, res) => {
  const postId = req.params.post_id;
  const updatedData = req.body;
  try {
    const post = await PostModel.findByIdAndUpdate(postId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!post) return res.status(404).send("Post not found");
    return res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
};
