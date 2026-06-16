# Requirements Document

## Introduction

This specification defines how to integrate the existing AI Assistant module (Node.js server in `Ai Assesstent/server/`) and the Flask Backend (`backend/`) into the existing React frontend (`Ai Assesstent/client/`) without modifying any UI, theme, colors, layouts, responsiveness, navigation, or component structure. The integration connects the AI chat service, goal-based cart management, and recommendation engine to the already-built frontend through an API service layer and React context/state management.

## Glossary

- **Frontend**: The React application located in `Ai Assesstent/client/` built with React 18, Create React App, and Tailwind CSS
- **AI_Server**: The Node.js Express server located in `Ai Assesstent/server/` providing chat intent extraction, product recommendations, and cart intelligence via Gemini AI
- **Flask_Backend**: The Python Flask application located in `backend/` providing authentication, goals, cart persistence, orders, and product data via REST APIs with JWT authentication
- **Chat_Panel**: The existing `ChatPanel.js` component that renders the conversational AI interface
- **Live_Cart_Panel**: The existing `LiveCartPanel.js` component that shows staging cart items with budget tracking
- **Plan**: A user-defined shopping goal (e.g., "Goa Trip Plan", "Home Gym Plan") stored as a Goal entity in the Flask_Backend with a budget field
- **Goal_ID**: The unique identifier linking cart items to a specific Plan in the database
- **Product_Card**: The existing UI component rendering product information with an Add To Cart button
- **Plan_Selection_Modal**: A popup/modal that appears when the user clicks Add To Cart from AI recommendations, offering options to assign the product to a Plan or General Cart
- **Grouped_Cart_Page**: The final cart view showing products organized by Plan with budget tracking (Budget, Spent, Remaining)
- **API_Service_Layer**: A frontend JavaScript module that abstracts all HTTP calls to both the AI_Server and Flask_Backend behind a unified interface
- **Session_Context**: React context providing user authentication state, goals, cart data, and chat history across components

## Requirements

### Requirement 1: API Service Layer Setup

**User Story:** As a frontend developer, I want a unified API service layer that communicates with both the AI_Server and Flask_Backend, so that all HTTP calls are centralized and maintainable.

#### Acceptance Criteria

1. THE API_Service_Layer SHALL provide methods that send POST requests to AI_Server endpoints at `/api/chat`, `/api/cart/intelligence`, and `/api/cart/post-add-suggestion`, sending and receiving JSON payloads
2. THE API_Service_Layer SHALL provide methods for calling Flask_Backend endpoints at `/api/auth`, `/api/goals`, `/api/cart`, `/api/assistant`, `/api/products`, and `/api/orders`, sending and receiving JSON payloads
3. THE API_Service_Layer SHALL attach the JWT token from local storage to every Flask_Backend request as an Authorization Bearer header
4. IF no JWT token exists in local storage when a Flask_Backend request (other than `/api/auth`) is initiated, THEN THE API_Service_Layer SHALL redirect the user to the login screen without sending the request
5. IF a Flask_Backend request returns a 401 status code, THEN THE API_Service_Layer SHALL remove the stored JWT token from local storage and redirect the user to the login screen
6. IF a request to either backend does not receive a response within 30 seconds, THEN THE API_Service_Layer SHALL abort the request and return an error object indicating a timeout occurred
7. THE API_Service_Layer SHALL use environment variables (`REACT_APP_AI_SERVER_URL`, `REACT_APP_FLASK_BACKEND_URL`) to configure base URLs for the AI_Server and Flask_Backend, and SHALL fail to initialize with a console error if either variable is undefined

### Requirement 2: Authentication Integration

**User Story:** As a user, I want to log in once and have both the AI Assistant and cart features recognize my identity, so that my data is consistent across services.

#### Acceptance Criteria

1. WHEN the user submits valid login credentials, THE Frontend SHALL store the JWT token returned by the Flask_Backend `/api/auth/login` endpoint in local storage within 1 second of receiving the response
2. WHILE the user is authenticated, THE Frontend SHALL include the `userId` field extracted from the stored JWT token in every request body sent to the AI_Server (including `/api/chat` and `/api/cart/intelligence` endpoints)
3. WHILE the user is authenticated, THE Frontend SHALL include the stored JWT token in the Authorization header of every request sent to the Flask_Backend
4. IF the Flask_Backend returns a 401 status code indicating an expired or missing token, THEN THE Frontend SHALL remove the stored JWT token from local storage and display the login screen while preserving the current application state in memory
5. THE Frontend SHALL use the same user identifier value derived from the JWT token for both Flask_Backend requests (via Authorization header) and AI_Server requests (via `userId` body field)
6. IF the stored JWT token is absent when the user attempts any authenticated action, THEN THE Frontend SHALL redirect the user to the login screen within 500 milliseconds without executing the requested action

### Requirement 3: AI Chat Integration

**User Story:** As a user, I want to click "AI Assistant" and have a chat panel open inside the existing frontend page, so that I can interact with the AI without leaving my current view.

#### Acceptance Criteria

1. WHEN the user clicks the AI Assistant entry point, THE Frontend SHALL render the Chat_Panel component within the existing page layout without changing routes or navigation structure
2. WHEN the user sends a chat message, THE Frontend SHALL forward the message to the AI_Server `/api/chat` endpoint with the most recent 6 chat history messages, current cart items (id, name, price, qty, category), budget, and userId
3. WHEN the AI_Server responds with a SHOPPING_REQUEST result, THE Chat_Panel SHALL display up to 6 product recommendations in a 3-column grid using the existing NudgeCard component layout
4. WHEN the AI_Server responds with a GREETING or NON_SHOPPING_REQUEST result, THE Chat_Panel SHALL display the plain text reply as a bot message bubble
5. THE Frontend SHALL pass the current cart products (id, name, price, qty, category) and budget to the AI_Server as context with each request, so the AI can reference existing cart state in its responses
6. WHILE the Frontend is awaiting a response from the AI_Server `/api/chat` endpoint, THE Chat_Panel SHALL display an animated typing indicator in the message area and disable the message input field
7. IF the AI_Server `/api/chat` endpoint returns a non-200 status or the request fails due to a network error, THEN THE Chat_Panel SHALL display an error message indicating the server could not be reached and allow the user to retry
8. WHEN the user types a chat message, THE Frontend SHALL limit the message input to a maximum of 500 characters before sending

### Requirement 4: AI Follow-Up Question Flow

**User Story:** As a user, I want the AI Assistant to ask follow-up questions to collect trip planning details (destination, days, people, accessories), so that the recommendations are personalized.

#### Acceptance Criteria

1. WHEN the user sends an initial message that contains a goal keyword (e.g., "planning a Goa trip", "gym setup", "new semester"), THE Frontend SHALL call the Flask_Backend `/api/assistant/start` endpoint with the message text to initiate a structured question session and display the first follow-up question returned in the response as a bot message
2. WHILE the assistant session status is "collecting", THE Chat_Panel SHALL display each follow-up question as a bot message along with a progress indicator showing the current question number out of total questions (e.g., "Question 2 of 7"), and SHALL keep the text input enabled for the user to respond
3. WHEN the user submits an answer to a follow-up question, THE Frontend SHALL call the Flask_Backend `/api/assistant/answer` endpoint with the session_id and the user answer, and SHALL display the user's answer as a user message in the chat
4. IF the `/api/assistant/start` or `/api/assistant/answer` endpoint returns an error response (HTTP 400, 403, or network failure), THEN THE Chat_Panel SHALL display an error message indicating the failure reason and SHALL allow the user to retry their last action without losing previously collected answers
5. WHEN the assistant session status changes to "complete", THE Chat_Panel SHALL display the categorized results in four distinct sections: Recommended Products (up to 10 items), Must Buy Items, Optional Items, and Forget List
6. WHILE the assistant session status is "collecting", THE Frontend SHALL disable navigation away from the chat or starting a new assistant session until the current session reaches "complete" status or the user explicitly cancels

### Requirement 5: AI Recommendation Display

**User Story:** As a user, I want AI-generated product recommendations displayed using the existing product card components, so that the experience is visually consistent.

#### Acceptance Criteria

1. WHEN the `/api/chat` endpoint response contains a non-empty `recommendations` array, THE Chat_Panel SHALL render each recommendation item using the existing NudgeCard component, preserving the NudgeCard's existing CSS classes, border-color scheme per nudge_type, layout structure, and badge/CTA elements without modification
2. WHEN the `/api/chat` endpoint response contains a non-empty `recommendations` array, THE Chat_Panel SHALL render products grouped by their `nudge_type` value (bundle, compare, substitute, social_proof), each group preceded by a visible section label matching the NudgeCard NUDGE_CONFIG label for that type
3. WHEN the AI_Server returns recommendations via the `/api/chat` endpoint, THE Chat_Panel SHALL render the products in the existing NudgeCard grid layout (3 columns, maximum 6 items) within a container with a maximum width of 384px
4. IF the `/api/chat` endpoint response contains a non-empty `budget_suggestions` array, THEN THE Chat_Panel SHALL render each suggestion using the existing BudgetSuggestions component, displaying the original item name and price, the replacement item name and price, the savings amount, and an "Apply" action button
5. IF the `/api/chat` endpoint response contains an empty `recommendations` array or the request fails, THEN THE Chat_Panel SHALL not render the NudgeCard grid and SHALL continue displaying the conversation without error

### Requirement 6: Plan Selection Modal on Add To Cart

**User Story:** As a user, I want a modal to appear when I click Add To Cart from AI recommendations, so that I can choose which Plan (or General Cart) the product should be added to.

#### Acceptance Criteria

1. WHEN the user clicks Add To Cart on a product from AI recommendations, THE Frontend SHALL display the Plan_Selection_Modal with three options presented as radio buttons: "Add to Existing Plan", "Create New Plan", and "General Cart"
2. WHEN the Plan_Selection_Modal is displayed, THE Frontend SHALL fetch the user's existing Plans from the Flask_Backend `/api/goals` endpoint and display them as a selectable list under the "Add to Existing Plan" option
3. IF the `/api/goals` endpoint returns an empty list, THEN THE Frontend SHALL disable the "Add to Existing Plan" radio button and display a message indicating no plans exist
4. WHEN the user selects "Add to Existing Plan" and chooses a Plan, THE Frontend SHALL call the Flask_Backend `/api/cart/add` endpoint with the selected goal_id and product_id
5. WHEN the user selects "Create New Plan", THE Plan_Selection_Modal SHALL display a plan name text input (maximum 100 characters, required) and a budget numeric input (minimum 0.01, maximum 9,999,999, optional), then on confirmation call Flask_Backend `/api/goals/create` followed by `/api/cart/add` with the new goal_id
6. IF the plan name field is empty when the user confirms "Create New Plan", THEN THE Frontend SHALL display an inline validation error indicating that plan name is required, and SHALL NOT submit the request
7. WHEN the user selects "General Cart", THE Frontend SHALL call the Flask_Backend `/api/cart/add` endpoint with goal_id set to null
8. WHEN the `/api/cart/add` endpoint returns a success response, THE Frontend SHALL close the Plan_Selection_Modal and display a confirmation message indicating the product was added for at least 3 seconds
9. IF the `/api/cart/add` endpoint returns a 409 status, THEN THE Frontend SHALL display a message within the modal indicating the product already exists in the selected plan and SHALL keep the modal open
10. IF the `/api/goals` fetch or `/api/cart/add` request fails with a network or server error, THEN THE Frontend SHALL display an error message within the modal indicating the operation failed and SHALL keep the modal open with user selections preserved
11. WHEN the user clicks the Cancel button in the Plan_Selection_Modal, THE Frontend SHALL close the modal without making any API calls and without changing cart state
12. THE Plan_Selection_Modal SHALL use Tailwind CSS utility classes and the same modal overlay pattern, border-radius, shadow, and spacing scale as the existing CheckoutModal component

### Requirement 7: Goal-Product Association Storage

**User Story:** As a user, I want products stored with a goal_id and product_id association in the database, so that my cart items are linked to their respective Plans.

#### Acceptance Criteria

1. WHEN a product is added to cart with a Plan selected, THE Flask_Backend SHALL store a CartItem record with the corresponding goal_id and product_id
2. WHEN a product is added to General Cart, THE Flask_Backend SHALL store a CartItem record with goal_id set to NULL and the product_id
3. THE Flask_Backend SHALL prevent duplicate CartItem entries for the same cart_id, goal_id, and product_id combination by returning HTTP 409
4. WHEN a product is removed from cart, THE Flask_Backend SHALL delete the specific CartItem record matching cart_id, goal_id, and product_id

### Requirement 8: Grouped Cart Page with Budget Tracking

**User Story:** As a user, I want the final Cart Page to show products grouped by Plan with budget tracking (Budget, Spent, Remaining), so that I can manage spending per goal.

#### Acceptance Criteria

1. WHEN the user navigates to the Cart Page, THE Frontend SHALL call the Flask_Backend `/api/cart/grouped` endpoint to fetch cart items organized by Plan
2. THE Frontend SHALL render each Plan group showing: Plan name, Budget amount, Spent amount (sum of product prices in that plan), and Remaining amount (Budget minus Spent)
3. THE Frontend SHALL display a budget status indicator using the color scheme: green when Spent is below 85% of Budget, yellow when Spent is between 85% and 100% of Budget, and red when Spent exceeds Budget
4. THE Frontend SHALL render a "General Cart" section for items not associated with any Plan, displayed without budget tracking
5. WHEN a product is removed from a Plan group, THE Frontend SHALL update the budget tracking display for that Plan without a full page reload
6. IF a Plan has no budget set (budget is 0 or null), THEN THE Frontend SHALL display "No budget set" in place of the budget tracker for that Plan group

### Requirement 9: AI Context Awareness

**User Story:** As a user, I want the AI Assistant to know about my goals, existing plans, cart products, wishlist, and previous purchases, so that it gives contextually relevant recommendations.

#### Acceptance Criteria

1. WHEN sending a chat message to the AI_Server, THE Frontend SHALL include the user's current goals list (id, goal_text, budget) in the request context
2. WHEN sending a chat message to the AI_Server, THE Frontend SHALL include the current cart products with their associated goal_ids (product_id, name, price, category, goal_id) in the request context
3. WHEN sending a chat message to the AI_Server, THE Frontend SHALL include the user's order history fetched from Flask_Backend `/api/orders` in the request context
4. THE AI_Server SHALL use the cart context, budget state, and user history to generate recommendations that exclude products already present in the user's cart or purchased within the last 30 days
5. IF the Flask_Backend `/api/orders` or `/api/goals` endpoints are unavailable, THEN THE Frontend SHALL send the chat message with available context only and not block the conversation

### Requirement 10: Real-Time Cart Updates

**User Story:** As a user, I want the cart to update instantly when products are added or removed, so that I always see current totals.

#### Acceptance Criteria

1. WHEN a product is added to the cart via product recommendations or the Live_Cart_Panel, THE Frontend SHALL update the cart state and re-render affected components within the same React render cycle (no page reload, no additional user action required)
2. WHEN a product is removed from the cart or its quantity is changed, THE Frontend SHALL recalculate and display updated totals (item count, cart total amount, and remaining budget if a budget is set) within the same React render cycle
3. WHEN the cart contents change (item added, removed, quantity updated, or item replaced), THE Frontend SHALL issue a request to the AI_Server `/api/cart/intelligence` endpoint within 500 milliseconds, cancelling any in-flight prior intelligence request
4. IF the `/api/cart/intelligence` request fails or does not respond within 5 seconds, THEN THE Frontend SHALL retain the previously displayed intelligence data and not block cart interaction or display
5. THE Frontend SHALL use React state management (context or lifted state) to propagate cart changes to all rendered components (Chat_Panel, Live_Cart_Panel, Grouped_Cart_Page) such that all visible cart totals and item counts reflect the same cart state after each render cycle
6. WHEN the cart becomes empty (last item removed or checkout completed), THE Frontend SHALL clear the cart intelligence data and reset displayed totals to zero

### Requirement 11: Real-Time Goal Budget Updates

**User Story:** As a user, I want goal budget indicators to update instantly when products are added or removed from a Plan, so that I can track spending in real time.

#### Acceptance Criteria

1. WHEN a product is added to a Plan, THE Frontend SHALL recalculate and display the updated Spent and Remaining amounts for that Plan within 500 milliseconds, where Spent equals the sum of each product's price multiplied by its quantity, and Remaining equals Budget minus Spent
2. WHEN a product is removed from a Plan, THE Frontend SHALL recalculate and display the updated Spent and Remaining amounts for that Plan within 500 milliseconds using the same calculation as criterion 1
3. WHEN the Spent amount exceeds the Budget amount for a Plan, THE Frontend SHALL change the budget progress bar color to red and display an "Over Budget" label indicating the amount exceeded
4. WHEN the Spent amount exceeds 80% of the Budget amount but does not exceed the Budget amount, THE Frontend SHALL change the budget progress bar color to yellow
5. IF the Spent amount transitions from exceeding the Budget to being at or below the Budget, THEN THE Frontend SHALL change the budget status indicator back to green and remove the "Over Budget" label
6. THE Frontend SHALL call the Flask_Backend `/api/goals/{goal_id}/budget` endpoint to verify budget calculations every 60 seconds and reconcile local state if the server value differs from the locally computed value
7. IF no budget has been set for a Plan, THEN THE Frontend SHALL display a "Not set" label in place of the budget tracker and provide an input field allowing the user to set a budget value between 1 and 999,999,999

### Requirement 12: Chat History Persistence

**User Story:** As a user, I want my chat history to persist after page refresh, so that I can continue conversations without losing context.

#### Acceptance Criteria

1. WHEN a new message is added to the chat (user or assistant), THE Frontend SHALL serialize the complete message array (including all metadata fields: recommendations, intents, budget_suggestions, checkout_pending, eta, urgency_required) to JSON and save it to browser local storage under a dedicated key, within 1 second of the message being appended to state
2. WHEN the Frontend loads and valid chat history exists in local storage, THE Frontend SHALL parse the stored JSON, restore all messages with their metadata, and display them in the Chat_Panel in their original order
3. IF the stored chat history in local storage is missing, empty, or fails JSON parsing, THEN THE Frontend SHALL discard the corrupt data, display only the default welcome message, and not throw an unhandled error
4. THE Frontend SHALL store a maximum of 200 messages in local storage; WHEN the message count exceeds 200, THE Frontend SHALL remove the oldest messages (excluding the welcome message) to stay within the limit
5. WHEN the user clicks the clear-chat control in the Chat_Panel header, THE Frontend SHALL remove the stored messages from local storage and reset the Chat_Panel to display only the welcome message
6. IF writing to local storage fails (e.g., quota exceeded), THEN THE Frontend SHALL continue operating with the in-memory message state and display an indication to the user that chat history could not be saved

### Requirement 13: Preserve Existing Frontend

**User Story:** As a frontend developer, I want all existing routes, UI components, themes, responsiveness, navigation, and component structure to remain unchanged, so that the integration adds capability without breaking existing work.

#### Acceptance Criteria

1. THE Frontend SHALL retain all existing route paths and navigation links without modification
2. THE Frontend SHALL retain all existing Tailwind CSS classes, color values, spacing, font sizes, and responsive breakpoints without modification
3. THE Frontend SHALL retain all existing component file names, folder structure, and export interfaces without modification
4. WHEN the integration is complete, THE Frontend SHALL produce zero visual differences compared to the pre-integration baseline when rendered at viewport widths of 375px (mobile), 768px (tablet), and 1280px (desktop)
5. IF a new component is needed for integration, THEN THE Frontend SHALL place the new component in the existing `src/components/` directory using PascalCase filenames and a default or named export matching the filename, consistent with the existing components
6. IF integration code is added, THEN THE Frontend SHALL introduce only new files or new wrapper elements and SHALL NOT modify, delete, or rename any pre-existing source file in `src/`
7. IF a new context provider is introduced for integration, THEN THE Frontend SHALL wrap it around existing component trees without altering the props, state, or rendered output of those existing components

### Requirement 14: AI Recommendation Updates

**User Story:** As a user, I want AI recommendations to update when my cart or goals change, so that suggestions remain relevant.

#### Acceptance Criteria

1. WHEN the user adds a product to cart, THE Frontend SHALL send a POST request to the AI_Server `/api/cart/post-add-suggestion` endpoint with the added product's identifier and the current user identifier within 1 second of the add action completing
2. WHEN the AI_Server returns a successful post-add-suggestion response containing at least one suggestion, THE Frontend SHALL display up to 4 suggestion items inline beneath the added product's recommendation card in the Chat_Panel
3. WHEN the user sends a chat message, THE Frontend SHALL include the current cart contents (product identifier, name, price, quantity, and category for each item) in the request body sent to the AI_Server so that recommendations account for already-added products
4. WHEN the AI_Server returns affinity_products in the chat response, THE Frontend SHALL display up to 3 cross-sell suggestion items per product in the Live_Cart_Panel sidebar, each showing product name, price, and an add-to-cart action
5. IF the post-add-suggestion request fails or returns an empty suggestions array, THEN THE Frontend SHALL continue normal operation without displaying a suggestion card and without showing an error to the user
