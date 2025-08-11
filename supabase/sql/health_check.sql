-- Minimal health check RPC for Supabase
-- Usage: SELECT rpc.health_check(); OR via client supabase.rpc('health_check')
-- Returns boolean true on success

create schema if not exists rpc;

create or replace function rpc.health_check()
returns boolean
language plpgsql
security definer
as $$
begin
  -- trivial check; extend with real validations as needed
  perform 1;
  return true;
exception when others then
  return false;
end;
$$;

-- Optional: grant execute to authenticated/anon as your app requires
-- grant execute on function rpc.health_check() to anon, authenticated;

