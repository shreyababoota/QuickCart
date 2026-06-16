
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatPanel from './ChatPanel';
import LiveCartPanel from './LiveCartPanel';
import MainCartDrawer from './MainCartDrawer';
import CheckoutModal from './CheckoutModal';
import GoalSelectModal from '../GoalSelectModal';
import { useCart } from '@/context/CartContext';
import { usePlans } from '@/context/PlansContext';
import { useProducts } from '@/context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const AI_URL = import.meta.env.VITE_AI_URL;


const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm QuickCart AI 🛒 I'll help you build your cart as we chat. What are you shopping for today? You can also tell me your budget!",
  recommendations: [],
  intents: [],
  eta: null,
  urgency_required: false,
  budget_suggestions: [],
  checkout_pending: false,
};

export default function AssistantApp() {
  const { items: globalCart, addToCart, removeFromCart, updateQuantity, refreshCart } = useCart();
  const { addProductsToPlanOnly, refreshPlans } = usePlans();
  const { products: productCatalog } = useProducts();
  const navigate = useNavigate();
  
  const [messages, setMessages]           = useState([WELCOME]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(false);
  
  // Restore stagingCart to act as the AI Assistant Temporary Cart
  const [stagingCart, setStagingCart]     = useState([]);
  
  const [budget, setBudget]               = useState(null);
  const [urgency, setUrgency]             = useState(null);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [orderResult, setOrderResult]     = useState(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [showCartDrawer, setShowCartDrawer]   = useState(false);

  const [cartIntelligence, setCartIntelligence] = useState(null);
  const [inlineSuggestions, setInlineSuggestions] = useState({});
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  // Mapped global cart for MainCartDrawer
  const mappedGlobalCart = globalCart.map((i) => ({
    id: i.product.backendId || i.product.id,
    product_id: i.product.backendId || i.product.id,
    name: i.product.name,
    price: i.product.price,
    qty: i.qty,
    category: i.product.category || '',
  }));

  const globalCartTotal = mappedGlobalCart.reduce((s, i) => s + i.price * i.qty, 0);

  // Staging cart derived values for LiveCartPanel
  const stagingCartTotal = stagingCart.reduce((s, i) => s + i.price * i.qty, 0);
  const remaining    = budget ? budget - stagingCartTotal : null;
  const isOverBudget = budget && stagingCartTotal > budget;

  // ── Fetch cart intelligence whenever staging cart changes ─────────────────────────
  useEffect(() => {
    if (stagingCart.length === 0) { setCartIntelligence(null); return; }
    const controller = new AbortController();
    // fetch("/api/cart/intelligence", {
    fetch(`${AI_URL}/api/cart/intelligence`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ cart: stagingCart, userId: "U0017", budget }),
      signal:  controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setCartIntelligence(data))
      .catch((e) => { if (e.name !== "AbortError") console.error("Cart intelligence error:", e); });
    return () => controller.abort();
  }, [stagingCart, budget]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideMessage = null) => {
    const text = (overrideMessage || input).trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, recommendations: [], intents: [], eta: null, urgency_required: false, budget_suggestions: [], checkout_pending: false };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!overrideMessage) setInput('');
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(-7, -1)
        .map(({ role, content }) => ({ role, content }))
        .filter((_, idx, arr) => {
          const firstUserIdx = arr.findIndex(m => m.role === 'user');
          return idx >= firstUserIdx;
        });

      // const res = await fetch('/api/chat', {
      const res = await fetch(`${AI_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          cart: stagingCart,
          budget,
          urgency,
        }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      if (data.budget && !budget) setBudget(data.budget);
      if (data.checkout_pending) setCheckoutPending(true);

      setMessages((prev) => [
        ...prev,
        {
          role:               'assistant',
          content:            data.reply || "Here are some options for you!",
          recommendations:    data.recommendations || [],
          intents:            data.top_intents || [],
          eta:                data.eta || null,
          urgency_required:   data.urgency_required || false,
          budget_suggestions: data.budget_suggestions || [],
          checkout_pending:   data.checkout_pending || false,
          cart_total:         data.cart_total,
          remaining_budget:   data.remaining_budget,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't reach the server. Please try again.", recommendations: [], intents: [], eta: null, urgency_required: false, budget_suggestions: [], checkout_pending: false },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, stagingCart, budget, urgency]);

  // ── Cart actions ──────────────────────────────────────────────────────────
  const handleAddToCart = useCallback((item) => {
    const id = item.product_id || item.id;
    // Add to stagingCart (AI Temporary Cart)
    setStagingCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        id,
        product_id: id,
        name:     item.name || item.product_name,
        price:    item.price ?? item.product_price,
        qty:      1,
        category: item.category || '',
        image_url: item.image_url,
        brand: item.brand,
      }];
    });

    // Fetch inline suggestion for this product (like standalone)
    // fetch('/api/cart/post-add-suggestion', {
    fetch(`${AI_URL}/api/cart/post-add-suggestion`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ productId: id, userId: 'U0017' }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.suggestions && data.suggestions.length > 0) {
          setInlineSuggestions((prev) => ({ ...prev, [id]: data }));
        }
      })
      .catch((e) => console.error('Post-add suggestion error:', e));
  }, []);

  const handleUpdateStagingCart = useCallback((id, delta) => {
    setStagingCart((prev) => {
      if (delta === 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0);
    });
  }, []);

  // Final Cart Action triggers GoalSelectModal
  const handleMoveToCart = useCallback(() => {
    if (stagingCart.length === 0) return;
    setGoalModalOpen(true);
  }, [stagingCart]);

  // Resolve AI product to Flask backend numeric ID.
  // Only uses exact code/ID matching — NO name-based matching per requirement.
  const resolveToBackendId = (item) => {
    const code = String(item.product_id || item.id || '').trim();

    // Strategy 1: standard resolution (exact code match in catalog)
    if (productCatalog.length > 0 && code) {
      const codeUpper = code.toUpperCase();
      const match = productCatalog.find(
        (p) => String(p.id || '').toUpperCase() === codeUpper ||
               String(p.productCode || '').toUpperCase() === codeUpper
      );
      if (match && match.backendId) return Number(match.backendId);
    }

    // Strategy 2: normalize product codes (P0001 -> p001, P0083 -> p083, etc.)
    if (code) {
      const numMatch = code.match(/[Pp](\d+)/);
      if (numMatch) {
        const num = parseInt(numMatch[1], 10);
        const variants = [
          `p${String(num).padStart(3, '0')}`,
          `p${String(num).padStart(4, '0')}`,
          `p${num}`,
          `p${String(num).padStart(2, '0')}`,
        ];
        for (const variant of variants) {
          const match = productCatalog.find(
            (p) => String(p.id || '').toLowerCase() === variant ||
                   String(p.productCode || '').toLowerCase() === variant
          );
          if (match && match.backendId) return Number(match.backendId);
        }
      }
    }

    // Strategy 3: if the code itself is a valid positive integer, use directly
    const numericCode = Number(code);
    if (Number.isInteger(numericCode) && numericCode > 0) {
      return numericCode;
    }

    return null;
  };

  const handleGoalSelect = async (goalId, flowType) => {
    try {
      const targetGoalId = goalId === 'general' ? null : goalId;

      // Resolve all staging items to backend IDs
      const resolved = stagingCart.map((item) => ({
        ...item,
        backendId: resolveToBackendId(item),
      }));

      const resolvable = resolved.filter((item) => item.backendId);
      const unresolvable = resolved.filter((item) => !item.backendId);

      if (unresolvable.length > 0) {
        console.warn('Could not resolve these AI products to backend IDs:', unresolvable.map(i => i.name));
      }

      if (flowType === 'plan-only') {
        // For plan-only: add all products (resolved ones via backendId, unresolved with raw data)
        const productsToAdd = resolved.map((item) => ({
          id: item.id,
          productCode: item.product_id || item.id,
          product_id: item.product_id || item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          brand: item.brand,
          backendId: item.backendId,
        }));

        await addProductsToPlanOnly(goalId, productsToAdd);
        await refreshPlans();
        setStagingCart([]);
        setGoalModalOpen(false);
        toast.success(`${productsToAdd.length} items added to plan`);
        navigate(`/plans/${goalId}`);
        return;
      }

      // For cart: add items with resolved IDs directly via addToCart
      let addedCount = 0;

      for (const item of resolvable) {
        const productData = {
          id: item.id,
          productCode: item.product_id || item.id,
          product_id: item.product_id || item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          brand: item.brand,
          backendId: item.backendId,
        };
        for (let i = 0; i < item.qty; i++) {
          const ok = await addToCart(productData, targetGoalId);
          if (ok) addedCount += 1;
        }
      }

      // Unresolvable items are excluded — do NOT push them to cart.
      // Only valid backend products should enter the cart.
      if (unresolvable.length > 0) {
        console.warn('Skipped unresolvable items (no valid backend product):', unresolvable.map(i => i.name));
      }

      if (addedCount === 0) {
        toast.error('Could not add items — products not found in store catalog.');
        return;
      }

      toast.success(`${addedCount} item${addedCount > 1 ? 's' : ''} added to cart`);
      await refreshCart();
      await refreshPlans();
      window.dispatchEvent(new Event('cart:refresh'));

      setStagingCart([]);
      setGoalModalOpen(false);
      navigate('/cart');
    } catch (error) {
      console.error('Failed to move to final cart:', error);
      toast.error(error.message || 'Failed to add items to cart');
    }
  };

  const handleApplyReplacement = useCallback((original, replacement) => {
    setStagingCart((prev) => {
      const existing = prev.find((i) => i.id === original.product_id);
      if (!existing) return prev;
      return prev.map((i) =>
        i.id === original.product_id
          ? { id: replacement.product_id, name: replacement.name, price: replacement.price, qty: i.qty, category: replacement.category || i.category, image_url: replacement.image_url, brand: replacement.brand }
          : i
      );
    });

    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: `Done! Replaced "${original.name}" with "${replacement.name}" and saved ₹${(original.price - replacement.price).toFixed(0)}. Your updated cart total is ₹${(stagingCart.reduce((s,i) => s + i.price * i.qty, 0) - (original.price - replacement.price)).toFixed(0)}.`,
      recommendations: [],
      intents: [],
      eta: null,
      urgency_required: false,
      budget_suggestions: [],
      checkout_pending: false,
    }]);
  }, [stagingCart]);

  const handleUrgency = (val) => {
    setUrgency(val);
    sendMessage(`My urgency: ${val}`);
  };

  const handleOpenCartDrawer = () => setShowCartDrawer(true);

  // Modify checkout to use global cart
  const handleCheckout = async () => {
    if (mappedGlobalCart.length === 0) return;
    setShowCartDrawer(false);
    setCheckoutModal(true);
  };

  const handleConfirmOrder = async () => {
    // Integrate with order flow if needed
  };

  const handleSetBudget = (val) => {
    if (val === null) {
      setBudget(null);
      return;
    }
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setBudget(n);
      sendMessage(`My budget is ₹${n}`);
    }
  };

  // Create a dummy product representation of the staging cart for the modal
  const stagingCartTotalItems = stagingCart.reduce((s, i) => s + i.qty, 0);
  const stagingCartDummyProduct = {
    name: `${stagingCartTotalItems} selected items from AI Assistant`
  };

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center p-4">
      <div
        className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex"
        style={{ maxWidth: '1100px', height: '100%' }}
      >
        <ChatPanel
          messages={messages}
          input={input}
          loading={loading}
          urgency={urgency}
          onInputChange={setInput}
          onSend={sendMessage}
          onAddToCart={handleAddToCart}
          onUrgency={handleUrgency}
          onSetBudget={handleSetBudget}
          onApplyReplacement={handleApplyReplacement}
          onOpenCartDrawer={handleOpenCartDrawer}
          cart={stagingCart}
          stagingCart={stagingCart}
          onMoveToCart={handleMoveToCart}
          budget={budget}
          inlineSuggestions={inlineSuggestions}
          onDismissInline={(id) => setInlineSuggestions((prev) => { const n = { ...prev }; delete n[id]; return n; })}
        />

        <LiveCartPanel
          cart={stagingCart}
          cartTotal={stagingCartTotal}
          budget={budget}
          remaining={remaining}
          isOverBudget={isOverBudget}
          onUpdateCart={handleUpdateStagingCart}
          onAddToCart={handleAddToCart}
          onMoveToCart={handleMoveToCart}
          onSetBudget={handleSetBudget}
          checkoutPending={checkoutPending}
          intelligence={cartIntelligence}
          inlineSuggestions={inlineSuggestions}
          onDismissInline={(id) => setInlineSuggestions((prev) => { const n = { ...prev }; delete n[id]; return n; })}
        />
      </div>

      {showCartDrawer && (
        <MainCartDrawer
          cart={mappedGlobalCart}
          cartTotal={globalCartTotal}
          budget={budget}
          remaining={budget ? budget - globalCartTotal : null}
          isOverBudget={budget && globalCartTotal > budget}
          onUpdateCart={async (id, delta) => {
            const item = globalCart.find(i => (i.product.backendId || i.product.id) === id);
            if (!item) return;
            if (delta === 0) await removeFromCart(item.id);
            else {
              const newQty = item.qty + delta;
              if (newQty <= 0) await removeFromCart(item.id);
              else await updateQuantity(item.id, newQty);
            }
          }}
          onCheckout={handleCheckout}
          onClose={() => setShowCartDrawer(false)}
        />
      )}

      {checkoutModal && (
        <CheckoutModal
          cart={mappedGlobalCart}
          budget={budget}
          cartTotal={globalCartTotal}
          orderResult={orderResult}
          onConfirm={handleConfirmOrder}
          onClose={() => { setCheckoutModal(false); setOrderResult(null); }}
          onAddMore={() => { setCheckoutModal(false); sendMessage("I want to add more items"); }}
          onReplace={() => { setCheckoutModal(false); sendMessage("I want to replace some expensive items with cheaper ones"); }}
        />
      )}

      {goalModalOpen && (
        <GoalSelectModal
          product={stagingCartDummyProduct}
          onClose={() => setGoalModalOpen(false)}
          onSelect={handleGoalSelect}
        />
      )}
    </div>
  );
}

