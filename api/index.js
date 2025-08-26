const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: "ChIJBeDBGblJzDERuaN0Bj5Yelw",
        key: "AIzaSyB7PwQnJ_lgoIzUAr2mhzi5_L_7S1LIhbs",
        fields: "reviews(author_name,author_url,profile_photo_url,rating,text,time),rating,user_ratings_total"
      }
    });

    const data = response.data.result;

    res.json({
      total: data.user_ratings_total,
      rating: data.rating,
      reviews: data.reviews
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;





