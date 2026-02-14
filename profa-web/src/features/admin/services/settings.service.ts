import { createClient } from "@/shared/lib/supabase/client";

export interface SystemSetting<T = any> {
    key: string;
    value: T;
    description?: string;
}

export const SettingsService = {
    async get<T>(key: string, defaultValue: T): Promise<T> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error || !data) return defaultValue;
        return data.value as T;
    },

    async set<T>(key: string, value: T): Promise<boolean> {
        const supabase = createClient();
        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key,
                value: value as any,
                updated_at: new Date().toISOString()
            });

        return !error;
    },

    async getAll(): Promise<Record<string, any>> {
        const supabase = createClient();
        const { data } = await supabase.from('system_settings').select('key, value');
        if (!data) return {};

        return data.reduce((acc, curr) => ({
            ...acc,
            [curr.key]: curr.value
        }), {});
    }
};
