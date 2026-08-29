import { createClient } from "@supabase/supabase-js";

console.log("SERVICE ROLE =", process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
