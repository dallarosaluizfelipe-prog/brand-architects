
CREATE TABLE public.thermometers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  client_name text NOT NULL DEFAULT '',
  client_logo_url text NOT NULL DEFAULT '',
  accent_color text NOT NULL DEFAULT '#000000',
  admin_email text NOT NULL DEFAULT 'lipe@estudiodalla.com',
  welcome_title text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.thermometer_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thermometer_id uuid NOT NULL REFERENCES public.thermometers(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  question_text text NOT NULL DEFAULT '',
  left_label text NOT NULL DEFAULT '',
  left_icon text NOT NULL DEFAULT '',
  right_label text NOT NULL DEFAULT '',
  right_icon text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_thermometer_questions_thermo ON public.thermometer_questions(thermometer_id, order_index);

CREATE TABLE public.thermometer_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thermometer_id uuid NOT NULL REFERENCES public.thermometers(id) ON DELETE CASCADE,
  client_email text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  completed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_thermometer_responses_thermo ON public.thermometer_responses(thermometer_id);

CREATE TABLE public.thermometer_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid NOT NULL REFERENCES public.thermometer_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.thermometer_questions(id) ON DELETE CASCADE,
  value integer NOT NULL CHECK (value BETWEEN 1 AND 10),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_thermometer_answers_response ON public.thermometer_answers(response_id);

ALTER TABLE public.thermometers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thermometer_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thermometer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thermometer_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active thermometers"
  ON public.thermometers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read thermometer questions"
  ON public.thermometer_questions FOR SELECT
  USING (true);

CREATE POLICY "Public insert thermometer responses"
  ON public.thermometer_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public insert thermometer answers"
  ON public.thermometer_answers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.thermometers_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_thermometers_updated
  BEFORE UPDATE ON public.thermometers
  FOR EACH ROW EXECUTE FUNCTION public.thermometers_set_updated_at();
