import { supabase } from "../config/supabase.js";

export const analytics = async (req, res) => {
  const customers = await supabase.from("users").select("*", { count: "exact" }).eq("role", "customer");
  const owners = await supabase.from("users").select("*", { count: "exact" }).eq("role", "owner");
  const drivers = await supabase.from("users").select("*", { count: "exact" }).eq("role", "driver");
  const vehicles = await supabase.from("vehicles").select("*", { count: "exact" });
  const trips = await supabase.from("trips").select("*", { count: "exact" });

  res.json({
    customers: customers.count,
    owners: owners.count,
    drivers: drivers.count,
    vehicles: vehicles.count,
    trips: trips.count,
  });
};
