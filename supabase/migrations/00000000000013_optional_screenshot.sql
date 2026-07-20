-- Payment screenshots are no longer collected at checkout — the
-- transaction ID alone is enough for manual verification.
alter table public.payment_submissions
  alter column screenshot_path drop not null;
