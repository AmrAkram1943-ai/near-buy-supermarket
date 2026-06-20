export default function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}