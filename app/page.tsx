"use client";

import Map from '@/components/Map'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, CreditCard, ChevronLeft } from 'lucide-react'

const mockSpots = [
  { id: 1, location: { lat: 25.8696, lng: 43.4975, address: 'الرس' }, status: 'available' as const, price: 5 },
  { id: 2, location: { lat: 25.8694, lng: 43.4972, address: 'الرس' }, status: 'booked' as const, price: 5 },
]

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-slate-900/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Parking Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            نقطة رُكن - دليلك لموقف مضمون!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10"
          >
            تطبيق يتيح لك حجز مواقف سيارات مسبقاً من خلال الخريطة التفاعلية. ادفع بسهولة، وفر وقتك، وتجنب زحمة البحث عن موقف.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/booking" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/50">
              احجز موقفك الآن
              <ChevronLeft className="mr-2 h-5 w-5" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-indigo-100 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all">
              اكتشف المزيد
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">لماذا تختار نقطة رُكن؟</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">صممنا نظامنا لتوفير أقصى درجات الراحة والأمان لك لضمان تجربة سلسة من البداية للنهاية.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all">
              <div className="h-14 w-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">خريطة تفاعلية</h3>
              <p className="text-slate-600 dark:text-slate-400">اختر الموقف الأقرب لوجهتك من خلال خريطة توضح المواقف المتاحة والمشغولة في الوقت الفعلي.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all">
              <div className="h-14 w-14 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">حجز آمن بالباركود</h3>
              <p className="text-slate-600 dark:text-slate-400">احصل على باركود فريد لتأكيد حجزك، لتضمن أن موقفك محفوظ لك وحدك بكل أمان.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all">
              <div className="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">دفع إلكتروني ميسر</h3>
              <p className="text-slate-600 dark:text-slate-400">ادفع قيمة الموقف عبر بوابات دفع آمنة وموثوقة، وتجنب التعامل النقدي كلياً.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">استكشف المواقف المتاحة</h2>
              <p className="text-slate-600 dark:text-slate-400">ابحث عن الموقف المناسب لك قبل الانطلاق</p>
            </div>
            <Link href="/booking" className="mt-4 md:mt-0 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-indigo-600 dark:text-indigo-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              عرض جميع المواقف
            </Link>
          </div>
          
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-xl border border-slate-200 dark:border-slate-800 relative group min-h-[500px]">
             {/* Map Component Container */}
             <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative z-10 flex flex-col">
               <Map spots={mockSpots} />
             </div>
             
             {/* Decorative Glow */}
             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-1000 blur-md -z-10" />
          </div>
        </div>
      </section>
    </div>
  )
}
