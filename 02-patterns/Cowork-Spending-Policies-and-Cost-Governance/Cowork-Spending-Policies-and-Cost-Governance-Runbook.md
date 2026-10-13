# Runbook - Cowork Spending Policies and Cost Governance

> **Run this before discovery is opened.** Read
> [Cowork-Spending-Policies-and-Cost-Governance.md](Cowork-Spending-Policies-and-Cost-Governance.md) first.

Portal paths, roles and settings change. Confirm each step against the current
[Microsoft documentation](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits)
and record any difference.

---

## Prerequisites

| Requirement | Owner |
|---|---|
| Pilot users hold the required Copilot licence | Licensing owner |
| Billing owner with authority to add or change a billing method | Billing owner (Global or Billing administrator) |
| Administrator to create policies, limits and alerts | AI administrator or Licence administrator |
| Azure subscription and resource group, if pay-as-you-go | Azure subscription owner |
| Pilot security group and membership owner | M365 admin |
| Expected users, task mix and intensity | Business sponsor |

---

## Step 1 - Establish Ownership and Funding

| Question | Answer |
|---|---|
| Which group starts first: pilot, department, executive office, automation-heavy, tenant? | |
| Which Azure subscription receives charges? | |
| Does its billing account hold an eligible MACC commitment? | |
| Funding: capacity packs, Copilot Credit P3, pay-as-you-go, or a combination? | |
| Which resource group, cost centre and tags? | |
| Who reviews weekly spend, and what variance triggers investigation? | |
| What is the blocked-user and limit-increase process? | |

If the billing owner is unknown, stop.

**Deliverable:** billing ownership statement.

---

## Step 2 - Estimate

Complete the worksheet with the sponsor and refresh it after the first review.

| Input | Value |
|---|---|
| Group or department | |
| Enabled users; expected active users per month | |
| Average Cowork tasks per active user per month | |
| Intensity mix: light, medium, heavy | |
| Document generation, deep research, scheduled prompts, event-driven tasks expected? | |
| Expected return rate | |
| Proposed policy limit and per-user limit | |

Use the Microsoft Copilot Credit Estimator as an input. There is no fixed task-to-credit table
for Cowork, so treat the estimate as provisional until real consumption exists.

**Deliverable:** estimate with stated assumptions.

---

## Step 3 - Set the Discovery Posture

Choose hidden until ready, pilot-only communication, or broad visibility. Keep it restricted
until Steps 4 to 6 are complete. Record the owner and the date it will change.

**Deliverable:** discovery decision.

---

## Step 4 - Configure the Billing Method

1. Open the Microsoft 365 admin center, **Copilot > Cost Management**.
2. As a Global or Billing administrator, select or add the approved billing method.
3. If the customer has MACC, choose a subscription tied to the billing account that holds the
   commitment.
4. Confirm the funding order where capacity packs, P3 and pay-as-you-go all apply.
5. Activate usage-based billing through **Get Started** and the default spending policy.
6. If a related Power Platform pay-as-you-go plan is needed for environment reporting,
   validate it separately in the Power Platform admin center.
7. Verify Azure subscription, resource group, tags, budgets and owner metadata.

**Checkpoint:** a billing method exists and usage-based billing is active.

**Deliverable:** billing setup evidence.

---

## Step 5 - Create Spending Policies

For each cohort:

1. Create a security group and record its owner.
2. Create a spending policy targeting that group.
3. Select the services. Choose **Cowork** only where intended.
4. Decide **Auto-apply new services** for this policy and record why.
5. Set the policy limit and the per-user limit.
6. Set admin alert recipients and threshold; optionally enable user notifications.
7. Optionally apply a Cowork model profile (at least two models).
8. Confirm the billing method; override only if you are a Global or Billing administrator
   and the policy needs different funding.
9. Review the summary before creating the policy. It starts applying to scoped users
   immediately.
10. Review the **default** policy: constrain it, or record that its breadth is accepted.

**Checkpoint:** a test user in the group is governed by the intended policy; a user outside
the group is not.

**Deliverable:** policy configuration record.

---

## Step 6 - Test Precedence, Limits and Alerts

| Test | Expected |
|---|---|
| User in two policies | Highest per-user limit wins; then largest policy limit; then newest |
| User reaches the per-user limit | Request path available; no fall-back to another policy |
| User moves between groups | Prior consumption carries over |
| Alert threshold crossed | Configured recipients are notified |
| `/cost` versus Cost Management | Difference explained; Cost Management is authoritative |
| Credit request | Routed to the agreed owner and answered within the agreed time |

Record any behaviour that differs from the documentation, including the source-reported
behaviour that a running task can finish after crossing a limit.

**Deliverable:** policy test results.

---

## Step 7 - Open Access and Monitor

1. Open discovery to the agreed audience.
2. Review **Overview** and **Consumption** weekly: credits, active users, top actions, users
   and policies near limits, by policy, user, group, agent and service.
3. Investigate spikes: scheduled prompts, retry loops, bulk actions, deep research, document
   generation, unexpected users.
4. Compare actuals with the estimate and update it.
5. Review policies and *Auto-apply new services* on a fixed cadence.

| Signal | Action |
|---|---|
| Usage from unexpected users | Check licence and group membership |
| Spend above forecast | Review task types, plugins, model settings, intensity |
| Sudden spike | Check scheduled prompts and retries |
| Low usage | Review training, discoverability, scenario relevance |
| User at limit | Confirm expected behaviour; route the request |
| `/cost` treated as billing | Reconfirm the official source |

**Deliverable:** weekly billing and usage review.

---

## Step 8 - Reconcile and Hand Over

Agree how finance reconciles, using Cost Management and the billing portals, never `/cost`.
Document showback or chargeback, the monthly reconciliation owner, the variance threshold,
the limit-increase decision owner, and the policy review cadence. If a policy is deleted,
users lose that policy's limits, but credits and reporting history are not removed.

**Deliverable:** reconciliation and ownership record.

---

## Checklist

- [ ] Funding path and billing owner recorded
- [ ] Estimate completed with assumptions
- [ ] Discovery restricted until policies were active
- [ ] Billing method configured; MACC alignment confirmed where applicable
- [ ] Default policy constrained or its breadth accepted
- [ ] Targeted policies scoped by security group
- [ ] Cowork selected only in intended policies; Auto-apply decision recorded
- [ ] Policy and per-user limits and alerts configured
- [ ] Precedence, limit, alert and request behaviour tested
- [ ] Weekly review and monthly reconciliation owners named
- [ ] `/cost` communicated as approximate
