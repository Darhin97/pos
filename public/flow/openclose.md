Open and close page

W

- Add RegisterShift, ShiftSummary, and PaymentBreakdown types
- Create OpenRegisterModal for shift opening with float entry
- Create CloseRegisterModal for shift closing with cash reconciliation
- Implement ShiftContext for managing shift state with localStorage
- Add register management page (/dashboard/register)
- Add shift guard to orders page (redirects if no open shift)
- Update sidebar with shift status indicator
- Redirect orders/open-close to register page

Features:

- Cashiers must open register with initial float before making sales
- Close register requires actual cash count with discrepancy detection
- Shift data persists in localStorage for offline-first support
- Real-time shift status displayed in sidebar
