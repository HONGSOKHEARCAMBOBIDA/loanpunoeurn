# Loan Management System

A complete loan management admin app built with Vue 3 (Composition API) + Vite +
Element Plus, using [SheetDB](https://sheetdb.io/) as the data layer for a Google
Sheet. There is no backend server — the app talks to SheetDB directly.

## 1. Set up the Google Sheet

Create a Google Sheet with **three tabs**, exactly named and columned like this:

**customers**
| id | customer_name | phone | address |
|----|----------------|-------|---------|

**loans**
| id | customer_id | loan_amount | remaining_balance | status |
|----|-------------|-------------|--------------------|--------|

`status` must be either `Active` or `Paid`.

**receives**
| id | loan_id | receive_date | total_receive |
|----|---------|---------------|----------------|

Leave the header row in each tab exactly as above — SheetDB reads the header row
as the field names.

## 2. Create a SheetDB API

1. Go to https://sheetdb.io/ and sign in.
2. Click **Create new sheet connection**, connect your Google account, and select
   the spreadsheet you created above.
3. Once created, copy the **API base URL**, e.g.
   `https://sheetdb.io/api/v1/abcd1234efgh5678`.
4. Because this project reads/writes three different tabs in the *same*
   spreadsheet, make sure "multiple sheets" support is enabled for your SheetDB
   connection (this is automatic on SheetDB — every request just needs a
   `?sheet=customers` / `?sheet=loans` / `?sheet=receives` query parameter,
   which this app already sends for you).

## 3. Configure the app

Copy `.env.example` to `.env` and paste your SheetDB base URL:

```bash
cp .env.example .env
```

```
VITE_SHEETDB_BASE_URL=https://sheetdb.io/api/v1/your_api_id_here
```

## 4. Install & run

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## 5. Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  api/            # Thin SheetDB API wrappers (customers.js, loans.js, receives.js, ...)
  components/     # Reusable UI components (dialogs, stat cards, status tag)
  composables/     # Business logic + state (useCustomers, useLoans, useReceives, useDashboard, useLoanDetail)
  layouts/        # AdminLayout.vue - sidebar + header shell
  router/         # Vue Router configuration
  utils/          # Formatting + validation helpers
  views/          # Page-level components (Dashboard, Customers, Loans, Loan Detail, Receive Payment)
```

## Notes on business rules implemented

- **New loan**: `remaining_balance` is set equal to `loan_amount`, `status` defaults to `Active`.
- **Recording a payment**: inserts a row into `receives`, then recomputes
  `remaining_balance = remaining_balance - total_receive`. If the result is
  `<= 0`, the balance is clamped to `0` and the loan's `status` is flipped to `Paid`.
  The balance can never go negative.
- **IDs**: SheetDB does not guarantee auto-incrementing IDs, so the app computes
  the next numeric ID client-side (`max(existing ids) + 1`) whenever a new
  customer, loan, or receive record is created.
