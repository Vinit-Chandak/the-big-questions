create extension if not exists pgcrypto;

do $$
begin
  create type public.user_type as enum (
    'civic',
    'lab',
    'policy',
    'academic',
    'journalist',
    'civil_society',
    'admin'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.verification_status as enum (
    'none',
    'pending',
    'verified_affiliation',
    'official_representative',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.question_status as enum (
    'submitted',
    'shortlisted',
    'active',
    'archived',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.question_origin as enum (
    'starter',
    'public_submission',
    'admin_created'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.view_position as enum (
    'personal_view',
    'official_response',
    'unspecified'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.follow_up_status as enum (
    'open',
    'answered',
    'declined',
    'closed'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  user_type public.user_type not null default 'civic',
  verification_status public.verification_status not null default 'none',
  affiliation_org text,
  affiliation_domain text,
  public_disclaimer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  requested_status public.verification_status not null check (
    requested_status in ('verified_affiliation', 'official_representative')
  ),
  affiliation_org text not null,
  evidence_url text,
  evidence_email_domain text,
  notes text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 12 and 180),
  body text,
  status public.question_status not null default 'submitted',
  origin public.question_origin not null default 'public_submission',
  submitted_by uuid references public.profiles(id) on delete set null,
  selection_note text,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_votes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (question_id, user_id)
);

create table if not exists public.question_views (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  position public.view_position not null default 'unspecified',
  body text not null check (char_length(body) between 20 and 8000),
  source_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.view_votes (
  id uuid primary key default gen_random_uuid(),
  view_id uuid not null references public.question_views(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (view_id, user_id)
);

create table if not exists public.follow_up_requests (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  target_view_id uuid references public.question_views(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  requested_to uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) between 8 and 700),
  status public.follow_up_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follow_up_replies (
  id uuid primary key default gen_random_uuid(),
  follow_up_id uuid not null references public.follow_up_requests(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 4 and 3000),
  created_at timestamptz not null default now()
);

create table if not exists public.follow_up_votes (
  id uuid primary key default gen_random_uuid(),
  follow_up_id uuid not null references public.follow_up_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (follow_up_id, user_id)
);

create table if not exists public.bridge_summaries (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  strongest_civic_views text,
  strongest_institutional_views text,
  disagreements text,
  unanswered_concerns text,
  open_follow_ups text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (question_id)
);

create table if not exists public.content_flags (
  id uuid primary key default gen_random_uuid(),
  view_id uuid references public.question_views(id) on delete cascade,
  follow_up_id uuid references public.follow_up_requests(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 4 and 1000),
  created_at timestamptz not null default now(),
  check (num_nonnulls(view_id, follow_up_id, question_id) = 1)
);

create index if not exists questions_status_created_idx on public.questions(status, created_at desc);
create index if not exists question_views_question_created_idx on public.question_views(question_id, created_at desc);
create index if not exists follow_up_requests_question_created_idx on public.follow_up_requests(question_id, created_at desc);
create index if not exists verification_requests_created_idx on public.verification_requests(created_at desc);
create index if not exists content_flags_created_idx on public.content_flags(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_questions_updated_at on public.questions;
create trigger set_questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

drop trigger if exists set_question_votes_updated_at on public.question_votes;
create trigger set_question_votes_updated_at
before update on public.question_votes
for each row execute function public.set_updated_at();

drop trigger if exists set_question_views_updated_at on public.question_views;
create trigger set_question_views_updated_at
before update on public.question_views
for each row execute function public.set_updated_at();

drop trigger if exists set_view_votes_updated_at on public.view_votes;
create trigger set_view_votes_updated_at
before update on public.view_votes
for each row execute function public.set_updated_at();

drop trigger if exists set_follow_up_requests_updated_at on public.follow_up_requests;
create trigger set_follow_up_requests_updated_at
before update on public.follow_up_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_follow_up_votes_updated_at on public.follow_up_votes;
create trigger set_follow_up_votes_updated_at
before update on public.follow_up_votes
for each row execute function public.set_updated_at();

drop trigger if exists set_bridge_summaries_updated_at on public.bridge_summaries;
create trigger set_bridge_summaries_updated_at
before update on public.bridge_summaries
for each row execute function public.set_updated_at();

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and user_type = 'admin'
  );
$$;

create or replace function public.is_verified_institutional(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and user_type <> 'civic'
      and verification_status in ('verified_affiliation', 'official_representative')
  );
$$;

alter table public.profiles enable row level security;
alter table public.verification_requests enable row level security;
alter table public.questions enable row level security;
alter table public.question_votes enable row level security;
alter table public.question_views enable row level security;
alter table public.view_votes enable row level security;
alter table public.follow_up_requests enable row level security;
alter table public.follow_up_replies enable row level security;
alter table public.follow_up_votes enable row level security;
alter table public.bridge_summaries enable row level security;
alter table public.content_flags enable row level security;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable"
on public.profiles for select
using (true);

drop policy if exists "users can insert own civic profile" on public.profiles;
create policy "users can insert own civic profile"
on public.profiles for insert
to authenticated
with check (
  id = auth.uid()
  and user_type = 'civic'
  and verification_status = 'none'
);

drop policy if exists "users can update own public profile fields" on public.profiles;
create policy "users can update own public profile fields"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and user_type = (select user_type from public.profiles where id = auth.uid())
  and verification_status = (select verification_status from public.profiles where id = auth.uid())
);

drop policy if exists "admins can manage profiles" on public.profiles;
create policy "admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public can read non-rejected questions" on public.questions;
create policy "public can read non-rejected questions"
on public.questions for select
using (status <> 'rejected' or public.is_admin(auth.uid()));

drop policy if exists "authenticated users can submit candidate questions" on public.questions;
create policy "authenticated users can submit candidate questions"
on public.questions for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and status = 'submitted'
  and origin = 'public_submission'
);

drop policy if exists "admins can manage questions" on public.questions;
create policy "admins can manage questions"
on public.questions for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "question votes are readable" on public.question_votes;
create policy "question votes are readable"
on public.question_votes for select
using (true);

drop policy if exists "users can vote on questions" on public.question_votes;
create policy "users can vote on questions"
on public.question_votes for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can update own question votes" on public.question_votes;
create policy "users can update own question votes"
on public.question_votes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "question views are readable" on public.question_views;
create policy "question views are readable"
on public.question_views for select
using (true);

drop policy if exists "users can write active question views" on public.question_views;
create policy "users can write active question views"
on public.question_views for insert
to authenticated
with check (
  author_id = auth.uid()
  and exists (
    select 1
    from public.questions
    where questions.id = question_views.question_id
      and questions.status = 'active'
  )
  and (
    position <> 'official_response'
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and verification_status = 'official_representative'
    )
  )
);

drop policy if exists "admins can manage question views" on public.question_views;
create policy "admins can manage question views"
on public.question_views for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "view votes are readable" on public.view_votes;
create policy "view votes are readable"
on public.view_votes for select
using (true);

drop policy if exists "users can vote on views" on public.view_votes;
create policy "users can vote on views"
on public.view_votes for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can update own view votes" on public.view_votes;
create policy "users can update own view votes"
on public.view_votes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "verification requests visible to owners and admins" on public.verification_requests;
create policy "verification requests visible to owners and admins"
on public.verification_requests for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "users can request verification" on public.verification_requests;
create policy "users can request verification"
on public.verification_requests for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "admins can review verification" on public.verification_requests;
create policy "admins can review verification"
on public.verification_requests for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "follow-up requests are readable" on public.follow_up_requests;
create policy "follow-up requests are readable"
on public.follow_up_requests for select
using (true);

drop policy if exists "users can create follow-up requests" on public.follow_up_requests;
create policy "users can create follow-up requests"
on public.follow_up_requests for insert
to authenticated
with check (requested_by = auth.uid());

drop policy if exists "respondents and admins can update follow-up status" on public.follow_up_requests;
create policy "respondents and admins can update follow-up status"
on public.follow_up_requests for update
to authenticated
using (requested_to = auth.uid() or public.is_admin(auth.uid()))
with check (requested_to = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "follow-up replies are readable" on public.follow_up_replies;
create policy "follow-up replies are readable"
on public.follow_up_replies for select
using (true);

drop policy if exists "respondents and admins can reply to follow-ups" on public.follow_up_replies;
create policy "respondents and admins can reply to follow-ups"
on public.follow_up_replies for insert
to authenticated
with check (
  author_id = auth.uid()
  and exists (
    select 1
    from public.follow_up_requests
    where follow_up_requests.id = follow_up_replies.follow_up_id
      and (
        follow_up_requests.requested_to = auth.uid()
        or public.is_admin(auth.uid())
      )
  )
);

drop policy if exists "follow-up votes are readable" on public.follow_up_votes;
create policy "follow-up votes are readable"
on public.follow_up_votes for select
using (true);

drop policy if exists "users can vote on follow-ups" on public.follow_up_votes;
create policy "users can vote on follow-ups"
on public.follow_up_votes for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can update own follow-up votes" on public.follow_up_votes;
create policy "users can update own follow-up votes"
on public.follow_up_votes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "bridge summaries are readable" on public.bridge_summaries;
create policy "bridge summaries are readable"
on public.bridge_summaries for select
using (true);

drop policy if exists "admins can manage bridge summaries" on public.bridge_summaries;
create policy "admins can manage bridge summaries"
on public.bridge_summaries for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admins can read content flags" on public.content_flags;
create policy "admins can read content flags"
on public.content_flags for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "users can create content flags" on public.content_flags;
create policy "users can create content flags"
on public.content_flags for insert
to authenticated
with check (reporter_id = auth.uid());

create or replace view public.question_vote_breakdowns as
select
  question_votes.question_id,
  count(*) filter (where question_votes.value = 1 and profiles.user_type = 'civic') as civic_up,
  count(*) filter (where question_votes.value = -1 and profiles.user_type = 'civic') as civic_down,
  count(*) filter (
    where question_votes.value = 1
      and profiles.user_type <> 'civic'
      and profiles.verification_status in ('verified_affiliation', 'official_representative')
  ) as institutional_up,
  count(*) filter (
    where question_votes.value = -1
      and profiles.user_type <> 'civic'
      and profiles.verification_status in ('verified_affiliation', 'official_representative')
  ) as institutional_down,
  coalesce(sum(question_votes.value), 0) as score
from public.question_votes
join public.profiles on profiles.id = question_votes.user_id
group by question_votes.question_id;

create or replace view public.view_vote_breakdowns as
select
  view_votes.view_id,
  count(*) filter (where view_votes.value = 1 and profiles.user_type = 'civic') as civic_up,
  count(*) filter (where view_votes.value = -1 and profiles.user_type = 'civic') as civic_down,
  count(*) filter (
    where view_votes.value = 1
      and profiles.user_type <> 'civic'
      and profiles.verification_status in ('verified_affiliation', 'official_representative')
  ) as institutional_up,
  count(*) filter (
    where view_votes.value = -1
      and profiles.user_type <> 'civic'
      and profiles.verification_status in ('verified_affiliation', 'official_representative')
  ) as institutional_down,
  coalesce(sum(view_votes.value), 0) as score
from public.view_votes
join public.profiles on profiles.id = view_votes.user_id
group by view_votes.view_id;

create or replace view public.follow_up_vote_breakdowns as
select
  follow_up_votes.follow_up_id,
  count(*) filter (where follow_up_votes.value = 1 and profiles.user_type = 'civic') as civic_up,
  count(*) filter (where follow_up_votes.value = -1 and profiles.user_type = 'civic') as civic_down,
  count(*) filter (
    where follow_up_votes.value = 1
      and profiles.user_type <> 'civic'
      and profiles.verification_status in ('verified_affiliation', 'official_representative')
  ) as institutional_up,
  count(*) filter (
    where follow_up_votes.value = -1
      and profiles.user_type <> 'civic'
      and profiles.verification_status in ('verified_affiliation', 'official_representative')
  ) as institutional_down,
  coalesce(sum(follow_up_votes.value), 0) as score
from public.follow_up_votes
join public.profiles on profiles.id = follow_up_votes.user_id
group by follow_up_votes.follow_up_id;
