{
  let map = function () {
    emit(this._id, { review_number: this.reviews.length });
  };

  let reduce = function (key, values) {
    return values;
  };

  let finalize = function (key, reducedValues) {
    return reducedValues[0].review_number;
  };

  db.products.mapReduce(map, reduce, {
    out: "product_number",
    finalize
  });
}

// Najviše recenzija
db.product_number.find().sort({ "value": -1 }).limit(10);
// Najmanje recenzija
db.product_number.find().sort({ "value": 1 }).limit(10);

