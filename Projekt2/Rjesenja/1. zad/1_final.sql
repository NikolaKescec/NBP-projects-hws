CREATE TABLE four_regie AS
WITH grouped_regies AS (
	SELECT MOD(ROW_NUMBER() OVER(), 4)+1 as group, geom
	FROM muny_1
)
SELECT ROW_NUMBER() OVER() AS identifier, ST_Union(grouped_regies.geom) as geom
FROM grouped_regies
GROUP BY grouped_regies.group;

/* Stvorio sam tablicu koja sadržava uniju svih 
geometrijskih tijela koja predstavljaju županije 
grupiranih po njihovom redoslijedu u pomoćnoj CTE tablici (modulo 4 aritmetika).
Unutar QGISa sam, ovisno o dodijeljenom ID-u (rang u konačnoj tablici)
različite obojao pripadajuće regije. */