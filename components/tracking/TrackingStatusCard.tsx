import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface Props {
  product: any;
}

export default function TrackingStatusCard({
  product,
}: Props) {
  return (
    <Card title="Product Information">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Info
          label="Product Name"
          value={product.name}
        />

        <Info
          label="SKU"
          value={product.sku}
        />

        <Info
          label="Quantity"
          value={String(product.quantity)}
        />

        <Info
          label="Unit Price"
          value={`₦${product.unitPrice?.toLocaleString()}`}
        />

        <Info
          label="Total Price"
          value={`₦${product.totalPrice?.toLocaleString()}`}
        />

        <Info
          label="Buyer"
          value={product.buyerName || "-"}
        />

        <Info
          label="Shipment Number"
          value={product.shipmentId?.shipmentNumber || "-"}
        />

        <Info
          label="Tracking Number"
          value={product.shipmentId?.trackingNumber || "-"}
        />

        <Info
          label="Current Location"
          value={
            product.currentLocation?.address ||
            product.currentLocation?.city ||
            "Unknown"
          }
        />

        <div>
          <p className="mb-2 text-sm text-slate-500">
            Status
          </p>

          <Badge>
            {product.currentStatus
              ?.replaceAll("_", " ")
              .toUpperCase()}
          </Badge>
        </div>

        <Info
          label="Destination"
          value={[
            product.shippingAddress?.city,
            product.shippingAddress?.state,
            product.shippingAddress?.country,
          ]
            .filter(Boolean)
            .join(", ") || "-"}
        />

        <Info
          label="Last Updated"
          value={
            product.currentLocation?.updatedAt
              ? new Date(
                  product.currentLocation.updatedAt
                ).toLocaleString()
              : "-"
          }
        />
      </div>
    </Card>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium wrap-break-words">
        {value || "-"}
      </p>
    </div>
  );
}