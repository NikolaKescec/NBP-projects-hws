CREATE TABLE sava AS
SELECT 1 as identifier, ST_CollectionExtract(ST_Collect(sava.geom), 2) as geom
FROM (
    SELECT water.geom
    FROM water
    WHERE LOWER(water.name) LIKE '%sava%'
    UNION
    SELECT waterways.geom
    FROM waterways
    WHERE LOWER(waterways.name) LIKE '%sava%'
) as sava;

SELECT four_regie.identifier, ST_Length(ST_Intersection(four_regie.geom, sava.geom)) as distance
FROM four_regie, sava
WHERE ST_Intersects(four_regie.geom, sava.geom);

/* UDALJENOSTI:
1: 0 KM
2: 113,463 KM
3. 0 KM
4. 233,354 KM

Stvaranjem tablice koja sadržava samo geometrijsko tijelo koje predstavlja Savu (radi optimiziranja budućih upita)
lagano je pomoću QGISa prikazati Savu te izračunati duljinu njenog presjeka s dobivenim regijama. /*