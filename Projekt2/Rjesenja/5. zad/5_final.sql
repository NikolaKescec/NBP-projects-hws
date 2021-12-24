CREATE VIEW larger_cities AS 
SELECT * 
FROM places
WHERE places.fclass in ('city', 'town', 'national_capital') 
	and places.population > 30000;

/* Ovaj sql se samo koristi da pronađe gradove koji su veći od 30000 stanovnika.
Sami voronoijevi poligoni daju se pomoću tih informacija napraviti i unutar
QGISa (iako to podržava i postgis). */