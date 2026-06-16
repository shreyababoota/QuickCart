// Dummy API layer. Swap BASE_URL + uncomment the axios calls when a real
// backend is ready. For now everything resolves from local sample data so the
// UI is fully functional without a server.
import axios from "axios";
import {
  products,
  orders,
  customers,
  type Product,
  type Order,
  type Customer,
} from "@/lib/data";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://api.amacart.example/v1",
  timeout: 8000,
});

const delay = <T>(data: T, ms = 350) => new Promise<T>((res) => setTimeout(() => res(data), ms));

export const getProducts = async (): Promise<Product[]> => {
  // return (await api.get("/products")).data;
  return delay(products);
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
  // return (await api.get(`/products/${id}`)).data;
  return delay(products.find((p) => p.id === id));
};

export const getOrders = async (): Promise<Order[]> => {
  // return (await api.get("/orders")).data;
  return delay(orders);
};

export const getCustomers = async (): Promise<Customer[]> => {
  // return (await api.get("/customers")).data;
  return delay(customers);
};

export const placeOrder = async (payload: unknown): Promise<{ ok: boolean; id: string }> => {
  // return (await api.post("/orders", payload)).data;
  return delay({ ok: true, id: "ORD-" + Math.floor(1000 + Math.random() * 9000) });
};
