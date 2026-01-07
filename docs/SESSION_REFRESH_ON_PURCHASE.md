# Session Refresh on Subscription Purchase

## Overview
After a user successfully purchases a subscription, the app now automatically refreshes the user's session data to ensure all premium flags and subscription details are immediately available throughout the application.

## Problem
Previously, after purchasing a subscription:
1. User would be redirected to their destination page (chat or home)
2. Premium status flags were not updated in Redux state
3. User data in localStorage was stale
4. Components would still show non-premium UI until manual page refresh

## Solution
Added automatic session refresh using the `/auth/verify-session` API after successful subscription purchase.

## Implementation

### 1. SubscriptionPurchaseModal Updates

**File**: `src/components/modals/SubscriptionPurchaseModal.tsx`

#### New Imports:
```typescript
import { useVerifySessionMutation } from '@/redux/services/googleAuthApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
```

#### New Helper Function:
```typescript
const refreshUserSession = async () => {
  try {
    const sessionToken = localStorage.getItem('accessToken');
    const userDataStr = localStorage.getItem('userData');
    
    if (sessionToken && userDataStr) {
      const userData = JSON.parse(userDataStr);
      const response = await verifySession({
        sessionToken,
        email: userData.email,
        userId: userData._id || userData.id,
      }).unwrap();

      // Update Redux store with fresh user data
      if (response.user) {
        dispatch(setCredentials(response));
      }
    }
  } catch (error) {
    console.error('Error refreshing user session:', error);
    // Don't show error to user, silent failure
  }
};
```

#### UPI Purchase Flow:
```typescript
const handleUPIPurchase = async () => {
  setIsProcessing(true);

  try {
    const response = await purchaseWithUPI({ planId }).unwrap();

    // Refresh user session to get updated premium status
    await refreshUserSession();

    showSnackbar('Subscription activated successfully! 🎉', 'success');
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    // Error handling...
  }
};
```

#### Telegram Stars Purchase Flow:
```typescript
if (status === 'paid') {
  completeSubscription({ transactionId })
    .unwrap()
    .then(async () => {
      // Refresh user session to get updated premium status
      await refreshUserSession();
      
      showSnackbar('Subscription activated successfully! 🎉', 'success');
      if (onSuccess) {
        onSuccess();
      }
    });
}
```

## Flow Diagram

### Before (Issue):
```
User clicks purchase 
→ Backend activates subscription 
→ Modal calls onSuccess() 
→ User redirected 
→ ❌ Stale user data (not premium)
```

### After (Fixed):
```
User clicks purchase 
→ Backend activates subscription 
→ Modal calls refreshUserSession() 
→ Fetch /auth/verify-session 
→ Update Redux store & localStorage 
→ ✅ Fresh user data (premium status updated)
→ Modal calls onSuccess() 
→ User redirected 
→ ✅ All components see premium user
```

## What Gets Updated

When `refreshUserSession()` is called:

1. **Redux State** (`state.auth.user`):
   - `user.subscriber.isPremiumSubscriber`: `true`
   - `user.subscriptionDetails`:
     - `planId`: The subscription plan ID
     - `planValidity`: Duration in months
     - `startDate`: When subscription started
     - `expiryDate`: When subscription expires
     - `isActive`: `true`
     - `reminderSent`: `false`

2. **localStorage**:
   - `userData`: Updated with fresh user object
   - `accessToken`: Remains the same

## Benefits

1. **Immediate UI Updates**: All components immediately see the user as premium
2. **Correct Navigation**: UserDropdown shows "Wallet" instead of "Subscription"
3. **Proper Access Control**: Premium features become immediately available
4. **No Page Refresh Needed**: User experience is seamless
5. **Consistent State**: Redux, localStorage, and backend are all in sync

## Usage in Other Components

Any component using Redux state will automatically see the updated user data:

```typescript
import { useAppSelector } from '@/redux/hooks';

const MyComponent = () => {
  const user = useAppSelector(state => state.auth.user);
  
  // Will immediately reflect premium status after purchase
  const isPremium = user?.subscriber?.isPremiumSubscriber || user?.isPremiumSubscriber;
  
  // Will have subscription details after purchase
  const expiryDate = user?.subscriptionDetails?.expiryDate;
  
  return (
    <div>
      {isPremium ? 'Premium User' : 'Free User'}
      {expiryDate && `Expires: ${new Date(expiryDate).toLocaleDateString()}`}
    </div>
  );
};
```

## Error Handling

- Session refresh errors are caught and logged silently
- User is not notified of session refresh failures
- Success message and navigation still proceed even if refresh fails
- This ensures purchase success is never blocked by session refresh issues

## Testing

### Test UPI Purchase with Session Refresh:
1. Open browser DevTools Network tab
2. Purchase a subscription with UPI
3. Observe API calls:
   - `POST /subscription/upi/purchase` → Success
   - `POST /auth/verify-session` → Success (automatic)
4. Check Redux DevTools:
   - `auth/setCredentials` action dispatched
   - User state updated with premium status
5. Navigate to any page - premium features should be immediately available

### Test Telegram Stars Purchase:
1. Purchase with Telegram Stars
2. Complete payment in Telegram
3. Same verification as above

## Related Files

- `src/components/modals/SubscriptionPurchaseModal.tsx` - Main implementation
- `src/redux/services/googleAuthApi.ts` - Verify session mutation
- `src/redux/slices/authSlice.ts` - setCredentials action
- `src/app/subscriptions/page.tsx` - Uses the modal
- `src/components/navigation/UserDropdown.tsx` - Shows updated premium status
- `src/hooks/useChat.ts` - Uses premium status for navigation

## Notes

- Session refresh happens **before** the onSuccess callback
- This ensures user data is fresh when navigation occurs
- Works for both UPI and Telegram Stars payment methods
- Compatible with existing authentication flow

