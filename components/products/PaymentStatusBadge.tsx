interface Props {
  status: string;
}

export default function PaymentStatusBadge({
  status,
}: Props) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",

    processing: "bg-blue-100 text-blue-700",

    cleared: "bg-green-100 text-green-700",

    completed: "bg-green-100 text-green-700",

    refunded: "bg-red-100 text-red-700",

    partially_refunded: "bg-orange-100 text-orange-700",

    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {(status ?? "UNKNOWN").replaceAll("_", " ")}
    </span>
  );
}