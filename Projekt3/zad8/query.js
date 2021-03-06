db.products.find().forEach((product) => {
  const reviewScores = product.reviews.map((review) => review.score);
  const avgReviewScore =
    reviewScores.reduce((a, b) => a + b) / reviewScores.length;

  const reviewStats = {
    avgReviewScore,
    reviewsCount: product.reviews.length,
    reviewScoreDistrib: {
      1: reviewScores.filter((score) => score == 1).length,
      2: reviewScores.filter((score) => score == 2).length,
      3: reviewScores.filter((score) => score == 3).length,
      4: reviewScores.filter((score) => score == 4).length,
      5: reviewScores.filter((score) => score == 5).length,
    },
  };

  product.reviewStats = reviewStats;
  db.products.save(product);
});
