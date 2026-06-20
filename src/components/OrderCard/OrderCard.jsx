import { calculateDistance } from "../../lib/distance";

export default function OrderCard({ order, onClick }) {
  const supermarket = JSON.parse(
    localStorage.getItem("supermarket")
  );

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

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-3xl border-2 border-green-400 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">
        Order From{" "}
        {order?.customer_name ||
          order?.customer ||
          order?.user_name ||
          "Unknown Customer"}
      </h2>

      <div className="space-y-1 text-base text-gray-600">
        {order?.items?.map((item, index) => (
          <p key={item.id || index}>
            {item.name} {item.quantity ? `x${item.quantity}` : ""}
          </p>
        ))}
      </div>

      {distance && (
        <p className="mt-3 text-sm font-semibold text-blue-600">
          Distance: {distance} km
        </p>
      )}

      <p className="mt-4 text-sm text-gray-400">
        Tap to view full order details
      </p>
    </div>
  );
}