CREATE TABLE musical_instrument_review(
	id SERIAL primary key,
	category VARCHAR(250) NOT NULL,
    reviewed_product_title TEXT NOT NULL,
    reviewer_name VARCHAR(250) NOT NULL,
    review_time BIGINT,
    review_summary TEXT NOT NULL,
    review_text TEXT NOT NULL,
    all_text_tsv TSVECTOR
);

CREATE TRIGGER musical_instrument_review_tsv
    BEFORE INSERT OR UPDATE ON musical_instrument_review
    FOR EACH ROW
    EXECUTE PROCEDURE tsvector_update_trigger(all_text_tsv,'pg_catalog.english', reviewed_product_title, reviewer_name, review_summary);

CREATE INDEX gin_index_tsv ON question_answer USING gin(all_text_tsv);