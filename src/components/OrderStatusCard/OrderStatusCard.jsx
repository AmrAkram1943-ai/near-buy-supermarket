export default function OrderStatusCard({ accepted, rejected }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 rounded-2xl bg-green-400 p-4 text-center text-white">
          <p className="text-sm font-medium">Accepted Orders</p>
          <h2 className="mt-2 text-3xl font-bold">{accepted}</h2>
        </div>

        <div className="flex-1 rounded-2xl bg-red-400 p-4 text-center text-white">
          <p className="text-sm font-medium">Rejected Orders</p>
          <h2 className="mt-2 text-3xl font-bold">{rejected}</h2>
        </div>
      </div>
    </div>
  );
}