import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export interface TableColumn<T> {
    key: keyof T | string;
    title: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { _id: string }> {
    columns: TableColumn<T>[];
    data: T[];
    resource: string;
    emptyMessage?: string;
    showView?: boolean;
    showEdit?: boolean;
    onDelete?: (row: T) => void;
}

export default function DataTable<T extends { _id: string }>({
    columns,
    data,
    resource,
    emptyMessage = "No records found.",
    showView = true,
    showEdit = true,
    onDelete,
}: DataTableProps<T>) {
    const hasActions = showView || showEdit || !!onDelete;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                                >
                                    {column.title}
                                </th>
                            ))}

                            {hasActions && (
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>

                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (hasActions ? 1 : 0)}
                                    className="py-10 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row._id}
                                    className="border-t border-slate-100 hover:bg-slate-50"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className="px-6 py-4 text-sm"
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : String(row[column.key as keyof T] ?? "-")}
                                        </td>
                                    ))}

                                    {hasActions && (
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">

                                                {showView && (
                                                    <Link
                                                        href={`/${resource}/${row._id}`}
                                                        className="rounded-lg p-2 hover:bg-slate-100"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                )}

                                                {showEdit && (
                                                    <Link
                                                        href={`/${resource}/${row._id}/edit`}
                                                        className="rounded-lg p-2 hover:bg-slate-100"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                )}

                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}

                    </tbody>

                </table>
            </div>
        </div>
    );
}