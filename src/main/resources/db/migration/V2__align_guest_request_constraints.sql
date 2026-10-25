DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM guest_requests
        WHERE room_number IS NULL
           OR btrim(room_number) = ''
           OR char_length(room_number) > 10
    ) THEN
        RAISE EXCEPTION 'guest_requests.room_number contains null, blank, or overlength values; repair them before migrating';
    END IF;

    IF EXISTS (
        SELECT 1 FROM guest_requests
        WHERE guest_name IS NULL
           OR btrim(guest_name) = ''
           OR char_length(guest_name) > 100
    ) THEN
        RAISE EXCEPTION 'guest_requests.guest_name contains null, blank, or overlength values; repair them before migrating';
    END IF;

    IF EXISTS (
        SELECT 1 FROM guest_requests
        WHERE description IS NULL
           OR btrim(description) = ''
           OR char_length(description) > 1000
    ) THEN
        RAISE EXCEPTION 'guest_requests.description contains null, blank, or overlength values; repair them before migrating';
    END IF;
END $$;

UPDATE guest_requests
SET status = 'PENDING'
WHERE status IS NULL;

ALTER TABLE guest_requests
    ALTER COLUMN room_number TYPE VARCHAR(10),
    ALTER COLUMN room_number SET NOT NULL,
    ALTER COLUMN guest_name TYPE VARCHAR(100),
    ALTER COLUMN guest_name SET NOT NULL,
    ALTER COLUMN description TYPE VARCHAR(1000),
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'PENDING',
    ALTER COLUMN status SET NOT NULL;

ALTER TABLE guest_requests
    ADD CONSTRAINT guest_requests_room_number_not_blank CHECK (btrim(room_number) <> ''),
    ADD CONSTRAINT guest_requests_guest_name_not_blank CHECK (btrim(guest_name) <> ''),
    ADD CONSTRAINT guest_requests_description_not_blank CHECK (btrim(description) <> '');
