// import { useState, useEffect } from "react";
// import Layout from "../Layout/Layout";
// import OrderCard from "../OrderCard/OrderCard";
// import OrderStatusCard from "../OrderStatusCard/OrderStatusCard";
// import StatCard from "../StatCard/StatCard";
// import { supabase } from "../../lib/supabase";
// import OrderDetailsModal from "../OrderDetailsModal/OrderDetailsModal";
// import toast from "react-hot-toast";

// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [acceptedCount, setAcceptedCount] = useState(0);
//   const [rejectedCount, setRejectedCount] = useState(0);
// const supermarket = JSON.parse(
//   localStorage.getItem("supermarket")
// );
//   useEffect(() => {
//     const supermarket = JSON.parse(
//       localStorage.getItem("supermarket")
//     );

//     const fetchOrders = async () => {
//       setLoading(true);

//       const { data, error } = await supabase
// .from("orders")
// .select("*")
// .order("created_at", { ascending: false })

//       if (error) {
//         console.log("Fetch orders error:", error.message);
//         setLoading(false);
//         return;
//       }

//       setOrders(data || []);
//       setLoading(false);
//     };

//     const fetchStats = async () => {
//       const { data, error } = await supabase
//   .from("orders")
//   .select("*")
//   .eq("governorate", supermarket?.governorate)
//   .order("created_at", { ascending: false });
//       if (error) {
//         console.log("Stats error:", error.message);
//         return;
//       }

//       const accepted =
//         data?.filter(
//           (r) =>
//             r.status === "accepted" ||
//             r.status === "partially_accepted"
//         ).length || 0;

//       const rejected =
//         data?.filter(
//           (r) => r.status === "declined"
//         ).length || 0;

//       setAcceptedCount(accepted);
//       setRejectedCount(rejected);
//     };

//     fetchOrders();
//     fetchStats();

// const channel = supabase
//   .channel("orders-realtime-channel")

//   .on(
//     "postgres_changes",
//     {
//       event: "INSERT",
//       schema: "public",
//       table: "orders",
//     },
//     (payload) => {
//       setOrders((prevOrders) => [
//         payload.new,
//         ...prevOrders,
//       ]);

//       toast.success("New order received!");
//     }
//   )

//   .on(
//     "postgres_changes",
//     {
//       event: "UPDATE",
//       schema: "public",
//       table: "orders",
//     },
//     async (payload) => {
//       if (!payload.new.selected_response_id) return;

//       const supermarket = JSON.parse(
//         localStorage.getItem("supermarket")
//       );

//       const { data } = await supabase
//         .from("order_responses")
//         .select("id")
//         .eq("supermarket_id", supermarket.id);

//       const myResponseIds =
//         data?.map((r) => r.id) || [];

//       if (
//         myResponseIds.includes(
//           payload.new.selected_response_id
//         )
//       ) {
//         toast.success(
//           "Your offer was accepted ✅"
//         );
//       }
//     }
//   )

//   .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   return (
//     <Layout>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Live Orders Feed
//         </h1>

//         <p className="mt-1 text-gray-500">
//           Realtime customer orders in your governorate.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//         <div className="space-y-6 xl:col-span-2">
//           {loading ? (
//             <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
//               <p className="text-gray-500">
//                 Loading orders...
//               </p>
//             </div>
//           ) : orders.length === 0 ? (
//             <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
//               <p className="text-gray-500">
//                 No orders available.
//               </p>
//             </div>
//           ) : (
//             orders.map((order) => (
//               <OrderCard
//                 key={order.id}
//                 order={order}
//                 onClick={() => setSelectedOrder(order)}
//               />
//             ))
//           )}
//         </div>

//         <div className="space-y-6">
//           <OrderStatusCard
//             accepted={acceptedCount}
//             rejected={rejectedCount}
//           />

//           <StatCard
//             title="Total Orders"
//             value={orders.length}
//           />

//           <StatCard
//             title="Governorate"
//             value={
//               supermarket?.governorate || "Unknown"
//             }
//           />
//         </div>
//       </div>

//       {selectedOrder && (
//         <OrderDetailsModal
//           order={selectedOrder}
//           onClose={() => setSelectedOrder(null)}
//         />
//       )}
//     </Layout>
//   );
// }


import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import OrderCard from "../OrderCard/OrderCard";
import OrderStatusCard from "../OrderStatusCard/OrderStatusCard";
import StatCard from "../StatCard/StatCard";
import { supabase } from "../../lib/supabase";
import OrderDetailsModal from "../OrderDetailsModal/OrderDetailsModal";
import toast from "react-hot-toast";

export default function Dashboard() {
const [orders, setOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);

const [loading, setLoading] = useState(true);

const [acceptedCount, setAcceptedCount] = useState(0);
const [rejectedCount, setRejectedCount] = useState(0);

const supermarket = JSON.parse(
  localStorage.getItem("supermarket") || "{}"

);

useEffect(() => {
const fetchOrders = async () => {
setLoading(true);


  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("governorate", supermarket?.governorate)
    .order("created_at", { ascending: false });


  if (error) {
    console.log("Fetch orders error:", error.message);
    setLoading(false);
    return;
  }

  setOrders(data || []);
  setLoading(false);
};

const fetchStats = async () => {
  const { data, error } = await supabase
    .from("order_responses")
    .select("status")
    .eq("supermarket_id", supermarket?.id);

  if (error) {
    console.log("Stats error:", error.message);
    return;
  }

  const accepted =
    data?.filter(
      (r) =>
        r.status === "accepted" ||
        r.status === "partially_accepted"
    ).length || 0;

  const rejected =
    data?.filter(
      (r) => r.status === "declined"
    ).length || 0;

  setAcceptedCount(accepted);
  setRejectedCount(rejected);
};

fetchOrders();
fetchStats();

const channel = supabase
  .channel("orders-realtime-channel")

  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "orders",
    },
    (payload) => {
      if (
        payload.new.governorate !==
        supermarket?.governorate
      ) {
        return;
      }

      setOrders((prevOrders) => [
        payload.new,
        ...prevOrders,
      ]);

      toast.success("New order received!");
    }
  )

  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "orders",
    },
    async (payload) => {
      if (!payload.new.selected_response_id) return;

      if (
        payload.old.selected_response_id ===
        payload.new.selected_response_id
      ) {
        return;
      }

      const { data } = await supabase
        .from("order_responses")
        .select("id")
        .eq("supermarket_id", supermarket.id);

      const myResponseIds =
        data?.map((r) => r.id) || [];

      if (
        myResponseIds.includes(
          payload.new.selected_response_id
        )
      ) {
        toast.success(
          "Your offer was accepted ✅"
        );
      }
    }
  )

  .subscribe();

return () => {
  supabase.removeChannel(channel);
};

}, []);

return ( <Layout> <div className="mb-6"> <h1 className="text-3xl font-bold text-gray-900">
Live Orders Feed </h1>

    <p className="mt-1 text-gray-500">
      Realtime customer orders in your governorate.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
    <div className="space-y-6 xl:col-span-2">
      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">
            No orders available.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => setSelectedOrder(order)}
          />
        ))
      )}
    </div>

    <div className="space-y-6">
      <OrderStatusCard
        accepted={acceptedCount}
        rejected={rejectedCount}
      />

      <StatCard
        title="Total Orders"
        value={orders.length}
      />

      <StatCard
        title="Governorate"
        value={
          supermarket?.governorate || "Unknown"
        }
      />
    </div>
  </div>

  {selectedOrder && (
    <OrderDetailsModal
      order={selectedOrder}
      onClose={() => setSelectedOrder(null)}
    />
  )}
</Layout>

);
}
