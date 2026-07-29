"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  Pencil,
  CreditCard,
  MapPin,
  Trash2,
} from "lucide-react";

import DeleteProductDialog from "./DeleteProductDialog";

interface Props {
  id: string;
  onDeleted?: () => void;
}

export default function ProductActions({
  id,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  async function remove() {
    try {
      setLoading(true);

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      setOpen(false);

      onDeleted?.();
    } catch (err) {
      alert("Unable to delete product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex gap-3">

        <Link href={`/products/${id}`}>
          <Eye
            size={18}
            className="cursor-pointer text-slate-500 hover:text-blue-600"
          />
        </Link>

        <Link href={`/products/${id}/edit`}>
          <Pencil
            size={18}
            className="cursor-pointer text-slate-500 hover:text-yellow-600"
          />
        </Link>

        <Link href={`/products/${id}/payment`}>
          <CreditCard
            size={18}
            className="cursor-pointer text-slate-500 hover:text-green-600"
          />
        </Link>

        <Link href={`/products/${id}/tracking`}>
          <MapPin
            size={18}
            className="cursor-pointer text-slate-500 hover:text-indigo-600"
          />
        </Link>

        <Trash2
          size={18}
          onClick={() => setOpen(true)}
          className="cursor-pointer text-red-600"
        />

      </div>

      <DeleteProductDialog
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onDelete={remove}
      />
    </>
  );
}