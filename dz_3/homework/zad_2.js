/*
Napišite M/R upit kojim ćete 'invertirati' kolekciju nobelprizes na način da za Nobelove nagrade:

u intervalu [1900, 1915]
koje nisu kategorije "peace"
za svakog laureata vratite listu njegovih nagrada sortiranu po godinama uzlazno.
Za nagradu treba vratiti samo godinu i kategoriju.
*/

let map = function () {
  prize = this;
  prize.laureates.forEach(function (laureate) {
    const key = {
      firstname: laureate.firstname,
      surname: laureate.surname,
    };
    const value = {
      prizes: [
        {
          year: prize.year,
          category: prize.category,
        },
      ],
    };

    emit(key, value);
  });
};

let reduce = function (key, values) {
  const reducedValue = { prizes: [] };

  values.forEach(function (value) {
    reducedValue.prizes = value.prizes.concat(reducedValue.prizes);
  });

  return reducedValue;
};

let finalizeSort = function(key, value) {
  const reducedValue = { prizes: [] };

  reducedValue.prizes = value.prizes.sort(function (a, b) {
    return a.year > b.year;
  });

  return reducedValue;
};

db.nobelprizes.mapReduce(map, reduce, {
  query: {
    year: { $gte: "1900", $lte: "1915" },
    category: { $ne: "peace" },
  },
  out: "mr_nobelprizes",
});
