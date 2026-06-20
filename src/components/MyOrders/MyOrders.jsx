import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { supabase } from "../../lib/supabase";
import { calculateDistance } from "../../lib/distance";

export default function MyOrders() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      setErrorMsg("");

      const supermarket = JSON.parse(localStorage.getItem("supermarket"));

      if (!supermarket?.id) {
        setErrorMsg("No supermarket logged in");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("order_responses")
.select(`
    *,
    orders:orders!order_responses_order_id_fkey (
      *
    )
  `)
        .eq("supermarket_id", supermarket.id)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      setResponses(data || []);
      setLoading(false);
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-600">Loading my orders...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 text-gray-500">
          Orders that your supermarket has already responded to.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-2xl bg-red-100 p-4 text-red-700">
          {errorMsg}
        </div>
      )}

      {!errorMsg && responses.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">No responded orders yet.</p>
        </div>
      )}

      <div className="space-y-5">
        {responses.map((response) => {
          const order = response.orders;
          const supermarket = JSON.parse(
  localStorage.getItem("supermarket") || "{}"
);

const distance =
  supermarket?.lat &&
  supermarket?.lng &&
  order?.user_lat &&
  order?.user_lng
    ? calculateDistance(
        supermarket.lat,
        supermarket.lng,
        order.user_lat,
        order.user_lng
      )
    : null;

          console.log("ORDER:", order);
  console.log(
    "selected_response_id:",
    order?.selected_response_id
  );
  console.log(
    "response.id:",
    response.id
  );

          return (
            <div
              key={response.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    
Order From {order?.customer_name || order?.customer || order?.user_name || "Unknown Customer"} 

</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Response status:{" "}
                    <span
                      className={`font-semibold ${
                        response.status === "accepted"
                          ? "text-green-600"
                          : response.status === "partially_accepted"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {response.status}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Total: {response.total_price ?? 0} EGP
                </div>
                {response.estimated_delivery_time && (
                  <p className="mt-2 text-sm text-gray-500">
                    Delivery time: {response.estimated_delivery_time}</p>)}
              </div>

              {response.response_items && (
                <div className="space-y-3">
                  {response.response_items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex flex-col justify-between gap-2 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>

                        {item.quantity && (
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.available ? "Available" : "Not Available"}
                        </span>

                        <span className="font-semibold text-gray-900">
                          {item.available ? `${item.price || 0} EGP` : "-"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

{response.notes && (
  <div className="mt-4 rounded-2xl bg-gray-50 p-4">
    <p className="text-sm font-semibold text-gray-700">
      Notes
    </p>

    <p className="mt-1 text-gray-600">
      {response.notes}
    </p>
  </div>
)}

{order?.selected_response_id === response.id && (
  <>
    <div className="mt-4 rounded-2xl bg-green-100 p-4 text-center font-bold text-green-700">
      Your offer was accepted ✅
    </div>

    {order?.customer_phone && (
      <div className="mt-4 rounded-2xl bg-blue-50 p-4">
        <p className="font-semibold text-blue-700">
          Customer Contact
        </p>

        <p className="mt-2 text-gray-700">
          📞 {order.customer_phone}
        </p>

        <a
          href={`tel:${order.customer_phone}`}
          className="mt-3 inline-block rounded-xl bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Call Customer
        </a>
      </div>
    )}
  </>
)}
{distance && (
  <div className="mt-4 rounded-2xl bg-blue-50 p-3">
    <p className="font-medium text-blue-700">
      Customer Distance: {distance} km
    </p>
  </div>
)}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}