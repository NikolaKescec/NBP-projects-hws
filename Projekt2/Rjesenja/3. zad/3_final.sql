CREATE TABLE buildings_nearest_sava AS
WITH buildings_nearest_sava AS (
	SELECT buildings.*
	FROM buildings, sava
	WHERE ST_Distance(buildings.geom, sava.geom) < 2000
)
SELECT bns.gid, bns.geom, ST_Length(ST_ShortestLine(sava.geom, bns.geom)) as distance
FROM sava, buildings_nearest_sava bns
ORDER BY distance;

CREATE VIEW overflown_sava AS
SELECT 1 as identifier, ST_Buffer(sava.geom, (SELECT distance FROM buildings_nearest_sava LIMIT 1)) as geom
FROM sava;

CREATE VIEW overflown_building AS
SELECT *
FROM buildings_nearest_sava
LIMIT 1;

SELECT distance FROM buildings_nearest_sava LIMIT 1;

/* Velika količina podataka zgrada prvo je filtrirana tako što je prvo kreirana pomoćna tablica sa zgradama koje su blizu 
Savi (ta blizina je definirana unutar 2000 metara) te s njihovim najkraćim udaljenostima do Save.
Potom je ta pomoćna tablica korištena kod izrade pregleda (views) koji predstavljaju prikaz Save izlijane na traženu najmanju
udaljenost i zgrade na koju se ta udaljenost iznosi.

Udaljenost između rijeke Save i zgrade iznosi 16.9 metara. 
Da se ta udaljenost poveća čak i 1 decimetar, Sava bi se izlila po zgradi. /*