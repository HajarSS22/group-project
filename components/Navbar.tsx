"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile, logout } from "@/app/actions/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getUserProfile().then((data) => {
      setUser(data);
    });
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/dashboard", label: "لوحة التحكم" },
    { href: "/booking", label: "احجز موقفك" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">نقطة رُكن</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  pathname === link.href
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  مرحباً، {user.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>تسجيل دخول</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-base font-medium ${
                    pathname === link.href
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-slate-200 dark:border-slate-800" />
              
              {user ? (
                <>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    مرحباً، {user.name}
                  </span>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex justify-start items-center gap-2 text-rose-600 dark:text-rose-400 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>خروج</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>تسجيل دخول</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
