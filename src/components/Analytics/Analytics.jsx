import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import StatCard from "../StatCard/StatCard";
import { supabase } from "../../lib/supabase";

export default function Analytics() {
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [acceptanceRate, setAcceptanceRate] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const supermarket = JSON.parse(
        localStorage.getItem("supermarket")
      );

      const { data, error } = await supabase
        .from("order_responses")
        .select("status,total_price")
        .eq("supermarket_id", supermarket.id);

      if (error) {
        console.log(error.message);
        return;
      }

      const acceptedCount =
        data?.filter(
          (r) =>
            r.status === "accepted" ||
            r.status === "partially_accepted"
        ).length || 0;

      const rejectedCount =
        data?.filter(
          (r) => r.status === "declined"
        ).length || 0;

      const totalRevenue =
        data
          ?.filter(
            (r) =>
              r.status === "accepted" ||
              r.status === "partially_accepted"
          )
          .reduce(
            (sum, r) => sum + Number(r.total_price || 0),
            0
          ) || 0;

      const totalResponses = data?.length || 0;

      const rate =
        totalResponses > 0
          ? Math.round(
              (acceptedCount / totalResponses) * 100
            )
          : 0;

      setAccepted(acceptedCount);
      setRejected(rejectedCount);
      setRevenue(totalRevenue);
      setAcceptanceRate(rate);
    };

    fetchAnalytics();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="text-gray-500">
          Supermarket performance overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Accepted Orders"
          value={accepted}
        />

        <StatCard
          title="Rejected Orders"
          value={rejected}
        />

        <StatCard
          title="Revenue (EGP)"
          value={revenue}
        />

        <StatCard
          title="Acceptance Rate"
          value={`${acceptanceRate}%`}
        />
      </div>
    </Layout>
  );
}