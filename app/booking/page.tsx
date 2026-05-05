"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Map, { ParkingSpot } from "@/components/Map";
import { CreditCard, MapPin, Calendar, Clock, CarFront, ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getParkingSpots, createBooking } from "@/app/actions/booking";

export default function BookingPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [plate, setPlate] = useState("");
  const [duration, setDuration] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    getParkingSpots().then(data => {
      const formattedSpots = data.map((s: any) => ({
        id: s.id,
        location: { lat: s.lat, lng: s.lng, address: s.address },
        status: s.status as 'available' | 'booked',
        price: s.price,
      }));
      setSpots(formattedSpots);
    });
  }, []);

  const handleBook = async () => {
    if (!selectedSpot) return;
    
    if (!plate.trim()) {
      setErrorMsg("الرجاء إدخال رقم لوحة السيارة لإتمام الحجز");
      return;
    }
    
    setErrorMsg("");
    setIsBooking(true);
    
    const result = await createBooking(selectedSpot.id, duration, plate);

    if (result.error) {
       setErrorMsg(result.error);
       setIsBooking(false);
       // Refresh spots to see if someone else took it
       getParkingSpots().then(data => {
         setSpots(data.map((s: any) => ({
           id: s.id, location: { lat: s.lat, lng: s.lng, address: s.address },
           status: s.status as 'available' | 'booked', price: s.price,
         })));
       });
    } else {
       router.push(`/ticket?bookingId=${result.bookingId}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Left map area */}
      <div className="flex-1 p-4 md:p-6 relative">
        <div className="absolute top-8 right-8 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold mb-2">تعليمات الخريطة</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span> متاح
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span> محجوز
            </div>
          </div>
        </div>
        <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative z-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
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
      </div>

      {/* Right Sidebar Booking Area */}
      <div className="w-full md:w-[450px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl relative z-10 overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تفاصيل الحجز</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">اختر موقفاً من الخريطة للبدء</p>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {selectedSpot ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">الموقف المحدد</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-bold shadow-sm ${selectedSpot.status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                    {selectedSpot.status === 'available' ? 'متاح للحجز' : 'غير متاح'}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedSpot.location.address}</h3>
              </div>

              {selectedSpot.status === 'available' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">تاريخ الحجز (اليوم)</label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                      <input type="text" readOnly value={new Date().toLocaleDateString('ar-SA')} className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">عدد الساعات</label>
                    <div className="relative">
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                      <input type="number" min="1" max="24" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full pl-4 pr-11 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">رقم اللوحة</label>
                    <div className="relative">
                      <CarFront className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                      <input type="text" placeholder="مثال: ح ب ص 1234" value={plate} onChange={(e) => { setPlate(e.target.value); setErrorMsg(""); }} dir="ltr" className={`w-full pl-4 pr-11 py-3 bg-white dark:bg-slate-950 border ${errorMsg ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 text-right`} />
                    </div>
                  </div>
                  
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-rose-600 text-sm font-medium bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/50">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4 py-12">
               <MapPin className="h-16 w-16 text-slate-200 dark:text-slate-800" />
               <p className="text-slate-500 dark:text-slate-400">يرجى اختيار موقف من الخريطة المجاورة<br/>لعرض تفاصيله وإتمام الحجز.</p>
            </div>
          )}
        </div>

        {selectedSpot && selectedSpot.status === 'available' && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
             <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-400 font-medium">الإجمالي المتوقع:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {selectedSpot.price * duration} <span className="text-sm">ر.س</span>
                </span>
             </div>
             <button
               onClick={handleBook}
               disabled={isBooking}
               className={`w-full py-4 px-6 ${isBooking ? 'bg-indigo-400 cursor-not-allowed opacity-80' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/50'} text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2`}
             >
               {isBooking ? 'جاري التأكيد...' : 'تأكيد ودفع الحجز'}
               {!isBooking && <ChevronLeft className="mr-1 h-5 w-5" />}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

