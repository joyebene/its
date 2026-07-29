"use client";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteProductDialog({
  open,
  loading,
  onClose,
  onDelete,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <h2 className="text-xl font-bold">
          Delete Product
        </h2>

        <p className="mt-3 text-slate-500">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onDelete}
            className="rounded-lg bg-red-600 px-5 py-2 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}