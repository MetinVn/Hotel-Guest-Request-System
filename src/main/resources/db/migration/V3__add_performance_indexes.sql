CREATE INDEX IF NOT EXISTS idx_guest_requests_status
    ON guest_requests (status);

CREATE INDEX IF NOT EXISTS idx_guest_requests_priority
    ON guest_requests (priority);

CREATE INDEX IF NOT EXISTS idx_guest_requests_created_at
    ON guest_requests (created_at);

CREATE INDEX IF NOT EXISTS idx_guest_requests_guest_name
    ON guest_requests (guest_name);

CREATE INDEX IF NOT EXISTS idx_guest_requests_room_number
    ON guest_requests (room_number);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_guest_requests_guest_name_trgm
    ON guest_requests USING GIN (lower(guest_name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_guest_requests_room_number_trgm
    ON guest_requests USING GIN (lower(room_number) gin_trgm_ops);
