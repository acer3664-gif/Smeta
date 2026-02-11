
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tszoyhlcrrztgvbsanlb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzem95aGxjcnJ6dGd2YnNhbmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTczOTUsImV4cCI6MjA4NjM3MzM5NX0.N6pZzHZh_IoRn9qxgCuIU3p8L85QORLeDTMImrKHvys';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
