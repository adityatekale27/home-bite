const RecentOrdersTable = () => {
  const orders = [
    { id: "#1001", customer: "Aarav Mehta", meal: "Paneer Tikka Thali", status: "Pending", amount: "$12.00", statusColor: "bg-yellow-100 text-yellow-700" },
    { id: "#1000", customer: "Sneha Patel", meal: "Veg Biryani", status: "Delivered", amount: "$10.00", statusColor: "bg-green-100 text-green-700" },
    { id: "#999", customer: "Rahul Sharma", meal: "Chapati Combo", status: "Cancelled", amount: "$8.00", statusColor: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Recent Orders</h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full bg-white">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold rounded-tl-xl">Order ID</th>
              <th className="py-4 px-6 text-left text-sm font-semibold">Customer</th>
              <th className="py-4 px-6 text-left text-sm font-semibold">Meal</th>
              <th className="py-4 px-6 text-left text-sm font-semibold">Status</th>
              <th className="py-4 px-6 text-left text-sm font-semibold rounded-tr-xl">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out ${index === orders.length - 1 ? "border-b-0" : ""}`}>
                <td className="py-4 px-6 text-gray-700 font-medium">{order.id}</td>
                <td className="py-4 px-6 text-gray-600">{order.customer}</td>
                <td className="py-4 px-6 text-gray-600">{order.meal}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.statusColor}`}>{order.status}</span>
                </td>
                <td className="py-4 px-6 text-gray-700 font-medium">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
