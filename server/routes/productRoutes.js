import express from 'express';
import Product from '../mongodb/models/product.js';

const router = express.Router();

//Get
//http://localhost:8080/api/product

router.get('/', async (req, res) => {
  try {
    const currentProduct = await Product.find({});
    res.status(200).json(currentProduct);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all reviews by a specific user
//localhost:8080/api/product/Alice/reviews
router.get('/:user/reviews', async (req, res) => {
  const user = req.params.user;
  const products = await Product.find({});

  let reviews = [];
  for (let i = 0; i < products.length; i++) {
    // Retrieve all reviews for this product from the specified user
    const productReviews = products[i].reviews.filter(
      (review) => review.user === user
    );
    reviews = reviews.concat(productReviews);
  }

  if (reviews.length === 0) {
    // No reviews found for this user
    res.json({ message: 'No reviews found for this user.' });
  } else {
    // Reviews found
    res.json(reviews);
  }
});

// Route to get all reviews (rating + review) by a specific user and model
//localhost:8080/api/product/Alice/reviews/Deathadder%20V2
router.get('/:user/reviews/:model', async (req, res) => {
  const user = req.params.user;
  const model = req.params.model;

  // Find the product with the given model and the user's reviews and ratings for that product
  const product = await Product.findOne(
    {
      model: model,
      reviews: { $elemMatch: { user: user } },
      ratings: { $elemMatch: { user: user } },
    },
    {
      reviews: { $elemMatch: { user: user } },
      ratings: { $elemMatch: { user: user } },
    }
  );

  if (!product) {
    // No product found
    res.status(404).json({ message: 'Product not found.' });
  } else {
    // Review found
    const review = product.reviews[0];
    const rating = product.ratings[0];
    res.json({ user: user, review: review, rating: rating });
  }
});

// curl -X POST   -H "Content-Type: application/json"   -d '{"rating": 4, "review": "Great mouse!"}'   http://localhost:8080/api/product/Alice/reviews/Deathadder%20V2
// {"user":"Alice","review":"Great mouse!","rating":4}

// Route to add a review and rating for a specific product by model
router.post('/:user/reviews/:model', async (req, res) => {
  const user = req.params.user;
  const model = req.params.model;
  const { rating, review } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { model: model },
      {
        $push: {
          reviews: { user: user, review: review },
          ratings: { user: user, rating: rating },
        },
      },
      { new: true }
    );

    if (!product) {
      // No product found
      res.status(404).json({ message: 'Product not found.' });
    } else {
      // Review and rating added
      const addedReview = product.reviews.find((rev) => rev.user === user);
      const addedRating = product.ratings.find((rat) => rat.user === user);
      res.json({
        user: user,
        review: addedReview.review,
        rating: addedRating.rating,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// curl -X PUT -H "Content-Type: application/json" -d '{"rating": 1, "review": "NO good!"}' http://localhost:8080/api/product/Alice/reviews/Deathadder%20V2

// Route to update a review and rating for a specific product by model
router.put('/:user/reviews/:model', async (req, res) => {
  const user = req.params.user;
  const model = req.params.model;
  const { rating, review } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      {
        model: model,
        reviews: { $elemMatch: { user: user } },
        ratings: { $elemMatch: { user: user } },
      },
      { $set: { 'reviews.$.review': review, 'ratings.$.rating': rating } },
      { new: true }
    );

    if (!product) {
      // No product found
      res.status(404).json({ message: 'Product not found.' });
    } else {
      // Review and rating updated
      const updatedReview = product.reviews.find((rev) => rev.user === user);
      const updatedRating = product.ratings.find((rat) => rat.user === user);
      res.json({
        user: user,
        review: updatedReview.review,
        rating: updatedRating.rating,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// curl -X DELETE http://localhost:8080/api/product/Alice/reviews/Deathadder%20V2 -d '{"user": "Alice"}' -H "Content-Type: application/json"

// Route to delete a review and rating for a specific product by model
router.delete('/:user/reviews/:model', async (req, res) => {
  const user = req.params.user;
  const model = req.params.model;

  try {
    const product = await Product.findOneAndUpdate(
      { model: model },
      { $pull: { reviews: { user: user }, ratings: { user: user } } },
      { new: true }
    );

    if (!product) {
      // No product found
      res.status(404).json({ message: 'Product not found.' });
    } else {
      // Review and rating deleted
      res.json({ message: 'Review and rating deleted.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//Post for create.jsx

router.post('/', async (req, res) => {
  console.log(`hello from the /api/product post route!`, req.body);

  try {
    const { user, img, type, brand, model, ratings, reviews } = req.body;

    const newProduct = new Product(
      {
        user,
        type,
        brand,
        model,
        // img,
        // ratings,
        // reviews,
      }
      // req.body
    );

    const savedProduct = await newProduct.save();
    res.status(201).json({ newProduct: savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Post
// curl -X POST localhost:8080/api/product/seed

router.post('/seed', async (req, res) => {
  try {
    const createdProduct = await Product.create([
      {
        user: 'Alice',
        img: 'https://assets.hardwarezone.com/img/2021/11/omnidesk.jpg',
        type: 'Desk',
        brand: 'Omnidesk',
        model: 'Ascent Wildwood+',
        title: 'Adjustable Height Standing Desk',
        description:
          'The Omnidesk Ascent Wildwood+ is a height-adjustable desk with a solid wood desktop and a sturdy steel frame.',
        features: [
          { name: 'Height-adjustable' },
          { name: 'Sturdy construction' },
          { name: 'Cable management' },
          { name: 'Memory settings' },
          { name: 'LED lighting' },
          { name: 'Wireless charging' },
          { name: 'USB ports' },
          { name: 'Eco-friendly' },
        ],
        specifications: [
          { name: 'Desktop material', stat: 'Solid wood' },
          { name: 'Desktop dimensions', stat: '120cm x 60cm' },
          { name: 'Height range', stat: '63cm - 128cm' },
          { name: 'Weight capacity', stat: '120kg' },
          { name: 'Frame material', stat: 'Steel' },
          { name: 'Frame color', stat: 'Black' },
        ],
        ratings: [
          {
            user: 'Alice',
            rating: 4,
            review:
              "I love this desk! It's very sturdy and looks great in my home office.",
          },
        ],
      },
      {
        user: 'Alice',
        img: 'https://assets.hardwarezone.com/img/2019/10/xiaomi-mi-surface.jpg',
        type: 'Monitor',
        brand: 'Xiaomi',
        model: 'Curved Gaming Monitor 34',
        title: 'Ultra-Wide 1440p Gaming Monitor',
        description:
          'The Xiaomi Curved Gaming Monitor 34 is an ultra-wide gaming monitor with a resolution of 1440p, a 144Hz refresh rate, and FreeSync technology.',
        features: [
          { name: '34-inch curved display' },
          { name: '1440p resolution' },
          { name: '144Hz refresh rate' },
          { name: 'FreeSync technology' },
          { name: '4ms response time' },
          { name: 'HDR10 support' },
          { name: 'Multiple ports (HDMI, DisplayPort)' },
          { name: 'Adjustable stand' },
        ],
        specifications: [
          { name: 'Display size', stat: '34 inches' },
          { name: 'Resolution', stat: '3440 x 1440' },
          { name: 'Refresh rate', stat: '144Hz' },
          { name: 'Response time', stat: '4ms' },
          { name: 'Brightness', stat: '300 cd/m²' },
          { name: 'Contrast ratio', stat: '3000:1' },
          { name: 'Color gamut', stat: 'sRGB 121%, DCI-P3 85%' },
          { name: 'Ports', stat: '2 x HDMI, 2 x DisplayPort' },
          { name: 'Dimensions', stat: '810 x 520 x 250 mm' },
          { name: 'Weight', stat: '7.2 kg' },
        ],
        ratings: [
          {
            user: 'Alice',
            rating: 5,
            review:
              'The Xiaomi Curved Gaming Monitor 34 is amazing. The picture quality is stunning and the curved design really immerses you in the game.',
          },
        ],
      },
      {
        user: 'Alice',
        img: 'https://press.razer.com/wp-content/uploads/2020/01/DAV2_1-1024x576.png',
        type: 'Mouse',
        brand: 'Razer',
        model: 'DeathAdder V2',
        title: 'Ergonomic Wired Gaming Mouse',
        description:
          'The Razer DeathAdder V2 is an ergonomic wired gaming mouse designed for high-performance gaming.',
        features: [
          { name: 'Ergonomic design' },
          { name: 'High-precision sensor' },
          { name: 'Customizable RGB lighting' },
          { name: 'Programmable buttons' },
          { name: 'On-board memory' },
          { name: 'Razer Chroma' },
          { name: 'Speedflex cable' },
        ],
        specifications: [
          { name: 'Sensor', stat: 'Razer Focus+ Optical Sensor' },
          { name: 'Sensitivity', stat: '20,000 DPI' },
          { name: 'Acceleration', stat: '650 IPS / 50G' },
          { name: 'Buttons', stat: '8 programmable buttons' },
          { name: 'Polling Rate', stat: '1000 Hz' },
          { name: 'Cable Length', stat: '2.1 meters' },
          { name: 'Weight', stat: '82g' },
        ],
        ratings: [
          {
            user: 'Alice',
            rating: 5,
            review:
              "This is the best gaming mouse I've ever used. The precision is amazing and the customizable lighting is a nice touch.",
          },
        ],
      },
      {
        user: 'Alice',
        img: 'https://assets2.razerzone.com/images/pnx.assets/d493370b21999f3f6d72904ecff2b682/razer-blackwidow-v4-pro-wrist-rest-1920x700.jpg',
        type: 'Keyboard',
        brand: 'Razer',
        model: 'BlackWidow V4 Pro',
        title: 'Mechanical Gaming Keyboard',
        description:
          "The Razer BlackWidow V4 Pro is a premium mechanical gaming keyboard featuring Razer's Green mechanical switches and Chroma RGB lighting.",
        features: [
          { name: 'Razer Green mechanical switches' },
          { name: 'Chroma RGB lighting' },
          { name: 'Ergonomic wrist rest' },
          { name: 'Magnetic media dock with USB passthrough' },
          { name: 'Fully programmable keys with on-board memory' },
        ],
        specifications: [
          { name: 'Switch type', stat: 'Razer Green mechanical switches' },
          { name: 'Keycaps', stat: 'Doubleshot ABS' },
          { name: 'Lighting', stat: 'Razer Chroma RGB' },
          { name: 'Connectivity', stat: 'Wired, USB Type-C' },
          { name: 'Cable length', stat: '6.0 ft / 1.8 m' },
        ],
        ratings: [
          { user: 'Alice', rating: 4, review: 'Great keyboard for gaming!' },
        ],
      },
      {
        user: 'Bob',
        img: 'https://assets.hardwarezone.com/img/2019/10/xiaomi-mi-surface.jpg',
        type: 'Monitor',
        brand: 'Xiaomi',
        model: 'Curved Gaming Monitor 34',
        title: 'Gaming Monitor',
        description:
          'A high-performance curved gaming monitor with a 144Hz refresh rate and AMD FreeSync technology.',
        features: [
          { name: '34-inch curved display' },
          { name: '144Hz refresh rate' },
          { name: 'AMD FreeSync technology' },
        ],
        specifications: [
          { name: 'Display size', stat: '34 inches' },
          { name: 'Resolution', stat: '3440 x 1440' },
          { name: 'Refresh rate', stat: '144Hz' },
          { name: 'Response time', stat: '4ms' },
        ],
        ratings: [
          {
            user: 'Bob',
            rating: 3,
            review: 'Nice monitor',
          },
        ],
      },
      {
        user: 'Bob',
        img: 'https://press.razer.com/wp-content/uploads/2020/01/DAV2_1-1024x576.png',
        type: 'Mouse',
        brand: 'Razer',
        model: 'DeathAdder V2',
        title: 'Best Gaming Mouse',
        description:
          'The Razer DeathAdder V2 is a high-precision gaming mouse with a focus on speed and accuracy.',
        features: [
          { name: '20,000 DPI optical sensor' },
          { name: '8 programmable buttons' },
          { name: 'Chroma RGB lighting' },
        ],
        specifications: [
          { name: 'Sensor', stat: 'Razer Focus+ Optical Sensor' },
          { name: 'DPI', stat: '20,000 DPI' },
          { name: 'Speed', stat: '650 IPS' },
          { name: 'Acceleration', stat: '50 G' },
          { name: 'Polling rate', stat: '1000Hz' },
        ],
        ratings: [
          {
            user: 'Bob',
            rating: 4,
            review: 'Good Product!',
          },
        ],
      },
      {
        user: 'Lindsey',
        img: 'https://assets2.razerzone.com/images/pnx.assets/d493370b21999f3f6d72904ecff2b682/razer-blackwidow-v4-pro-wrist-rest-1920x700.jpg',
        type: 'Keyboard',
        brand: 'Razer',
        model: 'BlackWidow V4 Pro',
        title: 'Best Gaming Keyboard',
        description:
          'The Razer BlackWidow V4 Pro is a mechanical gaming keyboard with Razer Chroma RGB lighting and wireless connectivity.',
        features: [
          { name: 'Mechanical switches' },
          { name: 'Wireless connectivity' },
          { name: 'Customizable Chroma RGB lighting' },
        ],
        specifications: [
          {
            name: 'Keys',
            stat: 'Fully programmable keys with on-the-fly macro recording',
          },
          { name: 'Lighting', stat: 'Customizable Chroma RGB lighting' },
          {
            name: 'Battery life',
            stat: 'Up to 200 hours with backlighting off',
          },
          { name: 'Dimensions', stat: '463mm x 174mm x 36mm' },
          { name: 'Weight', stat: '1.95kg' },
        ],
        ratings: [
          {
            user: 'Lindsey',
            rating: 5,
            review:
              'I absolutely love this keyboard! The mechanical switches feel great and the wireless connectivity is so convenient. Plus, the Chroma RGB lighting looks amazing. I highly recommend it!',
          },
        ],
      },
      {
        user: 'Lindsey',
        img: 'https://www.example.com/images/xiaomi-curved-gaming-monitor.jpg',
        type: 'Monitor',
        brand: 'Xiaomi',
        model: 'Curved Gaming Monitor 34',
        title: 'Gaming Monitor 34',
        description:
          'The Xiaomi Curved Gaming Monitor 34 is a 34-inch curved ultrawide gaming monitor with a high refresh rate and QHD resolution.',
        features: [
          { name: '34-inch curved ultrawide display' },
          { name: '144Hz refresh rate' },
          { name: 'AMD FreeSync technology' },
        ],
        specifications: [
          { name: 'Screen size', stat: '34 inches' },
          { name: 'Resolution', stat: '3440 x 1440 (QHD)' },
          { name: 'Aspect ratio', stat: '21:9' },
          { name: 'Refresh rate', stat: '144Hz' },
          { name: 'Response time', stat: '1ms' },
          { name: 'Color gamut', stat: 'sRGB 121%' },
          { name: 'Contrast ratio', stat: '3000:1' },
          { name: 'Brightness', stat: '300 cd/m²' },
        ],
        ratings: [
          {
            user: 'Lindsey',
            rating: 4,
            review:
              "This monitor is great for gaming! The ultrawide display and high refresh rate really make games look and feel amazing. My only complaint is that the colors aren't quite as accurate as I would like, but it's still a great monitor overall.",
          },
        ],
      },
    ]);
    res.status(200).send(createdProduct);
  } catch (e) {
    console.log(e);
  }
});

//Put
//curl -X PUT -H "Content-Type: application/json" -d
//'{"ratings":[{"user":"John","rating":4.5}],"reviews":[{"user":"Jane","review":"This is a great product"}]}' http://localhost:8080/api/product/Keyboard

router.put('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { ratings, reviews } = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { type },
      { ratings, reviews },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product type not found' });
    }

    res.json(updatedProduct);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

//Delete
//curl -X DELETE http://localhost:8080/api/product/Desk

router.delete('/:type', async (req, res) => {
  try {
    const { type } = req.params;

    const deletedProduct = await Product.findOneAndDelete({ type });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product type not found' });
    }

    res.json(deletedProduct);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
