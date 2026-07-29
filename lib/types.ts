export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  WAREHOUSE = "WAREHOUSE",
  LOGISTICS = "LOGISTICS",
  CUSTOMS = "CUSTOMS",
  DELIVERY = "DELIVERY",
}

export enum ShippingMethod {
  AIR = "AIR",
  SEA = "SEA",
  LAND = "LAND",
}

export enum ShipmentStatus {
  CREATED = "CREATED",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  COLLECTED = "COLLECTED",
  WAREHOUSE_RECEIVED = "WAREHOUSE_RECEIVED",
  CONSOLIDATED = "CONSOLIDATED",
  EXPORT_CLEARANCE = "EXPORT_CLEARANCE",
  IN_TRANSIT = "IN_TRANSIT",
  ARRIVED_DESTINATION = "ARRIVED_DESTINATION",
  CUSTOMS_CLEARANCE = "CUSTOMS_CLEARANCE",
  IMPORT_WAREHOUSE = "IMPORT_WAREHOUSE",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface IShipment {
  _id: string;

  shipmentNumber: string;

  product: string;

  origin: {
    city: string;
    state: string;
    country: string;
  };

  destination: {
    city: string;
    state: string;
    country: string;
  };

  shippingMethod: ShippingMethod;

  carrier?: string;

  trackingNumber: string;

  estimatedDeparture?: string;

  estimatedArrival?: string;

  actualDeparture?: string;

  actualArrival?: string;

  status: ShipmentStatus;

  createdBy: string;

  isDeleted: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface IContainer {
  _id: string;

  containerNumber: string;

  type: "20FT" | "40FT" | "LCL";

  carrier: string;

  originPort: string;

  destinationPort: string;

  expectedArrival: Date;

  status:
  | "AVAILABLE"
  | "LOADED"
  | "IN_TRANSIT"
  | "ARRIVED";

  shipmentCount: number;
}


export enum CustomsStatus {
  PENDING = "PENDING",
  UNDER_INSPECTION = "UNDER_INSPECTION",
  DUTY_PENDING = "DUTY_PENDING",
  DUTY_PAID = "DUTY_PAID",
  CLEARED = "CLEARED",
}

export interface Customs {
  _id: string;

  shipment: {
    _id: string;
    shipmentNumber?: string;
    trackingNumber: string;

    container?: {
      _id: string;
      containerNumber: string;
    };
  };

  status: CustomsStatus;

  dutyAmount: number;

  remarks?: string;

  processedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };

  createdAt: string;
}

export enum DeliveryStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export interface User {
    _id:string;

    name:string;

    email:string;

    role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "LOGISTICS"
    | "WAREHOUSE"
    | "CUSTOMS"
    | "DELIVERY";

    status:
    | "ACTIVE"
    | "INACTIVE";

    createdAt:string;
}
