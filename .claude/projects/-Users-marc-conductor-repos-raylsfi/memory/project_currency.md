---
name: currency-handling
description: Stripe account is EUR-based but frontend displays USD to users
type: project
---

The Stripe account is a EU account and deals in EUR on the API side. However, the frontend should display and work with USD for the user-facing experience.

**Why:** Business decision — users see USD, Stripe processes EUR.
**How to apply:** When building UI, show `$` and USD. When calling Stripe APIs, use `eur` as currency. Keep the conversion/display concern at the frontend layer.
