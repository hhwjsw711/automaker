# Affiliate Program Requirements

> **Navigation**: [← Back to Affiliates](./readme.md) | [Changelog](./changelog.md) | [Test Scenarios](./tests/)

## Overview
The affiliate program enables users to earn commissions by referring new customers to purchase the Automaker course. Affiliates receive a unique tracking link and earn 30% commission on all referred sales.

> **Note**: Requirements with clickable links have detailed test scenarios available. Click on any linked requirement ID to view its test documentation.

## Business Requirements

### 1. User Registration & Eligibility
- **[REQ-AF-001](./tests/REQ-AF-001.md)**: Any authenticated user can register as an affiliate
- **[REQ-AF-002](./tests/REQ-AF-002.md)**: Users must agree to the Terms of Service before becoming affiliates
- **REQ-AF-003**: Users must provide a valid payment link (PayPal, Venmo, etc.) for receiving payouts
- **REQ-AF-004**: One affiliate account per user (no duplicate registrations)

### 2. Affiliate Code & Tracking
- **[REQ-AF-005](./tests/REQ-AF-005.md)**: Each affiliate receives a unique 8-character alphanumeric code
- **REQ-AF-006**: Affiliate codes must be case-insensitive and URL-safe
- **REQ-AF-007**: System must generate unique codes with retry mechanism (up to 10 attempts)
- **REQ-AF-008**: Tracking links follow format: `/purchase?ref={affiliateCode}`

### 3. Code Attribution & Privacy
- **REQ-AF-009**: Affiliate codes must be captured from URL parameters (`?ref={code}`)
- **REQ-AF-010**: Codes stored in memory only during checkout session for GDPR compliance
- **REQ-AF-011**: Last-click attribution model (last affiliate link clicked gets credit)
- **REQ-AF-012**: No persistent browser storage (cookies/localStorage) to avoid privacy concerns

### 4. Commission Structure
- **[REQ-AF-013](./tests/REQ-AF-013.md)**: 30% commission rate on all referred sales
- **REQ-AF-014**: Commission calculated on net sale price (after any discounts)
- **REQ-AF-015**: Commissions tracked in cents to avoid floating point issues
- **REQ-AF-016**: No commission on self-referrals (affiliate cannot use own code)

### 5. Payment & Payouts
- **REQ-AF-017**: $50 minimum payout threshold
- **REQ-AF-018**: Monthly payout schedule
- **REQ-AF-019**: Affiliates can update payment link at any time
- **REQ-AF-020**: Admin must manually process payouts and record transaction details
- **REQ-AF-021**: Track paid vs unpaid balances separately

### 6. Dashboard & Analytics
- **[REQ-AF-022](./tests/REQ-AF-022.md)**: Affiliates can view real-time statistics:
  - Total lifetime earnings
  - Unpaid balance
  - Total referrals count
  - Amount already paid out
- **REQ-AF-023**: Detailed referral history with dates and amounts
- **REQ-AF-024**: Payout history with transaction details
- **REQ-AF-025**: Monthly earnings breakdown chart

### 7. Admin Management
- **REQ-AF-026**: Admin can view all affiliates with statistics
- **REQ-AF-027**: Admin can activate/deactivate affiliate accounts
- **REQ-AF-028**: Admin can record payouts with transaction details
- **REQ-AF-029**: Admin can view detailed analytics for all affiliates

### 8. Fraud Prevention
- **[REQ-AF-030](./tests/REQ-AF-030.md)**: Prevent self-referrals (user cannot use own affiliate code)
- **REQ-AF-031**: Unique constraint on Stripe session IDs to prevent duplicate processing
- **REQ-AF-032**: Validate affiliate codes before processing referrals
- **REQ-AF-033**: Only active affiliates can earn commissions

### 9. Integration Requirements
- **[REQ-AF-034](./tests/REQ-AF-034.md)**: Process referrals via Stripe webhook on successful payment
- **REQ-AF-035**: Pass affiliate code as metadata in Stripe checkout session
- **REQ-AF-036**: Handle race conditions with database transactions
- **REQ-AF-037**: Log warnings for invalid/duplicate referral attempts

### 10. User Experience
- **REQ-AF-038**: Non-authenticated users see landing page with program benefits
- **REQ-AF-039**: Authenticated non-affiliates see registration form
- **REQ-AF-040**: Existing affiliates redirect to dashboard
- **REQ-AF-041**: Copy-to-clipboard functionality for affiliate link
- **REQ-AF-042**: Terms of Service displayed in modal dialog

### 11. Discount System
- **[REQ-AF-048](./tests/REQ-AF-048.md)**: Display discount dialog during checkout process for all users
- **[REQ-AF-049](./tests/REQ-AF-049.md)**: Allow users to enter affiliate codes to receive 10% discount
- **[REQ-AF-050](./tests/REQ-AF-050.md)**: Validate affiliate codes against database in real-time
- **REQ-AF-051**: Apply Stripe discount coupon when valid affiliate code is provided
- **[REQ-AF-052](./tests/REQ-AF-052.md)**: Pre-fill discount dialog with affiliate code from URL parameter
- **REQ-AF-053**: Allow users to skip discount entry and proceed with full price
- **[REQ-AF-054](./tests/REQ-AF-054.md)**: Store discount codes in memory only during checkout session

### 12. Prohibited Activities (Terms Enforcement)
- **REQ-AF-043**: System must support deactivation for violations:
  - Spam or unsolicited emails
  - Misleading or false advertising
  - Self-referrals or fraudulent purchases
  - Trademark or brand misrepresentation
  - Paid search advertising on trademarked terms

### 13. Data Storage Requirements
- **REQ-AF-044**: Store affiliate data in PostgreSQL with proper indexes
- **REQ-AF-045**: Maintain referential integrity with cascade deletes
- **REQ-AF-046**: Track creation and update timestamps for audit trail
- **REQ-AF-047**: Store commission amounts in cents (integer) to avoid precision issues

## Technical Requirements

### Database Schema
- `affiliates` table with user relationship
- `affiliate_referrals` table for tracking individual sales
- `affiliate_payouts` table for payment history
- Proper indexes on frequently queried fields (userId, affiliateCode)

### API Endpoints (Server Functions)
- `registerAffiliateFn` - Register new affiliate
- `getAffiliateDashboardFn` - Get affiliate analytics
- `checkIfUserIsAffiliateFn` - Check affiliate status
- `updateAffiliatePaymentLinkFn` - Update payment details
- `validateAffiliateCodeFn` - Validate affiliate code (used by discount dialog)
- `adminGetAllAffiliatesFn` - Admin view all affiliates
- `adminToggleAffiliateStatusFn` - Admin activate/deactivate
- `adminRecordPayoutFn` - Admin record payout

### Environment Variables
- `STRIPE_DISCOUNT_COUPON_ID` - Stripe coupon ID for 10% affiliate discount

### Components
- `DiscountDialog` - Modal dialog for discount code entry during checkout
- `DiscountStore` - In-memory store for managing discount codes during session

### Security Requirements
- Authentication required for affiliate registration and dashboard
- Admin authentication for management functions
- URL validation for payment links
- Protection against SQL injection via parameterized queries
- CSRF protection on state-changing operations

## Success Metrics
- Affiliate conversion rate (visitors to affiliates)
- Average earnings per affiliate
- Referral conversion rate
- Time to first referral
- Payout processing time
- Affiliate retention rate