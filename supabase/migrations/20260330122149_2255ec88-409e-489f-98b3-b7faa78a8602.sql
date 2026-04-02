
CREATE TABLE public.admin_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address text NOT NULL DEFAULT '',
  from_name text DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body_html text DEFAULT '',
  body_text text DEFAULT '',
  received_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
