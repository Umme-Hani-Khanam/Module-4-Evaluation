import { supabase } from "../config/supabase.js";

export const createTrip = async (req, res) => {
  const {
    customer_id,
    vehicle_id,
    distance_km,
    passengers,
    location,
    start_date,
    end_date,
  } = req.body;

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", vehicle_id)
    .single();

  if (!vehicle.isAvailable)
    return res.status(400).json({ message: "Vehicle not available" });

  if (passengers > vehicle.allowed_passengers)
    return res.status(400).json({ message: "Passenger limit exceeded" });

  await supabase.from("vehicles").update({ isAvailable: false }).eq("id", vehicle_id);

  await supabase.from("trips").insert([
    {
      customer_id,
      vehicle_id,
      distance_km,
      passengers,
      location,
      start_date,
      end_date,
    },
  ]);

  res.status(201).json({ message: "Trip created" });
};

export const endTrip = async (req, res) => {
  const { data: trip } = await supabase
    .from("trips")
    .select("*, vehicles(rate_per_km)")
    .eq("id", req.params.tripId)
    .single();

  const cost = trip.distance_km * trip.vehicles.rate_per_km;

  await supabase
    .from("trips")
    .update({ isCompleted: true, tripCost: cost })
    .eq("id", req.params.tripId);

  await supabase
    .from("vehicles")
    .update({ isAvailable: true })
    .eq("id", trip.vehicle_id);

  res.json({ message: "Trip ended", cost });
};
