DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'web_vital_metric') THEN
    CREATE TYPE web_vital_metric AS ENUM ('lcp', 'inp', 'cls', 'fcp', 'ttfb');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'web_vital_rating') THEN
    CREATE TYPE web_vital_rating AS ENUM ('good', 'needs-improvement', 'poor');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'system_notification_type') THEN
    CREATE TYPE system_notification_type AS ENUM ('success', 'info', 'warning', 'error');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS web_vital_metric_sample (
  id text PRIMARY KEY,
  metric_id text NOT NULL,
  metric web_vital_metric NOT NULL,
  rating web_vital_rating NOT NULL,
  value double precision NOT NULL,
  delta double precision NOT NULL,
  route_path text NOT NULL,
  navigation_type text NOT NULL,
  source text NOT NULL DEFAULT 'web-vitals',
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS web_vital_metric_sample_metric_idx
  ON web_vital_metric_sample (metric);
CREATE INDEX IF NOT EXISTS web_vital_metric_sample_rating_idx
  ON web_vital_metric_sample (rating);
CREATE INDEX IF NOT EXISTS web_vital_metric_sample_route_path_idx
  ON web_vital_metric_sample (route_path);
CREATE INDEX IF NOT EXISTS web_vital_metric_sample_created_at_idx
  ON web_vital_metric_sample (created_at);
CREATE INDEX IF NOT EXISTS web_vital_metric_sample_metric_id_idx
  ON web_vital_metric_sample (metric_id);

CREATE TABLE IF NOT EXISTS system_notification (
  id text PRIMARY KEY,
  type system_notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  description text,
  source text NOT NULL,
  metadata jsonb NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS system_notification_type_idx
  ON system_notification (type);
CREATE INDEX IF NOT EXISTS system_notification_source_idx
  ON system_notification (source);
CREATE INDEX IF NOT EXISTS system_notification_read_at_idx
  ON system_notification (read_at);
CREATE INDEX IF NOT EXISTS system_notification_created_at_idx
  ON system_notification (created_at);
