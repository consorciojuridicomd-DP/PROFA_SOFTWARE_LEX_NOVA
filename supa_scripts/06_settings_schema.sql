-- System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can read (public settings), only Admin can update
CREATE POLICY "Public read access to system settings"
    ON public.system_settings FOR SELECT
    USING (true);

CREATE POLICY "Admin update access to system settings"
    ON public.system_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin insert access to system settings"
    ON public.system_settings FOR INSERT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Seed default settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('maintenance_mode', 'false'::jsonb, 'If true, only admins can login'),
    ('allow_registration', 'true'::jsonb, 'If false, new signups are blocked'),
    ('support_contact', '{"email": "soporte@lexnova.app", "phone": "555-0123"}'::jsonb, 'Contact info displayed to students')
ON CONFLICT (key) DO NOTHING;

-- RPC to update settings securely (optional, but RLS update is fine too)
-- We'll use direct table access for simplicity unless logic is needed.
