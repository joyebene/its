interface Props {
  status: string;
}

export default function ProductStatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    created: "bg-gray-100 text-gray-700",

    pending: "bg-yellow-100 text-yellow-700",

    warehouse: "bg-indigo-100 text-indigo-700",

    shipping: "bg-blue-100 text-blue-700",

    customs: "bg-orange-100 text-orange-700",

    payment_cleared: "bg-green-100 text-green-700",

    delivered: "bg-emerald-100 text-emerald-700",

    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}