/*
Koristeći kolekciju dvdrent za svaku glumca ispisati:

različite kategorije filmova u kojima je glumio/la
različite filmove u kojima je glumio/la
U obzir uzeti samo filmove koji imaju više od jedne kategorije.
Npr. ako u kolekciji imamo sljedeće posudbe filmova:

Film1, [Action], [Actor1, Actor2]
Film2, [SF, Horror], [Actor1]
Film3, [Drama, SF], [Actor1, Actor2]
onda:

Film1 se zanemaruje jer ima samo jednu kategoriju
Actor1 ima kategorije [Drama, Horor, SF] i filmove [Film2, Film3]
Actor2 ima kategorije [Drama, SF] i filmove [Film3]
Filmove i kategorije u rezultatu poredati abecedno.* Za glumca ispisat id i puno ime.
*/

let map = function () {
  if (this.film.categories.length >= 2) {
    movie = this.film;
    movie.actors.forEach(function (actor) {
      const key = {
        id: actor.actor_id,
        fullname: actor.first_name + " " + actor.last_name,
      };
      const value = {
        categories: movie.categories.map(function (category) {
          return category.name;
        }),
        films: [movie.title],
      };

      emit(key, value);
    });
  }
};

let reduce = function (key, values) {
  const reducedValue = { categories: [], films: [] };

  values.forEach(function (value) {
    reducedValue.categories = value.categories.concat(reducedValue.categories);
    reducedValue.films = value.films.concat(reducedValue.films);
  });

  return reducedValue;
};

let finalizeUniqueSort = function(key, value) {
  const reducedValue = { categories: [], films: [] };

  reducedValue.categories = value.categories.filter(
    (obj, idx, arr) => arr.findIndex((o) => o === obj) === idx
  );
  reducedValue.films = value.films.filter(
    (obj, idx, arr) => arr.findIndex((o) => o === obj) === idx
  );

  reducedValue.categories.sort();
  reducedValue.films.sort();

  return reducedValue;
};
