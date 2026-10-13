# Runbook - Pilot-to-Scale Validation Gates

> **Run this from the first customer conversation.** Read
> [Pilot-to-Scale-Validation-Gates.md](Pilot-to-Scale-Validation-Gates.md) first.

---

## Prerequisites

| Requirement | Owner |
|---|---|
| Named business sponsor | Customer |
| IT owner able to sign the boundary | Customer |
| Billing owner and security owner identified | Customer |
| A capability to pilot, with known actions and data | Delivery team |

---

## Gate 1 - Boundary

| Question | Answer |
|---|---|
| Outcome the pilot targets | |
| Users and groups | |
| Use cases in scope (2-3) | |
| Actions out of scope | |
| Data in scope; data classes excluded | |
| Billing approver and funding path | |
| Support owner after handoff | |

**Stop** if audience, outcome or billing owner is unknown.

**Deliverable:** boundary statement signed by sponsor and IT owner.

---

## Gate 2 - Readiness

1. Validate licences, availability and surfaces for each pilot user.
2. Validate tenant, network and application readiness.
3. Review permissions on in-scope content; list oversharing risks.
4. Confirm billing method, limits and reporting path (see the
   [billing pattern](../Cowork-Spending-Policies-and-Cost-Governance/Cowork-Spending-Policies-and-Cost-Governance.md)).
5. Record risks and assumptions with owner and decision.

**Deliverable:** requirement validation, technical readiness summary, risk log.

---

## Gate 3 - Control Posture

Record decisions and owners for: authentication and Conditional Access, web access, external
plugins, custom skills, messaging and email actions, file changes, excluded data classes,
audit and retention, and agent governance.

**Stop** if the security owner cannot approve the posture.

**Deliverable:** security decision table, governance review record, policy decision log.

---

## Gate 4 - Enable a Bounded Cohort

1. Assign licences and groups; limit access to the pilot cohort.
2. Confirm a non-pilot user cannot reach pilot-only capabilities.
3. Confirm discovery matches the agreed posture.
4. Confirm users know how to report issues and request more credits.

**Deliverable:** access assignment record.

---

## Gate 5 - Evidence

1. Run the verification checklist: access, prompt, attachment, output file, approval card,
   cancel, messaging, calendar, history, policy boundary, billing visibility.
2. Run the functional tests (for Cowork, see the
   [scenario tests](../../01-scenarios/Cowork-Enablement-Pilot/4.Sample-prompts.md)).
3. Ask each user to complete at least two approved scenarios; capture quality, time saved,
   concerns and failed steps.
4. Review results with sponsor, IT, security, billing and adoption leads.

**Deliverable:** verification checklist, test results, user scorecard.

---

## Gate 6 - Success Criteria

Agree targets **before** the pilot; complete actuals at the end.

| Criterion | Target | Actual | Decision |
|---|---|---|---|
| Pilot users can access the capability | 100% | | |
| Critical functional tests pass | 100% | | |
| Sensitive-action approval verified | 100% | | |
| User satisfaction | Customer-defined | | |
| Cost within threshold | Customer-defined | | |
| Pilot users in the intended cost policy | 100% | | |
| Alerts and reporting accepted | Yes | | |
| Limit-increase path documented | Yes | | |
| Chargeback or showback decision recorded | Yes / not required | | |
| Unresolved high-severity security issues | 0 | | |
| Support model accepted | Yes | | |

If a critical criterion fails, **do not expand**. Create remediation, retest and record the
retest.

**Deliverable:** pilot validation decision.

---

## Gate 7 - Operational Ownership

Assign an owner and cadence for: access and licences; agent and skill review; billing and cost
review; policies and limits; alerts and variance; reconciliation; limit requests; security
monitoring; support and escalation; adoption and training; scenario backlog.

**Deliverable:** operational ownership matrix accepted by each owner.

---

## Gate 8 - Decision

Record **expand**, **extend**, **pause** or **stop** with the criteria met, evidence, owners
and next review date. For **expand**, repeat Gates 4 to 8 for the new cohort.

**Deliverable:** expansion decision record.

---

## Checklist

- [ ] Boundary signed by sponsor and IT owner
- [ ] Readiness, risks and assumptions recorded
- [ ] Control posture approved by the security owner
- [ ] Bounded cohort enabled; non-pilot access verified
- [ ] Verification checklist and functional tests complete
- [ ] User scorecard complete
- [ ] Targets agreed before the pilot; actuals recorded
- [ ] Critical criteria all passed, or remediated and retested
- [ ] Ownership matrix accepted
- [ ] Decision recorded with next review date
