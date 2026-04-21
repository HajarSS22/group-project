'use client'

import { motion } from 'framer-motion'

export interface ParkingSpot {
  id: number
  location: { lat: number; lng: number; address: string }
  status: 'available' | 'booked'
  price: number
}

interface MapProps {
  spots: ParkingSpot[]
  onSpotSelect?: (spot: ParkingSpot) => void
}

export default function Map({ spots, onSpotSelect }: MapProps) {
  return (
    <div className="w-full h-full min-h-[400px] p-6 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {spots.map((spot, idx) => (
          <motion.div
            key={spot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              if (onSpotSelect && spot.status === 'available') {
                onSpotSelect(spot)
              }
            }}
            className={`
              relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-sm h-32
              ${
                spot.status === 'available'
                  ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20 hover:border-emerald-500 hover:shadow-md'
                  : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 cursor-not-allowed opacity-75'
              }
            `}
          >
            <div className="font-black text-2xl text-slate-700 dark:text-slate-200 mb-1">
              موقف {spot.id}
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full ${spot.status === 'available' ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100' : 'bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-100'}`}>
               {spot.status === 'available' ? 'متاح' : 'محجوز'}
            </div>
          </motion.div>
        ))}
      </div>
      
      {spots.length === 0 && (
         <div className="text-slate-500 text-center mt-20">لا توجد مواقف حالياً</div>
      )}
    </div>
  )
}