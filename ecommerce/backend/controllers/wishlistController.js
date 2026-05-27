const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'name images price rating numReviews stock isActive'
  );

  if (!wishlist) {
    return res.json({ products: [] });
  }

  res.json(wishlist);
});

// @desc    Add to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    // Avoid duplicates
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  const populated = await Wishlist.findById(wishlist._id).populate(
    'products',
    'name images price rating numReviews stock isActive'
  );

  res.json(populated);
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.productId
  );

  await wishlist.save();

  const populated = await Wishlist.findById(wishlist._id).populate(
    'products',
    'name images price rating numReviews stock isActive'
  );

  res.json(populated);
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
