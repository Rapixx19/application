import Image from "next/image";
import Link from "next/link";

interface NavProps {
  logoPath?: string;
}

export function Nav({ logoPath }: NavProps) {
  return (
    <nav className="w-full max-w-[720px] mx-auto px-6 flex items-center justify-between py-6 mb-8">
      <div className="flex items-center gap-3">
        {logoPath ? (
          <div className="relative w-9 h-9">
            <Image
              src={logoPath}
              alt="Sentavita"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[#2d3748] flex items-center justify-center text-white text-lg font-serif">
            S
          </div>
        )}
        <span className="font-serif text-xl font-semibold text-primary">
          Sentavita
        </span>
      </div>
      <Link
        href="/admin/login"
        className="text-[0.7rem] text-muted/50 hover:text-muted transition-colors"
        title="Admin Portal"
      >
        Admin
      </Link>
    </nav>
  );
}
