import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { calculateDistance } from "../../lib/distance";

export default function OrderDetailsModal({ order, onClose }) {

  const [items, setItems] = useState(
    order.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      photoUrl: item.photoUrl,
      available: true,
      price: "",
    }))
  );

const supermarket = JSON.parse(
  localStorage.getItem("supermarket")
);

const supermarketId = supermarket?.id;

const distance =
  supermarket &&
  order?.user_lat &&
  order?.user_lng
    ? calculateDistance(
        supermarket.lat,
        supermarket.lng,
        order.user_lat,
        order.user_lng
      )
    : null;

  const [notes, setNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAvailabilityChange = (index) => {
    setErrorMsg("");

    const updatedItems = [...items];
    updatedItems[index].available = !updatedItems[index].available;

    if (!updatedItems[index].available) {
      updatedItems[index].price = "";
    }

    setItems(updatedItems);
  };

  const handlePriceChange = (index, value) => {
    setErrorMsg("");

    const updatedItems = [...items];
    updatedItems[index].price = value;
    setItems(updatedItems);
  };

  const handleAccept = async () => {
    setErrorMsg("");

    if (!supermarketId) {
      setErrorMsg("No supermarket logged in");
      return;
    }

    const hasAvailableItem = items.some((item) => item.available);

    if (!hasAvailableItem) {
      setErrorMsg(
        "You must mark at least one item as available, or decline the order."
      );
      return;
    }

    const availableItemWithoutPrice = items.find(
      (item) => item.available && (!item.price || Number(item.price) <= 0)
    );

    if (availableItemWithoutPrice) {
      setErrorMsg(
        `Please add a valid price for ${availableItemWithoutPrice.name}, or mark it as Not Available.`
      );
      return;
    }

    if (!deliveryTime.trim()) {
      setErrorMsg("Please add estimated delivery time");
      return;
    }

    const totalPrice = items
      .filter((item) => item.available)
      .reduce((sum, item) => sum + Number(item.price), 0);

      const { data: existingResponse } = await supabase
  .from("order_responses")
  .select("id")
  .eq("order_id", order.id)
  .eq("supermarket_id", supermarketId)
  .maybeSingle();

if (existingResponse) {
  setErrorMsg("You already responded to this order.");
  return;
}

    const hasUnavailableItems = items.some((item) => !item.available);

    const { error } = await supabase.from("order_responses").insert({
      order_id: order.id,
      supermarket_id: supermarketId,
      status: hasUnavailableItems ? "partially_accepted" : "accepted",
      response_items: items,
      total_price: totalPrice,
      estimated_delivery_time: deliveryTime,
      notes,
    });

    if (error) {
      setErrorMsg(error.message);
      console.log("Accept Error:", error.message);
      return;
    }

    console.log("Response saved successfully");
    onClose();
  };

  const handleDecline = async () => {
    setErrorMsg("");

    if (!supermarketId) {
      setErrorMsg("No supermarket logged in");
      return;
    }


    const { data: existingResponse } = await supabase
  .from("order_responses")
  .select("id")
  .eq("order_id", order.id)
  .eq("supermarket_id", supermarketId)
  .maybeSingle();

if (existingResponse) {
  setErrorMsg("You already responded to this order.");
  return;
}
    const { error } = await supabase.from("order_responses").insert({
      order_id: order.id,
      supermarket_id: supermarketId,
      status: "declined",
      response_items: null,
      total_price: null,
      estimated_delivery_time: null,
      notes,
    });

    if (error) {
      setErrorMsg(error.message);
      console.log("Decline Error:", error.message);
      return;
    }

    console.log("Decline response saved successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
Order From{" "}
        {order?.customer_name ||
          order?.customer ||
          order?.user_name ||
          "Unknown Customer"}
      </h2>

{distance && (
  <p className="mt-1 text-sm font-medium text-blue-600">
     Distance: {distance} km
  </p>
)}
            <p className="text-sm text-gray-500">
              Set prices and availability
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200"
          >
            X
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 p-4 md:grid-cols-3 md:items-center"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.photoUrl || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl border object-cover"
                />

                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>

                  {item.quantity && (
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAvailabilityChange(index)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  item.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.available ? "Available" : "Not Available"}
              </button>

              <input
                type="number"
                placeholder="Price"
                value={item.price}
                disabled={!item.available}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-green-400 disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Estimated delivery time, e.g. 30-45 mins"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="mt-5 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-green-400"
        />

        <textarea
          placeholder="Notes for customer..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-5 h-24 w-full resize-none rounded-2xl border border-gray-300 p-4 outline-none focus:border-green-400"
        />

        {errorMsg && (
          <p className="mt-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">
            {errorMsg}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAccept}
            className="flex-1 rounded-2xl bg-green-500 py-3 font-bold text-white hover:bg-green-600"
          >
            Accept Order
          </button>

          <button
            onClick={handleDecline}
            className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white hover:bg-red-600"
          >
            Decline Order
          </button>
        </div>
      </div>
    </div>
  );
}