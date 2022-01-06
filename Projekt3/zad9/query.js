{
  let map = function () {
    this.reviews.forEach((review) => {
      if (review.userId !== "unknown") {
        emit(review.userId, { reviewCount: 1 });
      }
    });
  };

  let reduce = function (key, values) {
    const reducedValue = { reviewCount: 0 };

    values.forEach((value) => {
      reducedValue.reviewCount += value.reviewCount;
    });

    return reducedValue;
  };

  db.products.mapReduce(map, reduce, {
    out: "user_reviews",
  });
}

// Korisnik s najviše reviewa: A3OXHLG6DIBRW8 (56)
db.user_reviews.find().sort({ value: -1 }).limit(1);

// Korisnik s najmanje reviewa: A2MDKCULR2EB80 (1)
db.user_reviews.find().sort({ value: 1 }).limit(1);

// Recenzije korisnika s najviše recenzija: VRIJEME IZVOĐENJA BEZ INDEKSA: 0.088
db.products.find({reviews: {$elemMatch: {userId:'A3OXHLG6DIBRW8'}}})

// Recenzije korisnika s najmanje recenzija: VRIJEME IZVOĐENJA BEZ INDEKSA: 0.047
db.products.find({reviews: {$elemMatch: {userId:'A2MDKCULR2EB80'}}})

// Stvaranje indeksa
db.products.createIndex({"reviews.userId": 1})

// Recenzije korisnika s najviše recenzija: VRIJEME IZVOĐENJA BEZ INDEKSA: 0.008
db.products.find({reviews: {$elemMatch: {userId:'A3OXHLG6DIBRW8'}}})

// Recenzije korisnika s najmanje recenzija: VRIJEME IZVOĐENJA BEZ INDEKSA: 0.002
db.products.find({reviews: {$elemMatch: {userId:'A2MDKCULR2EB80'}}})

// Obšanjenje pretraživanja uz pomoć indeksa.
db.products.find({reviews: {$elemMatch: {userId:'A3OXHLG6DIBRW8'}}}).explain()