## Weekly AI Civic Hearing - Product Guide

### Purpose
- **Goal**: Create a serious public channel between people building or governing AI and ordinary people living with its effects.
- **Cadence**: One featured question per week.
- **Launch plan**: Start with one or two founder-selected questions. Public question submission opens from day one, but submitted questions may take one or two weeks to become meaningful enough to influence the weekly queue.
- **Core promise**: People can see what ordinary citizens think, what institutions think, which views receive support or pushback, and where follow-up clarification is still needed.

## Product Shape

### Weekly Question Page
Each week has one featured question. The page should feel like a civic hearing, not a social feed.

Main areas:
- **Question context**: The featured question, a short reason for why it was selected, and status of invited institutional participation.
- **Views**: Free-text responses from both civic users and verified institutional users.
- **Grouped reading modes**: Readers can view all responses together, or filter by civic users and verified institutional users.
- **Bridge View**: A neutral synthesis showing the strongest civic concerns, strongest institutional views, points of overlap, points of disagreement, unanswered concerns, and open follow-ups.

The author experience should be simple: one text box where a user can write their view in their own words. The platform labels the author type and verification status; it should not force people through predefined prompts or subtopics.

### Starter Questions And Question Intake
The first one or two weekly questions are selected manually by the project owner.

Public users can submit candidate questions from the beginning. These submissions are not published directly as weekly questions.

Selection should consider:
- Public support and opposition.
- Number of similar submissions.
- Urgency and current relevance.
- Whether institutions can reasonably respond.
- Editorial judgment with a short public explanation.

### Views
Both civic and institutional users write in the same basic format:
- Plain free-text body.
- Optional links or citations.
- Optional statement that the view is personal or official when the user is verified.

Verified institutional users may be grouped separately in the interface, but the response itself should not be constrained by a different prompt.

### Follow-Ups And Clarifications
Users need a way to ask for clarification without turning the product into an endless debate thread.

Follow-ups can be attached to:
- The weekly question.
- A specific view.

Examples:
- A verified Anthropic researcher asks a civic user to clarify a concern.
- A civic user asks a verified lab employee what they mean by a safety threshold.
- A moderator asks a user to clarify an ambiguous or unsupported claim.

Follow-up behavior:
- Follow-ups are short free-text clarification requests.
- The target user can answer, decline, or ignore.
- Follow-ups have a visible status: open, answered, declined, or closed.
- Follow-ups can be upvoted or downvoted separately so readers can signal whether the clarification request is useful.
- The Bridge View should surface important unanswered follow-ups.

This gives institutions a way to understand public concerns more precisely, while giving the public a way to challenge vague institutional answers.

### Verification
Verification must distinguish personal affiliation from official representation.

- **Verified affiliation**: Confirmed through company, university, government, publication, professional, or manual review evidence. The user speaks personally unless marked otherwise.
- **Official response**: Confirmed as an organization, office, or authorized representative speaking on behalf of that body.
- **Civic user**: Normal public account. No institutional badge.

Example labels:
- Verified affiliation: Anthropic
- Verified affiliation: Google DeepMind
- Verified public office staff
- Verified academic
- Official response: Office of X
- Personal view, not employer position

## Voting And Signals

Use upvotes and downvotes, but never collapse everything into one opaque global score. The product should show what different groups support or push back on.

### Candidate Question Votes
Questions can receive:
- **Upvote**: I want this asked.
- **Downvote**: I do not think this is useful, important, or well-framed.

Display vote breakdowns separately:
- Civic upvotes/downvotes.
- Verified institutional upvotes/downvotes.
- Total similar submissions.
- Editorial selection note.

The weekly question should not be chosen by votes alone. Votes inform selection; admins still choose based on judgment, urgency, and answerability.

### View Votes
Views can receive:
- **Upvote**: This is useful, important, convincing, or worth surfacing.
- **Downvote**: This is unhelpful, weak, misleading, dismissive, or not worth surfacing.

Display vote breakdowns separately where useful:
- Civic votes.
- Verified institutional votes.
- Overall score.

The most important signal is not just popularity; it is the gap between how civic users and institutional users respond.

Example:
- Civic: +184 / -12
- Verified institutional: +9 / -21
- Interpretation: high public support, institutional disagreement or concern.

### Follow-Up Votes
Follow-up requests can also receive upvotes and downvotes.

This helps surface:
- Clarifications many people want answered.
- Follow-ups that feel unfair, bad-faith, or unhelpful.
- Questions institutions want clarified before responding.

## Governance And Moderation

Keep moderation separate from contribution quality. A popular user should not automatically gain moderation power.

Minimum policy surface:
- Clear rules for respectful participation.
- No impersonation or unverifiable institutional claims.
- Disclosure of personal vs official views.
- Appeals path for removed content or denied verification.
- Editorial note explaining why each weekly question was selected.
- Moderation for abuse, spam, harassment, brigading, and bad-faith voting.

## What To Defer

Do not build these in v1:
- Forecasting claims and scoring.
- Trust endorsement graphs.
- Composite credibility scores.
- User polarity clustering.
- Heavy telemetry.
- Complex reputation systems.
- Unbounded nested debate threads.
- Private cohorts or confidential industry channels.

These may become useful later, but they distract from the core civic bridge.

## Metrics

Track whether the product is creating useful public clarity:
- Number of submitted candidate questions.
- Number of votes on candidate questions.
- Number of civic views per weekly question.
- Number of verified institutional views per weekly question.
- Number of follow-up requests opened and answered.
- Number of high-support follow-ups still unanswered.
- Repeat participation from verified institutions and civic users.
- Quality of Bridge View summaries as judged by both groups.
