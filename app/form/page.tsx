"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CarFront, CreditCard, AlertCircle, Clock } from "lucide-react";
import Map, { ParkingSpot } from "@/components/Map";
import { useRouter } from "next/navigation";
import { getParkingSpots, createBooking } from "@/app/actions/booking";

export default function BookingFormPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [plate, setPlate] = useState("");
  const [duration, setDuration] = useState(2);
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    getParkingSpots().then(data => {
      const formattedSpots = data.map(s => ({
        id: s.id,
        location: { lat: s.lat, lng: s.lng, address: s.address },
        status: s.status as 'available' | 'booked',
        price: s.price,
      }));
      setSpots(formattedSpots);
    });
  }, []);

  const handleBook = async () => {
    if (!selectedSpot) {
      setErrorMsg("الرجاء اختيار موقف من الخريطة");
      return;
    }
    if (selectedSpot.status === 'booked') {
      setErrorMsg("هذا الموقف محجوز حاليا، يرجى اختيار موقف متاح");
      return;
    }
    if (!date) {
      setErrorMsg("الرجاء اختيار تاريخ الحجز");
      return;
    }
    if (!plate.trim()) {
      setErrorMsg("الرجاء إدخال رقم لوحة السيارة");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    
    const result = await createBooking(selectedSpot.id, duration, plate);

    if (result.error) {
       setErrorMsg(result.error);
       setIsSubmitting(false);
       getParkingSpots().then(data => {
         setSpots(data.map(s => ({
           id: s.id, location: { lat: s.lat, lng: s.lng, address: s.address },
           status: s.status as 'available' | 'booked', price: s.price,
         })));
       });
    } else {
       router.push(`/ticket?bookingId=${result.bookingId}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">أكمل بيانات الحجز</h1>
          <p className="text-slate-600 dark:text-slate-400">حدد الموقف من الخريطة وقم بملء البيانات لتأكيد حجزك مسبقاً</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col"
          >
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">الخريطة التفاعلية</h2>
            <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span> متاح
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span> محجوز
                </div>
            </div>
            
            <div className="flex-1 min-h-[400px] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0 flex items-center justify-center">
               {spots.length > 0 ? (
                 <Map spots={spots} onSpotSelect={(spot) => {
                   setSelectedSpot(spot);
                   setErrorMsg("");
                 }} />
               ) : (
                 <div className="flex space-x-2 animate-pulse flex-row-reverse">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animation-delay-200"></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animation-delay-400"></div>
                 </div>
               )}
            </div>

            {selectedSpot && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">الموقف المحدد</p>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedSpot.location.address}</p>
                </div>
                <span className={`px-3 py-1.5 text-xs rounded-full font-bold shadow-sm ${selectedSpot.status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'}`}>
                  {selectedSpot.status === 'available' ? 'متاح للحجز' : 'غير متاح'}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between"
          >
            <form className="space-y-6 flex flex-col h-full">
              
              <div className="space-y-6 flex-1">
                <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">تفاصيل سيارتك والحجز</h3>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">تاريخ الحجز</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrorMsg(""); }} className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100" />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">المدة المتوقعة (بالساعات)</label>
                  <div className="relative">
                    <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    <input type="number" min="1" max="24" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100" />
                  </div>
                </div>

                {/* Car Plate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">رقم اللوحة</label>
                  <div className="relative">
                    <CarFront className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    <input type="text" placeholder="مثال: ح ب ص 1234" value={plate} onChange={(e) => { setPlate(e.target.value); setErrorMsg(""); }} className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 text-right" dir="ltr" />
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-medium bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-2xl flex items-center justify-between border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-50 dark:border-indigo-900/30">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">الإجمالي المتوقع</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {selectedSpot ? selectedSpot.price * duration : 0} <span className="text-base font-medium text-slate-500">ر.س</span>
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBook}
                  disabled={isSubmitting || !selectedSpot || selectedSpot.status === 'booked'}
                  className={`w-full py-4 px-6 ${isSubmitting || !selectedSpot || selectedSpot.status === 'booked' ? 'bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed opacity-60' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/40 cursor-pointer'} text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2`}
                  type="button"
                >
                  {isSubmitting ? 'جاري تأكيد الحجز...' : 'تأكيد الحجز والدفع'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
