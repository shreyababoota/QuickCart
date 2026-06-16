# Requirements Document

## Introduction

This document specifies the requirements for the Conversational Cart Builder with Split-Screen Shopping Experience in QuickCart AI. The feature replaces the existing single-column chat widget with a full-page split-screen layout where a left chat panel (55%) hosts the AI conversation and a right live-cart panel (45%) shows an always-visible, AI-managed cart. The AI acts as a cart agent that knows cart contents, budget, and missing essentials at all times. Cart state is managed entirely in React state during the session and persisted to PostgreSQL only at checkout, using the existing `orders` and `order_items` tables with no new DB tables required for v1.

---

## Glossary

- **SplitLayout**: The root React component that divides the viewport into the ChatPanel (left, 55%) and LiveCartPanel (right, 45%).
- **ChatPanel**: The left panel displaying the conversation, input bar, NudgeCards, and CheckoutConfirmCard.
- **LiveCartPanel**: The right panel displaying live cart items, totals, budget bar, and the checkout button.
- **CartPanel**: Collective term for the LiveCartPanel component.
- **CartItem**: A single product entry in the cart with fields `id`, `name`, `price`, `qty`, `category`, `brand`.
- **CartContext**: The serialized cart snapshot (items, cart_total, item_count, budget_limit, remaining_budget, covered_categories) sent to the backend on every chat request.
- **cartReducer**: The React `useReducer` reducer that processes all cart state mutations.
- **CartDirective**: A structured directive returned by the AI indicating a cart mutation (`ADD`, `REMOVE`, `UPDATE`, `REPLACE`, or `CLEAR`).
- **cartAwareChat**: The Gemini service function that receives full CartContext and returns a conversational reply together with an optional CartDirective.
- **CheckoutConfirmCard**: An inline assistant message component rendered in the chat when `checkout_state` is `confirming`.
- **CheckoutButton**: The button in LiveCartPanel that initiates the checkout flow.
- **AI**: The Gemini-powered conversational assistant integrated via `gemini.js`.
- **Budget_Bar**: The visual progress bar in CartSummary showing cart_total against budget_limit.
- **System**: The QuickCart AI full-stack application (React frontend + Node.js/Express backend + PostgreSQL database).
- **Frontend**: The React CRA client application.
- **Backend**: The Node.js/Express server.
- **Tab_Switcher**: The mobile bottom navigation bar that toggles between the Chat view and Cart view.

---

## Requirements

---

### Requirement 1: Split-Screen Layout

**User Story:** As a shopper, I want a split-screen layout with the chat on the left and my cart always visible on the right, so that I can see cart updates in real time while I converse with the AI.

#### Acceptance Criteria

1. THE SplitLayout SHALL occupy 100% of the viewport width and height (`w-full h-screen`) and render the ChatPanel on the left and LiveCartPanel on the right.
2. WHILE the viewport width is greater than or equal to 768px, THE SplitLayout SHALL render the ChatPanel at 55% width and the LiveCartPanel at 45% width in a horizontal flex row.
3. WHILE the viewport width is less than 768px, THE SplitLayout SHALL stack panels vertically and render the Tab_Switcher at the bottom of the screen.
4. WHEN a user taps the "Chat" tab on the Tab_Switcher, THE SplitLayout SHALL display the ChatPanel and hide the LiveCartPanel.
5. WHEN a user taps the "Cart" tab on the Tab_Switcher, THE SplitLayout SHALL display the LiveCartPanel and hide the ChatPanel.
6. THE Frontend SHALL retire the CartDrawer and CartBadge components from the active component tree while preserving the files in the repository.

---

### Requirement 2: Cart Memory — AI Awareness of Cart State

**User Story:** As a shopper, I want the AI to always know what is in my cart, so that it can give me contextually relevant suggestions without me having to repeat myself.

#### Acceptance Criteria

1. WHEN the Frontend sends a chat message, THE Frontend SHALL include the current CartContext (items, cart_total, item_count, budget_limit, remaining_budget, covered_categories) in the request body under the `cart` field.
2. WHEN the Backend receives a chat request with a non-empty `cart.items` array, THE Backend SHALL invoke `cartAwareChat()` instead of the default intent classifier.
3. WHEN the Backend receives a chat request with an absent or empty `cart.items` array, THE Backend SHALL invoke the existing intent classification path unchanged.
4. THE `cartAwareChat()` function SHALL include the full CartContext in the Gemini prompt so the AI can reference item names, quantities, cart total, covered categories, and remaining budget in its reply.
5. WHEN `cartAwareChat()` returns a CartDirective, THE Backend SHALL include the directive in the `cart_action` field of the chat response.
6. IF `cartAwareChat()` throws or times out, THEN THE Backend SHALL fall back to `localClassify()` and `localReply()`, set `cart_action` to `null` in the response, and return a 200 status.

---

### Requirement 3: Budget Awareness

**User Story:** As a shopper, I want the AI and the cart panel to track my budget in real time, so that I always know how much I have left to spend and receive a warning before I go over.

#### Acceptance Criteria

1. THE Frontend SHALL compute `cart_total` as the sum of `item.price × item.qty` for all CartItems in state after every cartReducer action.
2. WHILE `budget_limit` is not null, THE Frontend SHALL compute `remaining_budget` as `budget_limit − cart_total` after every cartReducer action.
3. WHILE `budget_limit` is null, THE Frontend SHALL set `remaining_budget` to null.
4. THE CartSummary SHALL render the Budget_Bar with fill color `bg-orange-500` when `remaining_budget >= 0` and the fill percentage is at most 80%.
5. THE CartSummary SHALL render the Budget_Bar with fill color `bg-amber-400` when `remaining_budget >= 0` and the fill percentage exceeds 80%.
6. THE CartSummary SHALL render the Budget_Bar with fill color `bg-red-500` when `remaining_budget < 0`.
7. WHEN `cart_total` exceeds `budget_limit`, THE AI SHALL include a budget-warning message in its next reply that states the over-budget amount and offers a cheaper alternative.
8. WHEN a user states a budget amount in chat, THE AI SHALL extract the amount and THE Backend SHALL return it in the `budget` field of the chat response; THE Frontend SHALL dispatch `SET_BUDGET` with that amount.

---

### Requirement 4: Smart Replacements

**User Story:** As a budget-conscious shopper, I want the AI to suggest cheaper alternatives for expensive cart items, so that I can stay within my budget without losing the item category I need.

#### Acceptance Criteria

1. WHEN the AI identifies a cart item that exceeds the user's remaining budget, THE AI SHALL include a replacement suggestion for that item in its reply.
2. WHEN a user approves a replacement suggestion, THE Frontend SHALL dispatch `REPLACE_ITEM` with the original item's `id` as `remove_id` and the replacement product as `add_item`.
3. THE `REPLACE_ITEM` cartReducer action SHALL atomically remove the item with `remove_id` and add the replacement item in a single state update, leaving no intermediate state with both or neither item present.
4. WHEN the Frontend calls `POST /api/cart/replacements`, THE Backend SHALL query products satisfying `price < requested_max_price × 0.85 AND stock > 0 AND product_id ≠ requested_product_id AND category = requested_category`.
5. THE Backend SHALL return only products matching all conditions in Requirement 4.4 in the `alternatives` array of the replacements response.
6. THE Backend SHALL include `savings_amount` (requested max price minus alternative price) and `savings_pct` (savings as a percentage of requested max price) for each alternative.

---

### Requirement 5: Conversational Checkout Flow

**User Story:** As a shopper, I want to initiate and complete checkout entirely through the chat conversation, so that I can confirm, adjust, or cancel my order without navigating away from the chat.

#### Acceptance Criteria

1. WHEN the AI determines the user intends to check out, THE Backend SHALL set `is_checkout_prompt` to `true` in the chat response.
2. WHEN `is_checkout_prompt` is `true` in a chat response, THE Frontend SHALL render the CheckoutConfirmCard as an inline assistant message and set `checkout_state` to `confirming`.
3. THE CheckoutConfirmCard SHALL display `cart_total` and `item_count` and present three action buttons: "Proceed", "Adjust", and "Cancel".
4. WHEN the user clicks "Adjust" on the CheckoutConfirmCard, THE Frontend SHALL send the message "let me adjust" to the chat and set `checkout_state` back to `idle`.
5. WHEN the user clicks "Cancel" on the CheckoutConfirmCard, THE Frontend SHALL set `checkout_state` to `idle` and dismiss the CheckoutConfirmCard.
6. WHEN the user clicks "Proceed" on the CheckoutConfirmCard, THE Frontend SHALL call `POST /api/cart/checkout` and set `checkout_state` to `processing`.
7. THE CheckoutButton in the LiveCartPanel SHALL be disabled when `items.length === 0`.
8. WHEN the CheckoutButton is clicked, THE Frontend SHALL set `is_checkout_prompt` to `true` and render the CheckoutConfirmCard without sending a chat message to the AI.

---

### Requirement 6: Final Order Creation

**User Story:** As a shopper, I want my order to be saved reliably when I confirm checkout, so that my purchase is recorded and I receive a confirmation with an estimated delivery time.

#### Acceptance Criteria

1. WHEN `POST /api/cart/checkout` is called, THE Backend SHALL execute a single DB transaction that inserts one row into `orders` and one row per CartItem into `order_items`.
2. IF the `orders` insert or any `order_items` insert fails, THEN THE Backend SHALL roll back the entire transaction, leave the database unchanged, and return HTTP 500 with `{ "error": "Checkout failed" }`.
3. WHEN the DB transaction commits successfully, THE Backend SHALL return HTTP 201 with `order_id`, `total_amount`, `item_count`, `eta_minutes`, `warehouse_name`, and `order_status: "pending"`.
4. THE `order_id` format SHALL be `ORD-{timestamp}-{random4}` fitting within the `VARCHAR(15)` column constraint.
5. WHEN the Frontend receives a 201 response from `POST /api/cart/checkout`, THE Frontend SHALL dispatch `SET_CHECKOUT_STATE('success')` followed immediately by `CLEAR_CART`.
6. THE Frontend SHALL NOT dispatch `CLEAR_CART` before receiving a 201 response from `POST /api/cart/checkout`.
7. WHEN `checkout_state` transitions to `success`, THE Frontend SHALL display the order summary (order_id, total_amount, eta_minutes, warehouse_name) as an assistant message in the chat.
8. WHEN `POST /api/cart/checkout` is called with an empty `items` array, THE Backend SHALL return HTTP 422 with `{ "error": "Cart is empty" }` without writing any DB rows.

---

### Requirement 7: Live Cart UI — Real-Time Updates

**User Story:** As a shopper, I want the cart panel to reflect every addition, removal, and quantity change instantly, so that I always see an accurate and up-to-date cart without reloading the page.

#### Acceptance Criteria

1. WHEN a CartDirective of type `ADD` is returned in a chat response, THE Frontend SHALL dispatch `ADD_ITEM` to cartReducer within the same render cycle as the message append.
2. WHEN a CartDirective of type `REMOVE` is returned in a chat response, THE Frontend SHALL dispatch `REMOVE_ITEM` to cartReducer within the same render cycle as the message append.
3. WHEN a CartDirective of type `UPDATE` is returned in a chat response, THE Frontend SHALL dispatch `UPDATE_QTY` to cartReducer within the same render cycle as the message append.
4. WHEN a CartDirective of type `REPLACE` is returned in a chat response, THE Frontend SHALL dispatch `REPLACE_ITEM` to cartReducer within the same render cycle as the message append.
5. WHEN a CartDirective of type `CLEAR` is returned in a chat response, THE Frontend SHALL dispatch `CLEAR_CART` to cartReducer within the same render cycle as the message append.
6. WHEN a user clicks the "+" or "−" quantity control on a CartItem, THE Frontend SHALL dispatch `UPDATE_QTY` with the appropriate delta and THE LiveCartPanel SHALL reflect the new quantity and line total without a page reload.
7. WHEN `UPDATE_QTY` reduces a CartItem's quantity to zero or below, THE cartReducer SHALL remove that item from the items array.
8. WHEN a user clicks the remove icon on a CartItem, THE Frontend SHALL dispatch `REMOVE_ITEM` and THE LiveCartPanel SHALL remove the item from the displayed list without a page reload.
9. WHEN `ADD_ITEM` is dispatched for a `product_id` already present in the cart, THE cartReducer SHALL increment that item's `qty` by 1 and SHALL NOT append a duplicate entry.
10. WHEN `ADD_ITEM` is dispatched for a `product_id` not present in the cart, THE cartReducer SHALL append a new CartItem with `qty` set to 1.

---

### Requirement 8: Responsive Design

**User Story:** As a shopper on a mobile device, I want the app to adapt to my screen size with a tab-based navigation, so that I can switch between the chat and cart views comfortably on a small screen.

#### Acceptance Criteria

1. WHILE the viewport width is greater than or equal to 768px, THE SplitLayout SHALL display both the ChatPanel and LiveCartPanel simultaneously in a horizontal row with no Tab_Switcher rendered.
2. WHILE the viewport width is less than 768px, THE SplitLayout SHALL display only one panel at a time and SHALL render the Tab_Switcher with a "Chat" tab and a "Cart" tab.
3. WHILE the viewport width is less than 768px, THE SplitLayout SHALL default to showing the ChatPanel when the page first loads.
4. WHEN the active tab on the Tab_Switcher changes, THE SplitLayout SHALL update the visible panel within 100ms with no page navigation.

---

### Requirement 9: Error Handling

**User Story:** As a shopper, I want the app to recover gracefully from AI failures, checkout errors, out-of-stock items, and network issues, so that I never lose my cart and can retry without starting over.

#### Acceptance Criteria

1. IF the Gemini API call throws or times out, THEN THE Backend SHALL return a response using `localClassify()` and `localReply()` with `cart_action` set to `null` and `is_checkout_prompt` set to `false`, and SHALL NOT modify the cart.
2. IF `POST /api/cart/checkout` returns HTTP 500, THEN THE Frontend SHALL set `checkout_state` to `'error'`, preserve the cart items unchanged, and display a "Try again" button in the chat.
3. WHEN `checkout_state` is `'error'`, THE Frontend SHALL retain all CartItems in state so the user can retry checkout.
4. IF `POST /api/cart/checkout` returns HTTP 422 with an out-of-stock product_id, THEN THE Frontend SHALL set `checkout_state` to `'confirming'` and display an assistant message identifying the out-of-stock item and suggesting a replacement.
5. IF a `fetch` call to `/api/chat` or `/api/cart/checkout` throws a network error, THEN THE Frontend SHALL append an error message bubble to the chat messages array and reset `loading` or `checkout_state` to the appropriate idle state.
6. WHEN `checkout_state` is `'error'`, THE CheckoutConfirmCard SHALL display a "Try again" action that re-invokes `POST /api/cart/checkout` with the preserved cart items.

---

### Requirement 10: No New Database Tables for v1

**User Story:** As a backend developer, I want the v1 cart to use only existing database tables, so that the feature ships without requiring a schema migration.

#### Acceptance Criteria

1. THE Backend SHALL persist cart data exclusively to the existing `orders` and `order_items` tables and SHALL NOT create or reference any new tables for v1.
2. THE Frontend SHALL store all in-session cart state exclusively in React state via `cartReducer` and SHALL NOT make any database writes during the chat session prior to checkout confirmation.
3. THE `order_id` generated at checkout SHALL conform to the pattern `ORD-{timestamp}-{random4}` and SHALL NOT exceed 15 characters in length to satisfy the existing `VARCHAR(15)` column constraint on `orders.order_id`.
