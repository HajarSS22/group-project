"use client";

import { motion } from "framer-motion";
import { CheckCircle2, QrCode, Star, ThumbsUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { getBookingDetails } from "@/app/actions/booking";

function TicketContent() {
  const searchParams = useSearchParams();
  const bookingIdStr = searchParams?.get('bookingId');
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (bookingIdStr) {
      getBookingDetails(Number(bookingIdStr)).then(data => {
        setBooking(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [bookingIdStr]);

  if (loading) {
    return <div className="text-slate-500 animate-pulse text-lg">جاري تحميل التذكرة...</div>;
  }

  if (!booking) {
    return <div className="text-rose-500 text-lg">عذراً، لم نتمكن من العثور على التذكرة المطلوبة.</div>;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-B${booking.id}-S${booking.spotId}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full"
    >
      {/* Ticket Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        
        <div className="bg-emerald-500 p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex justify-center items-center bg-white/20 p-3 rounded-full mb-4"
          >
            <CheckCircle2 className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-1">تم تأكيد الحجز</h2>
          <p className="text-emerald-100 opacity-90">موقفك بانتظارك، نتمنى لك رحلة آمنة</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">رقم الموقف</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">#{booking.spot?.id}</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">المبلغ المدفوع</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{booking.totalPrice} ر.س</p>
            </div>
          </div>

          <div className="mb-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">الموقع</p>
              <p className="text-lg font-medium text-slate-900 dark:text-white">{booking.spot?.address}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-widest">امسح الباركود عند الدخول</p>
            <img src={qrUrl} alt="Ticket QR" className="w-48 h-48 rounded-xl ring-4 ring-white dark:ring-slate-800 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Evaluation Section */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800"
      >
        {submitted ? (
          <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="h-8 w-8 mb-2" />
            <p className="font-medium">شكراً لتقييمك، نسعد بخدمتك دوماً!</p>
            <Link href="/dashboard" className="mt-4 inline-block px-6 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
              الذهاب للوحة التحكم
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-slate-800 dark:text-slate-200 font-bold mb-4">ما مدى رضاك عن تجربتك اليوم؟</p>
            <div className="flex justify-center gap-2 mb-6" dir="ltr">
              {[1, 2, 3, 4, 5].reverse().map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`h-8 w-8 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-slate-200 dark:text-slate-700"
                    }`} 
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
                <motion.button 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  إرسال التقييم
                </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function TicketPage() {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 px-4 flex flex-col items-center justify-center min-h-[80vh]">
      <Suspense fallback={<div className="text-slate-500 animate-pulse text-lg">تحميل الصفحة...</div>}>
         <TicketContent />
      </Suspense>
    </div>
  );
}
