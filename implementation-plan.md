## Implementation Plan

### Approach
Ship the smallest useful version of a weekly AI civic hearing. Keep the stack simple and center the product on one featured question, free-text views from civic and institutional users, visible upvote/downvote signals, verification, and follow-up clarification requests.

### V1 Scope
- Launch with one or two founder-selected starter questions.
- Let public users submit candidate questions from day one.
- Let users upvote and downvote candidate questions.
- Admin selects one weekly featured question.
- Civic users submit free-text views.
- Verified institutional users submit free-text views.
- Users can read all views together or filter by civic/institutional author type.
- Users can request follow-up clarification on the question or a specific view.
- Follow-up requests can be answered, declined, or closed.
- Bridge View summarizes strong views, disagreement, unanswered concerns, and open follow-ups.
- Verification supports affiliation and official-response badges.

## Milestones

- **M0: Foundation**: Repo scaffold, deploy target, auth, database connection, base theme.
- **M1: Profiles and verification**: User profiles, user type, verification status, affiliation metadata.
- **M2: Starter questions**: Seed one or two initial featured questions through admin tools or seed data.
- **M3: Candidate questions**: Submission form, admin queue, upvote/downvote, duplicate/cluster notes.
- **M4: Weekly question page**: Active question, all-views feed, civic/institutional filters, free-text composer.
- **M5: View voting**: Upvote/downvote views with separate civic and institutional breakdowns.
- **M6: Follow-ups**: Clarification requests attached to questions or views, answer/decline/close status, follow-up voting.
- **M7: Bridge View**: Admin-written or assisted summary with explicit unanswered concerns and open follow-ups.
- **M8: Weekly publishing flow**: Archive old question, publish selected question, keep public selection note.
- **M9: Moderation basics**: Roles, flags, review queue, verification review, appeals note.

## Minimal Schema

Use Supabase Postgres to start.

```sql
create type user_type as enum (
  'civic',
  'lab',
  'policy',
  'academic',
  'journalist',
  'civil_society',
  'admin'
);

create type verification_status as enum (
  'none',
  'pending',
  'verified_affiliation',
  'official_representative',
  'rejected'
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  user_type user_type not null default 'civic',
  verification_status verification_status not null default 'none',
  affiliation_org text,
  affiliation_domain text,
  public_disclaimer text,
  created_at timestamptz default now()
);

create table if not exists verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  requested_status verification_status not null,
  affiliation_org text,
  evidence_url text,
  evidence_email_domain text,
  notes text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create type question_status as enum (
  'submitted',
  'shortlisted',
  'active',
  'archived',
  'rejected'
);

create type question_origin as enum (
  'starter',
  'public_submission',
  'admin_created'
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  status question_status not null default 'submitted',
  origin question_origin not null default 'public_submission',
  submitted_by uuid references profiles(id) on delete set null,
  selection_note text,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists question_votes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (question_id, user_id)
);

create type view_position as enum (
  'personal_view',
  'official_response',
  'unspecified'
);

create table if not exists question_views (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  position view_position not null default 'unspecified',
  body text not null,
  source_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists view_votes (
  id uuid primary key default gen_random_uuid(),
  view_id uuid not null references question_views(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (view_id, user_id)
);

create type follow_up_status as enum (
  'open',
  'answered',
  'declined',
  'closed'
);

create table if not exists follow_up_requests (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  target_view_id uuid references question_views(id) on delete cascade,
  requested_by uuid not null references profiles(id) on delete cascade,
  requested_to uuid references profiles(id) on delete set null,
  body text not null,
  status follow_up_status not null default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists follow_up_replies (
  id uuid primary key default gen_random_uuid(),
  follow_up_id uuid not null references follow_up_requests(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists follow_up_votes (
  id uuid primary key default gen_random_uuid(),
  follow_up_id uuid not null references follow_up_requests(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (follow_up_id, user_id)
);

create table if not exists bridge_summaries (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  strongest_civic_views text,
  strongest_institutional_views text,
  disagreements text,
  unanswered_concerns text,
  open_follow_ups text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists content_flags (
  id uuid primary key default gen_random_uuid(),
  view_id uuid references question_views(id) on delete cascade,
  follow_up_id uuid references follow_up_requests(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  reporter_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  created_at timestamptz default now()
);
```

## Minimal Routes

- `GET /api/questions/current`: current active question.
- `POST /api/questions`: submit candidate question.
- `POST /api/questions/:id/vote`: upvote or downvote candidate question.
- `GET /api/questions/queue`: admin queue and shortlist.
- `POST /api/admin/questions`: create starter/admin question.
- `POST /api/admin/questions/:id/publish`: publish weekly question with selection note.
- `GET /api/views?question_id=&author_group=`: list views, optionally filtered by civic or institutional author type.
- `POST /api/views`: create free-text view.
- `POST /api/views/:id/vote`: upvote or downvote view.
- `POST /api/views/:id/flag`: flag view.
- `POST /api/follow-ups`: request clarification on a question or view.
- `POST /api/follow-ups/:id/vote`: upvote or downvote follow-up request.
- `POST /api/follow-ups/:id/reply`: reply to a follow-up request.
- `POST /api/follow-ups/:id/status`: mark follow-up open, answered, declined, or closed.
- `POST /api/verification/request`: request verification.
- `POST /api/admin/verification/:id/review`: approve or reject verification.
- `GET /api/bridge?question_id=`: read Bridge View.
- `POST /api/admin/bridge`: create or update Bridge View.

## UI Skeleton

- **Home**: Current weekly question, starter/current question status, candidate questions, submit-question entry point.
- **Question Page**: Question context, free-text composer, all views, civic/institutional filters, voting, follow-up requests, Bridge View.
- **Candidate Queue**: Submitted questions, similar submissions, upvote/downvote breakdowns, selection status.
- **View Composer**: One text box, optional links, optional personal/official label for verified users.
- **Follow-Up Panel**: Clarification requests attached to the question or a specific view, with status and replies.
- **Verification Page**: Request affiliation or official-representative status.
- **Admin Review**: Questions, flags, verification requests, follow-up moderation, Bridge View editor.

## Verification Rules

- Civic users can read, submit candidate questions, vote, write views, and request follow-ups.
- Institutional grouping requires verified affiliation or official representative status.
- Official responses must be clearly marked as official.
- Verified affiliation does not imply official employer position.
- Company or office email can support verification, but manual review should remain available.

## Voting Rules

- Upvotes and downvotes are allowed on candidate questions, views, and follow-up requests.
- Store votes as `1` or `-1`; compute civic and institutional breakdowns from the voter profile.
- Do not hide the difference between civic and institutional voting.
- Do not choose weekly questions by votes alone.
- Use moderation flags for abuse, impersonation, vote manipulation, harassment, or spam.

## Automation

- Weekly job archives the old active question and publishes the selected question.
- Weekly job can keep public submissions open while starter/admin questions run first.
- Optional email digest sends the new weekly question and high-support unanswered follow-ups.

## Alpha Definition Of Done

- One or two starter questions can be created and published.
- Candidate questions can be submitted from day one.
- Candidate questions can be upvoted and downvoted.
- Civic users can write free-text views.
- Verified institutional users can write free-text views.
- Views can be upvoted and downvoted with group breakdowns.
- Follow-up clarification requests can be opened, voted on, replied to, and marked answered/declined/closed.
- Verification status and affiliation labels are visible.
- Bridge View can be created for the active question.
- Basic moderation flags and admin review exist.

## Deferred Until Later

- Forecasting and prediction scoring.
- Trust graphs and domain endorsement networks.
- Complex anti-gaming heuristics.
- User clustering and polarity snapshots.
- Heavy analytics and dwell-time telemetry.
- Unbounded nested debate threads.
- Composite credibility or reputation scores.
