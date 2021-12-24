CREATE TABLE forest_area AS
SELECT muny_1.*, SUM(ST_Area(ST_Intersection(muny_1.geom, landuse.geom))) as forest_area
FROM muny_1, landuse
WHERE landuse.fclass = 'forest' AND ST_Intersects(muny_1.geom, landuse.geom)
GROUP BY muny_1.gid;

/* Stvorio sam tablicu unutar koje svaka ntorka predstavlja zapis žopanije i površinu šuma koja ona sadržava.
Pomoću tih površina sam u QGISu kategorijama različitim bojama označio količinu šume po županiji. */