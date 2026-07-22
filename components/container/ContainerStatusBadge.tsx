interface Props {
  status:
    | "AVAILABLE"
    | "LOADED"
    | "IN_TRANSIT"
    | "ARRIVED";
}

const styles = {
  AVAILABLE:
    "bg-green-100 text-green-700",

  LOADED:
    "bg-blue-100 text-blue-700",

  IN_TRANSIT:
    "bg-yellow-100 text-yellow-700",

  ARRIVED:
    "bg-purple-100 text-purple-700",
};

export default function ContainerStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}