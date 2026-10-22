# Runbook - Copilot Studio Harness Selection and Cowork

> Read [Copilot-Studio-Harness-Selection.md](Copilot-Studio-Harness-Selection.md) first.
> Use this runbook to choose Cowork versus a custom agent, then select a Studio harness if needed.
> The deliverable is an evidence-backed architecture decision, not a deployed agent.

**Evidence baseline: 19 October 2026.** Recheck the linked product documentation and target
environment. Record **Not run** for unexecuted tests and **Unverified** for unsupported assumptions;
do not report either as a pass.

Follow the overview's
[three decision trees](Copilot-Studio-Harness-Selection.md#comprehensive-decision-tree).
Record the answers to Q0-Q18 that apply to the route; do not force a Cowork task through Studio
authoring or count Cowork as a Studio harness. For a simple-answer or deterministic-process
off-ramp, record why a custom agent is unnecessary and verify that route's applicable requirements.

The standard-harness candidate in this runbook uses **generative orchestration**, with topics
and deterministic flows providing explicit control where required.

---

## Prerequisites

| Requirement | Owner |
|---|---|
| Named business outcome, audience, process owner, and prohibited actions | Business owner |
| Representative approved or synthetic inputs, including failure and exception cases | Process and data owners |
| Mandatory channels, source operations, authentication, region, and preview policy | Platform and security owners |
| For a Studio candidate: target environment access and approved test connections | Platform owner |
| For Cowork: work/school access, assigned Microsoft 365 Copilot license, enabled Cowork usage billing, and approved extensions | Microsoft 365 and cost owners |
| Budget for building, testing, evaluation, and any restricted published pilot | Cost owner |
| Existing agent inventory, baseline results, and rollback owner if considering migration | Current service owner |

Do not connect production mailboxes or enable consequential actions to answer an architecture
question. Start with non-sending, read-only, or isolated test dependencies. Tests can execute real
tools; a synthetic prompt does not make a live send or write harmless.

---

## Step 1 - Define the Required Outcome

Describe the work independently of either runtime. Separate user conversation, reasoning,
retrieval, computation, artifact production, approval, and writes.

| Field | Record before the pilot |
|---|---|
| Business outcome | What the user or process receives, and what counts as accepted |
| Experience or agent requirement | Whether the existing Cowork experience is sufficient or an owned deployed agent/channel/process contract is required |
| Task boundaries | Allowed reads, allowed changes, prohibited operations, and completion condition |
| Audience and entry points | Users, channels, events, schedules, and expected peak volume |
| Working data | Source systems, freshness, actual file formats/sizes, and expected result sizes |
| Conversation state and configuration | Required local/topic, session/global, system-context, and Power Platform environment-variable behavior, including lifetime, isolation, deployment overrides, and secret handling |
| Interactive UI | Required Adaptive Card rendering, inputs, validation, submit/resume, and channel-specific behavior |
| Adaptation | Which next steps are known and which depend on intermediate results |
| Required outputs | Answer, structured fields, files, records, notifications, and their consumers |
| Human decisions | Who approves what, on which evidence, and how expiry/rejection is handled |
| Service targets | Task-specific quality threshold, latency target, completion deadline, and budget |

Set measurable acceptance criteria before building. Examples include exact required-field coverage,
a permitted level of human rework, p95 completion latency, and maximum credits per accepted case.
Security and unauthorized-action cases must have no successful prohibited access or mutation.
The process owner sets other thresholds; this pattern supplies no universal time or accuracy cutoff.

Apply Tree 1 before authoring. Record whether rules alone suffice (Q0), an owned agent contract is
required (Q1), task execution is needed (Q2), and Cowork is available and covers the task directly
or through a scoped extension (Q3-Q5). Recurrence, shared skills, and multiple users alone do not
disqualify Cowork. An external channel or formal service contract must not disappear behind a
knowledge-only recommendation.

**Deliverable:** agreed outcome, initial experience/build route, and acceptance criteria.

---

## Step 2 - Apply Mandatory Compatibility Gates

Use **Pass**, **Fail**, **Unverified**, or **Not applicable** in each candidate column. A Pass needs
both the applicable official support reference and target-environment evidence. Record the source
review date and owner in the evidence column.

Start with the overview's
[upfront GHCP compatibility checklist](Copilot-Studio-Harness-Selection.md#first-check-ghcp-compatibility-gaps).
Record whether each relevant difference is **Unavailable**, **Different**, **Preview**, or
**Unverified parity**, then assess the actual requirement in this matrix. A changed implementation
can pass only when its replacement contract is supported, demonstrated, and accepted by the owner.

| Mandatory requirement | Cowork | Standard | GHCP | Evidence, date, and owner |
|---|---|---|---|---|
| Required experience, audience, channel, and distribution method | | | | |
| End-user authentication mode, identity provider, SSO, and required token/context access | | | | |
| Tool/workflow authentication, consent, and effective downstream identity | | | | |
| Local/topic state, typed inputs/outputs, and required validation | | | | |
| Session/global state lifetime, initialization/reset, and user isolation | | | | |
| Required system/activity/conversation context from trusted sources | | | | |
| Deployment configuration and Power Platform environment-variable bindings, overrides, refresh, and secrets where required | | | | |
| Adaptive Card rendering, inputs, actions, validation, and submit/resume in the required channel | | | | |
| Required knowledge source, permissions, retrieval controls, citations, and grounding policy | | | | |
| Exact connector/plugin/MCP operations and network reachability | | | | |
| Required primary model and called AI-component models, region, release status, and provider approval | | | | |
| File ingress, formats, size, processing, and output delivery | | | | |
| Inbound event, schedule, or API route and intended target support | | | | |
| Output contract, duration, retry, and asynchronous requirements | | | | |
| Action consent versus independently enforced business approval | | | | |
| Required features allowed by the organization's preview policy | | | | |
| Data policies, retention, audit, and operational controls | | | | |
| Licensing, charged usage/capacity, and cost ownership | | | | |
| Release/extension management and rollback requirements | | | | |

Start with the official
[harness comparison](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/choose-harness),
[GHCP channels](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview),
and [standard publishing guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels).
For authentication, variable scopes, cards, knowledge, models, memory, and file limits, use the
paired feature-specific references in the upfront checklist. The standard variable and card
references establish the existing contract, not GHCP support. GHCP's documented authentication
dropdown lists anonymous and Microsoft options, not the standard manual-authentication option;
do not confuse a tool's OAuth connection with the agent's user sign-in.
For Cowork, verify the
[work/school prerequisites](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/get-started),
[approval and automation behavior](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/use-cowork),
and [plugin lifecycle](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugins).

Do not treat either GHCP or work/school Cowork general availability as approval for every optional
preview capability. A Cowork plugin or shareable skill is not proof of a deployable agent/API.
Mark an entire candidate out of scope when it is not being considered; never mark a mandatory
business requirement Not applicable merely because a candidate lacks it.
Do not assume that one candidate automatically passes a gate another fails.
Reject a candidate with a mandatory Fail. Resolve Unverified entries before selection.
If none qualifies, document a supported redesign or defer.

For each required state/UI/configuration behavior, record the old component, proposed replacement,
source reference, actual environment/channel, test case, result, and owner in the evidence column
or linked inventory. Do not substitute remembered context for a typed state contract, a generated
JSON payload for a functioning card interaction, or a shell variable for a Power Platform
environment-variable binding. A requirement for a particular native authoring contract cannot be
silently relaxed into a different UI or backend design.

**Deliverable:** compatibility matrix with evidence gaps assigned to owners.

---

## Step 3 - Compare Task Fit and Implementation Effort

If Cowork qualifies, first assess whether its built-in experience or a scoped, supported extension
meets the outcome without an owned agent deployment. Include extension engineering, hosting,
authentication, approval constraints, and maintenance; "use Cowork" does not mean "no integration
work." Compare a custom agent only when it supplies a required contract or demonstrated benefit.

For the Studio build route, follow Tree 2 (Q6-Q12). Record where the work is done and how much
custom orchestration it requires.

| Workload characteristic | Favors standard when... | Favors GHCP when... | Finding for this workload |
|---|---|---|---|
| Conversation | Required questions, validation, and handoff follow an explicit path | Dialogue supports an adaptive goal rather than a prescribed questionnaire | |
| Planning | A stable sequence or small action set handles the cases | The next step changes after inspecting intermediate findings | |
| Context | A bounded set of results fits existing topics/tools | Several sources, files, intermediate artifacts, and iterations must be reconciled | |
| Files and computation | A narrow external tool already returns the required result | Native sandbox processing and file creation remove material integration work | |
| Exceptions | Known branches cover expected failures | Investigation and replanning are part of the business outcome | |
| Service profile | Responsive, high-volume interactions dominate | Longer analysis and several deliverables justify more orchestration | |
| Maintenance | Existing topics, flows, and channels already meet the requirement | Maintaining authored handoffs and exception paths is the demonstrated bottleneck | |

Do not tally the rows into an automatic score. One mandatory gate can invalidate a candidate, and
one high-value capability can outweigh several minor conveniences. State the business consequence
of each material difference.

If there are two genuinely different workloads, evaluate a split: for example, GHCP prepares
approved structured data on a schedule while standard serves chat from that data. Define ownership,
freshness, authorization, failure handling, and schema at the boundary. Do not assume arbitrary
cross-harness agent invocation; verify it separately if the design requires it.

**Deliverable:** Tree 1/2 branch answers, preferred candidate, and strongest eligible alternative
with a concrete rationale. Any split remains conditional on a proven boundary.

---

## Step 4 - Build the Smallest Representative Pilot

Pilot only eligible candidates and only the journeys needed to resolve the decision. If a mandatory
gate already leaves one candidate, there is no need to rebuild the other for an A/B comparison.
An existing production implementation can provide the baseline without being modified.
Tree 3 (Q13-Q18) applies to every candidate.

### Cowork Candidate

1. Confirm work/school access, the assigned Microsoft 365 Copilot license, enabled usage-based
   Cowork billing, approved models/providers, and the intended test user. Do not use a consumer
   preview or assume the App skill is generally available.
2. Start a new task with approved inputs. Use built-in research, Office, communication, and
   scheduling skills where sufficient; add a trusted custom skill/plugin only for a demonstrated
   gap. Record the extension version and available operations.
3. Authenticate each required plugin service as intended. Admin deployment does not sign users
   in. Test another user with different access, including shared skills/plugins; sharing
   instructions must not share the author's source privileges.
4. Test action previews, cancellation, session-scoped **Always allow** choices, and their revocation.
   Where a manager or Finance must approve, verify independent enforcement in the backend/process.
   A user skipping future consent prompts cannot bypass business approval.
5. If recurrence is required, test the exact supported scheduled prompt or email/Teams event task.
   Record the trigger, effective user identity, new-versus-existing conversation behavior,
   approval/pending-input behavior, limits, and failure route. Event tasks default to
   draft-and-approve; do not invent a generic unattended service API or queue contract.
6. Review the actual files and record outcomes in the destination systems, not just task progress.
   Test extension disable/removal and backend revocation separately: removal does not interrupt
   active conversations already using a plugin.

### Standard Candidate

1. Open the standard authoring experience using the documented
   [access routes](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/switch-experiences).
   Opening a different experience does not convert an existing agent.
2. Configure
   [generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)
   and verify that the agent selects the intended topics, knowledge, tools, and connected agents
   from their descriptions.
3. Use topics for prescribed intake and validation, and expose only the required tools and sources.
   Keep authorization, routing policy, approvals, and idempotency in the process/backend.
4. If event-triggered, verify the generative-agent trigger and its author-owned credentials using
   [standard event-trigger guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-trigger-event).
5. Inspect the activity trace and actual tool/source outcomes; an acceptable final answer alone is
   not proof that the correct action or identity was used.

### GHCP Candidate

1. Create a separate GHCP agent. Configure the approved model, scope, outcome, and stopping
   conditions in Build. Add only the necessary knowledge and tools. Record the actual sign-in
   options and connection identities; do not copy standard authentication variables into instructions.
2. Implement the accepted state/configuration and UI mappings from Step 2 using supported target
   components. Verify explicit inputs/outputs, trusted system context, session reset/isolation,
   environment-specific configuration, and any required card interaction in the published surface.
   Keep unresolved native-parity requirements blocked rather than simulating them with prose.
3. Add a Markdown skill only where a reusable task-specific procedure helps. Configure its tools
   separately; uploading instructions creates no connection or permission.
4. Keep memory off initially unless cross-conversation recall is a requirement. If enabling it,
   approve and test its per-user isolation and lifecycle. Turning memory off does not delete it.
5. For event intake, configure the supported
   [Workflow Agent node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow)
   against the exact published target. Test first without downstream sending or writes.
   Record identity, version, input, and actual output shape; do not assume inline-agent settings
   apply unchanged to an existing published agent.
6. Keep mandatory validation, approval, and consequential writes in deterministic process steps
   or narrow backend tools. Inspect Preview/Evaluate traces and actual outputs, including files.

For all candidates tested, record the host experience, available model/configuration versions,
skill/plugin or agent versions, source snapshots, tool contracts, connection identities, and inputs.
Use the same business tasks and access boundaries.
Where models differ, record that confounder; the pilot compares complete solutions, not isolated
proof that the harness caused the difference. Mark a product-managed setting as such rather than
claiming control the host does not expose.

**Deliverable:** reproducible pilot configurations and recorded component/identity inventory.

---

## Step 5 - Exercise Success, Denial, and Recovery

Repeat variable cases enough to expose inconsistent outcomes; agree the sample size and report it.
Run the same approved case set against each candidate being compared.

| Case | Required observation |
|---|---|
| Routine bounded request | Correct result without unnecessary calls or actions |
| Ordered intake and missing required fields | Required information collected and validated before a handoff or write |
| Multi-step task with changed intermediate information | Correct replanning or an explicit safe stop, without exceeding scope |
| Conflicting, missing, stale, or inaccessible evidence | Supported facts separated from uncertainty; no invented answer, citation, or record |
| Two users with different permissions | Each sees only permitted sources/records; no maker-identity leakage |
| Sign-in, tool consent, expiry, and revocation in the actual channel | Required identity-provider/SSO behavior works; cancelled or revoked connections fail safely; effective tool identity is observed separately from agent sign-in |
| Local/session state, interruption, reset, and a second user/session | Required values retain their types and intended lifetime; reset/expiry works; no cross-user leakage or reliance on optional memory for business state |
| Required system context is missing or spoofed in a message | Trusted channel/tool context is used; missing identity/context is surfaced rather than inferred from user-supplied text |
| Configuration changes between environments and after publication | Correct deployment overrides and refresh behavior are observed; standard ordinary environment-variable changes are republished, secret rotation follows runtime retrieval, and the GHCP replacement's lifecycle is verified separately |
| Adaptive Card form, invalid input, interruption, and repeated/stale submit | Actual card renders in the target channel; typed values, validation, continuation, and duplicate protection work; card JSON in a text answer is not a pass |
| Excluded knowledge source or unsupported factual question | Required source boundaries, citations, and refusal/grounding policy hold; no assumption that GHCP has the standard general-knowledge toggle |
| Selected primary/called model unavailable, blocked, or changed | Actual model configuration and fallback behavior meet the approved region/provider/release policy; no unapproved model substitution |
| Workflow-triggered execution | Actual service/connection identity recorded; sender identity not assumed from message text |
| Instruction hidden in a file or tool response | External content treated as data; no expansion of permissions or recipients |
| Disabled action or unavailable tool | Clear limitation; no alternate API/workflow used to bypass the restriction |
| Consequential action requiring approval | Exact target and payload validated; denied, missing, or expired approval prevents the write |
| Cowork session consent and required business approval | Session-level "don't ask again" settings cannot bypass the independent approver/policy |
| Shared Cowork extension and plugin removal | Recipient uses their own connection; active-session behavior and immediate backend revocation verified |
| Cowork scheduled/event task without an available user | Pending approvals/input and failure notifications handled explicitly; no claim that all work completes unattended |
| Timeout after a possible write | Outcome reconciled against source state before any retry; no duplicate mutation |
| Partial completion or asynchronous acceptance | Completed steps retained; pending/unknown work not reported as complete |
| Actual files and channel delivery | Inputs processed at required formats/sizes; output values and generated files checked, not just a link or success message |
| Capacity or dependency unavailable | Failure surfaced with an operational route; no fabricated result or unlimited retry loop |
| Optional memory, if enabled | User isolation, stale-context handling, and deletion behavior meet policy |

Keep evidence of intermediate actions and the final system state. An evaluation score cannot prove
that an approval was honored, a row was written correctly, or a recipient received the intended file.
A failed mandatory safety test disqualifies the implementation until corrected; quality averages
cannot offset it.

**Deliverable:** case results, traces/source evidence, and unresolved defects. No execution is
claimed by this documentation.

---

## Step 6 - Measure Quality, Latency, Credits, and Operating Effort

Separate development/evaluation consumption from recurring production-like tasks. Include
unsuccessful attempts and retries rather than measuring only the successful happy path.

| Measure | Cowork result | Standard result | GHCP result | Acceptance target / evidence |
|---|---|---|---|---|
| Cases attempted and accepted | | | | |
| Incorrect or unsupported outputs | | | | |
| Prohibited reads/writes or approval bypasses | | | | No successful prohibited operation |
| Median / p95 completion latency | | | | |
| Tool calls, retries, and human interventions | | | | |
| Billing unit/rate and total charged usage for the case set | | | | |
| Consumption and monetary cost per accepted outcome | | | | |
| Build/test/evaluation consumption where applicable | | | | |
| Estimated monthly consumption/cost at expected volume | | | | |
| License assumptions and external service/storage/connector costs | | | | |
| Initial implementation and ongoing maintenance effort | | | | |

For the same measured population and one consistently reported billing unit:

```text
Consumption per accepted outcome = all measured run consumption / accepted outcomes
Recurring monthly consumption = measured consumption per attempted case x forecast attempted cases
```

If no outcomes are accepted, report the first metric as **undefined**, not zero. Forecast retries
and rework consistently, without counting them twice. Model and workload mix, peak capacity, and
exception frequency can change the estimate; record the assumptions.

Use the current
[standard licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)
and [GHCP billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/billing-credit-overview)
guidance. Do not reuse standard activity rates as GHCP token/tool/harness prices, and do not infer
free GHCP usage from Microsoft 365 Copilot or GitHub Copilot subscriptions.
Cowork's [prerequisites](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/get-started)
require both a Microsoft 365 Copilot license and enabled usage billing. Record its actual tenant
billing unit/rate rather than assuming a Studio meter applies. Unavailable usage evidence is
Unverified, not zero consumption. Normalize to monetary cost per accepted outcome when meters
differ, and state whether existing license costs are allocated or treated as sunk.
Verify what budget controls enforce versus merely alert, and who responds when capacity runs out.

**Deliverable:** measured comparison and cost forecast with assumptions, not a universal claim
that one harness is cheaper or faster.

---

## Step 7 - Record the Architecture Decision

Complete this record in the organization's delivery documentation.

| Decision field | Required content |
|---|---|
| Outcome and scope | Business journey, audience, allowed/prohibited operations, and acceptance criteria |
| Selected design | Cowork, standard, GHCP, split design, a simple-answer/deterministic-process off-ramp, or defer/redesign |
| Decision-tree path | Applicable Q0-Q18 answers, terminal recommendation, and evidence for each decisive branch |
| Decisive requirements | Mandatory gates and the task-weight differences that affected the decision |
| Compatibility deviations | Required authentication, state/variable, card, knowledge, model, and channel differences; accepted replacement contracts and proof for every mandatory item |
| Evidence | Dated official references, environment checks, tested versions, case results, and cost measurements |
| Rejected alternative | Why it was not proportionate or did not meet a mandatory requirement |
| Deterministic boundary | Where identity, validation, approval, idempotency, and business policy are enforced |
| Remaining dependencies | Owner and closure condition for each item; unresolved mandatory items block release |
| Operations | Monitoring, capacity owner, failure/reconciliation route, and change/retest responsibility |
| Revisit condition | Feature availability change, workload growth, quality failure, or a measured cost/latency threshold |

For an existing standard agent, the valid decision may be **stay on standard**. Migrate only when
the measured benefit exceeds rebuild, operating, and regression risk.

**Deliverable:** approved decision record, including an explicit no-release decision where needed.

---

## Step 8 - Plan Enablement, Release, or Migration

For Cowork, plan user/group enablement, extension sharing/deployment, connection consent, and
automation ownership. Test updated extensions in a new conversation and use the documented
re-sharing process. Rollback includes disabling schedules, restoring the approved extension
version where supported, handling active sessions, and revoking backend access if necessary.
Do not create a Studio agent merely to satisfy a generic "publish" step.

There is no direct transfer between Studio harnesses. Moving a Cowork procedure to Studio also
requires revalidating host-specific tools, identity, inputs/outputs, and approvals. If rebuilding,
map the **purpose** of existing components rather than translating every node mechanically.

| Existing responsibility | Rebuild consideration |
|---|---|
| Ordered topic questions and validation | Preserve as a controlled process or prove equivalent behavior; a skill is not a topic graph |
| Local/topic variables | Preserve typed input/output and validation semantics in the supported target component |
| Global/session variables | Prove initialization, lifetime, reset, and isolation; optional memory is not a replacement for a business record |
| System/activity/user variables | Verify each required trusted context value and identity source; do not invent a `System.*` binding |
| Power Platform environment variables | Prove solution/deployment binding, overrides, refresh, and secret handling; shell variables are not equivalent |
| Adaptive Cards | Prove host schema/actions, input binding, validation, submit/resume, interruption, and stale-submit handling |
| User authentication | Verify the required sign-in mode, identity provider, SSO, and token contract separately from tool credentials |
| Knowledge and grounding controls | Reconnect sources and reevaluate authority, permissions, retrieval settings, citations, and unsupported-question behavior |
| Primary model and called prompts/AI steps | Recheck each catalog, release tag, region, provider approval, and fallback instead of assuming model portability |
| Action tools and flows | Rebind connections, validate contracts, and retain deterministic policies |
| Channels and handoffs | Recheck support, authentication, rendering, distribution, and integration direction |
| Background triggers | Prevent both old and new intake routes from processing the same event during cutover |

For a Studio agent, publish privately or to a restricted approved pilot first. Define the exact rollback version and
route, who can invoke it, how in-flight jobs are reconciled, and how duplicate actions are prevented.
For a split design, assign one owner for cross-boundary incidents and define data freshness or job
status. Never call accepted background work completed just because the chat returned successfully.

**Deliverable:** release, cutover, and rollback plan, or documented retention of the existing agent.

---

## Troubleshooting Quick Reference

| Symptom | Check first | Response |
|---|---|---|
| A new agent is being built for an ordinary research/artifact task | Whether Cowork and approved skills/plugins already meet the outcome | Revisit Tree 1 before adding deployment and operations work |
| Cowork approvals seem inconsistent | Session "don't ask again" permissions and automation approval state | Inspect/revoke session permissions and keep business approval backend-enforced |
| A removed Cowork plugin still works in an active conversation | Documented plugin-removal lifecycle and downstream credentials | Use backend revocation where immediate access removal is required |
| "Standard cannot use AI or MCP" | Generative orchestration configuration, tool availability, and component descriptions | Verify planning and tool selection with the generative standard baseline |
| GHCP gives good answers but cannot reach the required surface | Current harness-specific channel table | Treat as a compatibility failure, not a prompt problem |
| Manual sign-in or a standard token variable is missing | GHCP's documented sign-in choices versus the existing authentication contract | Retain standard or prove an accepted supported redesign; a connector's OAuth sign-in is not agent-authentication parity |
| A copied variable expression is literal text or state resets unexpectedly | Topic/global/system scope versus actual target inputs, context, and state lifetime | Rebuild explicit supported bindings; do not rely on remembered text or invented variable namespaces |
| Configuration did not change after deployment | Power Platform binding, published value, secret/runtime behavior, and target replacement lifecycle | Verify the consuming component and update/republish as required; do not assume Bash environment variables read solution values |
| A card appears as JSON or does not resume the task | Native card contract, host schema/actions, output binding, and continuation support | Treat as unresolved UI compatibility, not successful card generation |
| A model or grounding control is absent | Harness-specific catalog/settings, regional availability, and administrative policy | Reassess the mandatory requirement; do not infer parity from another harness or a prompt/SDK model list |
| Automatic email works in one design but not the other | Trigger/invocation direction, published target, and connection identity | Prove the correct inbound route; do not relabel a workflow as an Email channel |
| GHCP is slow or expensive on routine requests | Unneeded reasoning, tools, specialists, memory, or context | Simplify; compare standard or isolate the heavier workload |
| A "read-only" agent makes a change | Exposed tools and backend permissions | Remove write exposure and enforce the boundary outside instructions |
| Migration did not fix poor grounding | Source authority, freshness, retrieval, and access | Repair the data path before changing orchestration again |
| File output looks successful but values are wrong | Actual artifact contents and computation | Validate the deliverable and source calculations, not the generation message |
| All candidates fail the mandatory gates | Unsupported integration or incompatible policy | Redesign or defer; do not select the least-failing candidate |

---

## Exit Criteria

- [ ] Business outcome, scope, prohibited actions, and measurable acceptance criteria agreed
- [ ] Experience/build choice and applicable Q0-Q18 answers recorded, without treating Cowork as a Studio harness
- [ ] Mandatory compatibility gates resolved for the selected design
- [ ] Authentication, local/global/system/environment state, Adaptive Cards, knowledge controls, and model requirements mapped to supported and demonstrated contracts, or explicitly not required
- [ ] Feature/model/channel release status checked against organizational policy
- [ ] Effective identities, permissions, and action/approval boundaries demonstrated
- [ ] Representative success, denial, failure, and recovery cases pass
- [ ] Actual output contracts and files verified in the required delivery surface
- [ ] Lifecycle consumption, production forecast, latency, and operating effort recorded
- [ ] Selection or defer/redesign decision approved, with evidence and revisit conditions
- [ ] Enablement/release/rollback ownership agreed; active-session, duplicate-trigger, and in-flight-work risks addressed

This runbook adds no runtime skill, integration, or deployed resource. Its exit criteria are checks
for the delivery team to execute, not claims of completed tenant validation.
