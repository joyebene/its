import Link from "next/link";
import { ShipWheel } from "lucide-react";

export default function Logo() {
    return (
        <Link
            href="/dashboard"
            className="flex items-center gap-3"
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                <ShipWheel size={22} />
            </div>

            <div>
                <h1 className="text-lg font-bold text-slate-900">
                    CargoXpress
                </h1>

                <p className="text-xs text-slate-500">
                    Logistics Platform
                </p>
            </div>
        </Link>
    );
}