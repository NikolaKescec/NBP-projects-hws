let map = function () {
  const rental = this;
  if (rental.payment && rental.payment.payment_date) {
    const paymentYear = new Date(rental.payment.payment_date).getFullYear();
    if (paymentYear <= 2016) {
      const key = {
        year: 2016,
      };

      let rentalPaymentAmount = rental.payment.amount;

      let value;
      if (paymentYear === 2016) {
        value = {
          year2016: [rentalPaymentAmount],
          yearsBefore: [],
        };
      } else {
        value = {
          year2016: [],
          yearsBefore: [rentalPaymentAmount],
        };
      }

      emit(key, value);
    }
  }
};

let reduce = function (key, values) {
  const reducedValue = { year2016: [], yearsBefore: [] };

  values.forEach(function (value) {
    reducedValue.year2016 = value.year2016.concat(reducedValue.year2016);
    reducedValue.yearsBefore = value.yearsBefore.concat(reducedValue.yearsBefore);
  });

  return reducedValue;
};

let finalizeAverage = function (key, values) {
  const finalizedValue = {};

  const avg2016 = Array.sum(values.year2016) / values.year2016.length;
  const avgBefore = Array.sum(values.yearsBefore) / values.yearsBefore.length;       

  const difference = ((avg2016 / avgBefore) * 100 - 100).toFixed(2);

  finalizedValue.avg = avg2016.toFixed(4);
  finalizedValue.diff = difference + "%";

  return finalizedValue;
};

db.nobelprizes.mapReduce(map, reduce, {
  finalize: finalizeAverage,
  out: "mr_dvdrent",
});
