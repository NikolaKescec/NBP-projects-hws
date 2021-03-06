{
  let map = function () {
    emit(this.product, { reviews: [this.review] });
  };

  let reduce = function (key, values) {
    const reducedValue = { reviews: [] };

    values.forEach((value) => {
      reducedValue.reviews = value.reviews.concat(reducedValue.reviews);
    });

    return reducedValue;
  };

  db.getCollection("office-products").mapReduce(map, reduce, {
    out: "mr_products",
  });

  db.getCollection("mr_products")
    .find()
    .forEach((entry) => {
      const product = {
        _id: entry._id.productId,
        title: entry._id.title,
        reviews: entry.value.reviews,
      };

      if (entry._id.price && entry._id.price !== "unknown") {
        product.price = entry._id.price;
      }

      db.products.insertOne(product);
    });

  db.getCollection("mr_products").drop();

  db.products.find();
}
