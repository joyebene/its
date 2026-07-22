import { LucideIcon } from "lucide-react";
import Button from "./Button";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon
          size={36}
          className="text-slate-500"
        />
      </div>

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        {description}
      </p>

      {buttonText && (
        <div className="mt-8">
          <Button onClick={onClick}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}