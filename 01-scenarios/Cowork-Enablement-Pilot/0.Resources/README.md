# Resources and Source Basis - Cowork Enablement Pilot

This scenario has **no installable package**. Its deliverables are decisions, configuration
and evidence. No ZIP, plugin or skill is bundled in this folder.

## Evidence Artifacts to Produce

Keep customer evidence in the customer's governed workspace, not in this public repository.

| Artifact | Runbook step | Purpose |
|---|---|---|
| Engagement boundary statement | 1 | Signed scope, owners, billing approver |
| Requirement validation table | 2 | Licences, surfaces, policies confirmed |
| Technical readiness summary | 3 | Network and Microsoft 365 readiness, open blockers |
| Licence and prerequisite confirmation | 4 | Licence export and availability per user |
| Risk and assumptions log | 5 | Decisions and owners |
| Tenant preparation checklist | 6 | Phase A gate |
| Environment validation evidence | 7 | Cowork opens, task, files, history |
| Security review decision table | 8 | Signed control posture |
| Governance review record | 9 | Agent registry and settings review |
| Policy decision log | 13 | Agent, plugin, skill, discovery and spending decisions |
| Access assignment record | 14 | Groups, owners, membership |
| Billing ownership statement | 15 | Funding path and owner |
| Billing setup evidence | 16 | Method, policies, services, discovery |
| Cost management plan | 17 | Limits, alerts, review cadence, reconciliation |
| Credit estimation worksheet | 18 | Pre-pilot estimate and post-pilot comparison |
| Weekly billing and usage review | 18 | Measured consumption and variance |
| Verification checklist and functional test results | 19, 20 | Evidence of behaviour |
| User testing scorecard | 21 | Value and usability |
| Pilot validation decision | 22 | Success criteria outcome |
| Operational ownership matrix | 23 | Run-state responsibility |
| Expansion decision record | 24 | Expand, extend, pause or stop |

The tables in the [runbook](../3.Runbook.md) and [sample prompts](../4.Sample-prompts.md) can
be copied into a customer workspace as the working templates.

## Source Basis

The scenario was synthesised on **October 13, 2026** from a delivery runbook titled
*Cowork Enablement*, supplied as a Markdown document, and then checked against current public
Microsoft Learn documentation for usage-based billing, spending policies and `/cost`. The
original document is not redistributed. No customer information is included.

## Interpretation Decisions

- **Billing method after policy creation.** The source states that a spending policy's
  billing method cannot be changed once created and must be deleted and recreated. Current
  Microsoft documentation lists the billing method among the settings that can be edited.
  This scenario flags the conflict and asks the delivery engineer to verify in the tenant.
- **Auto-apply new services.** Not in the source. Current documentation states it is on by
  default for spending policies and adds future supported services automatically, so the
  scenario makes it an explicit decision.
- **Model profiles.** Not in the source. Current documentation describes them as available
  only for Cowork, requiring at least two models. They are mentioned as an optional control.
- **Roles.** The source's role mapping is retained as typical guidance. Current
  documentation also describes read-only reader roles; confirm role requirements against the
  setup documentation for the tenant.
- **In-flight tasks and limits.** The source says a running task can finish after crossing
  the per-user limit. The reviewed public pages did not restate this, so it is presented as
  a source-reported behaviour to verify.
- **Time saved.** The source's user scorecard captures reported time saved. This scenario
  treats it as a user-reported figure until a baseline method is agreed.
- **Fixed durations and savings.** None are asserted. Timelines depend on customer approvals.

## Related Guidance

- [Overview](../1.Overview.md), [architecture](../2.Architecture.md)
- [Cowork Spending Policies and Cost Governance](../../../02-patterns/Cowork-Spending-Policies-and-Cost-Governance/Cowork-Spending-Policies-and-Cost-Governance.md)
- [Pilot-to-Scale Validation Gates](../../../02-patterns/Pilot-to-Scale-Validation-Gates/Pilot-to-Scale-Validation-Gates.md)
