import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 mt-auto backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-lg text-slate-900 dark:text-white">نقطة رُكن</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              نظام متطور لحجز مواقف السيارات مسبقاً بكل سهولة وأمان. لا داعي للقلق بشأن إيجاد موقف بعد اليوم.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">الرئيسية</Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">من نحن</Link>
              </li>
              <li>
                <Link href="/form" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">احجز موقفك</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="text-slate-500 dark:text-slate-400 text-sm">support@nuqtarukn.com</li>
              <li className="text-slate-500 dark:text-slate-400 text-sm">+966 50 123 4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} نقطة رُكن. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
