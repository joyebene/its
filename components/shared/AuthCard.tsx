import { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function AuthCard({
    title,
    subtitle,
    children,
}: AuthCardProps) {
    return (
        <div className="min-h-screen bg-[#F5F7FC] grid lg:grid-cols-2">

            {/* Left Panel */}
            <div
                className="hidden lg:flex flex-col justify-center relative bg-cover bg-center text-white p-20"
                style={{
                    backgroundImage: `
      linear-gradient(
        rgba(54, 88, 212, 0.85),
        rgba(74, 94, 235, 0.85),
        rgba(110, 94, 247, 0.85)
      ),
      url('/auth-img.webp')
    `,
                }}
            >

                <h1 className="text-5xl font-bold mb-6">
                    CARGO XPRESS
                </h1>

                <p className="max-w-md text-lg text-blue-100 leading-8">
                    Build, manage and grow your business with a
                    modern dashboard designed for productivity.
                </p>

            </div>

            {/* Right Panel */}
            <div className="flex items-center justify-center p-8">

                <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-xl">

                    <h2 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h2>

                    <p className="mt-2 text-gray-500 mb-8">
                        {subtitle}
                    </p>

                    {children}

                </div>

            </div>

        </div>
    );
}