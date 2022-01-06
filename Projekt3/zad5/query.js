{
  let map = function () {
    emit(this.product.productId, { prices: [this.product.price] });
  };

  let reduce = function (key, values) {
    const reducedValue = { prices: [] };

    values.forEach((value) => {
      value.prices.forEach((price) => {
        if (!reducedValue.prices.includes(price)) {
          reducedValue.prices.push(price);
        }
      });
    });

    return reducedValue;
  };

  let finalize = function (key, reducedValue) {
    return { count: reducedValue.prices.length };
  };

  db.getCollection("office-products").mapReduce(map, reduce, {
    out: "mr_office_products",
    finalize,
  });

  db.getCollection("mr_office_products")
    .find()
    .forEach((entry) => {
      if (entry.value.count != 1) {
        db.getCollection("office-products").remove({
          "product.productId": { $eq: entry._id },
        });
        print("Deleted: " + entry._id);
      }
    });

  print("Finished!");
}
