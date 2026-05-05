"use client";

import { motion } from "framer-motion";
import { Clock, CreditCard, MapPin, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserBookings } from "@/app/actions/booking";
import { getUserProfile } from "@/app/actions/auth";

interface Booking {
  id: number;
  status: 'active' | 'completed' | 'cancelled';
  spot?: { id: number; address: string };
  createdAt: string;
  totalPrice: number;
  duration: number;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const u = await getUserProfile();
      setUser(u);
      
      const res = await getUserBookings();
      setBookings(res);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleCancel = async (bookingId: number) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل إلغاء الحجز');
      }

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إلغاء الحجز');
      console.error('Cancel error:', error);
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse flex items-center justify-center space-x-2 flex-row-reverse">
         <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
         <div className="w-4 h-4 bg-indigo-500 rounded-full animation-delay-200"></div>
         <div className="w-4 h-4 bg-indigo-500 rounded-full animation-delay-400"></div>
      </div>
    </div>;
  }

  const totalAmount = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalBookings = bookings.length;
  // just a dummy stat based on hours
  const hoursSaved = bookings.reduce((sum, b) => sum + (b.duration || 0), 0);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">لوحة التحكم</h1>
          <p className="text-slate-600 dark:text-slate-400">
             {user ? `مرحباً بك مجدداً يا ${user.name}، إليك نظرة عامة على نشاطك` : 'يرجى تسجيل الدخول لعرض نشاطك'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">إجمالي الحجوزات</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalBookings}</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">المدفوعات</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalAmount} ر.س</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ساعات الحجز</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{hoursSaved} ساعة</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">أحدث الحجوزات</h2>
            <div className="relative">
              <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="بحث..." className="pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">رقم الحجز</th>
                  <th className="px-6 py-4 font-medium">الموقع</th>
                  <th className="px-6 py-4 font-medium">التاريخ</th>
                  <th className="px-6 py-4 font-medium">المبلغ</th>
                  <th className="px-6 py-4 font-medium">الحالة</th>
                  <th className="px-6 py-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">#{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{booking.spot?.address}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{new Date(booking.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{booking.totalPrice} ر.س</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        booking.status === 'active' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {booking.status === 'active' ? 'نشط' : booking.status === 'completed' ? 'مكتمل' : 'ملغى'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.status === 'active' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          {cancellingId === booking.id ? 'جاري...' : 'إلغاء'}
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                       لا توجد حجوزات سابقة
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
