# نقطة رُكن - Parking Booking System

تطبيق ويب للحجز المسبق لمواقف السيارات باستخدام الخريطة التفاعلية.

## الوصف

نقطة رُكن هو تطبيق يتيح للمستخدمين حجز مواقف سيارات مسبقا من خلال الخريطة ومعرفة المواقف المتاحة والدفع بسهولة لتجنب الزحمة.

## الميزات

- عرض مواقف السيارات على خريطة Google Maps
- حجز موقف مسبق مع إشعار بالباركود
- نظام مصادقة آمن
- دفع إلكتروني عبر Stripe
- واجهة مستخدم متجاوبة باللغة العربية

## التقنيات المستخدمة

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Maps:** Google Maps API
- **Payment:** Stripe
- **Deployment:** Vercel

## البدء

### المتطلبات

- Node.js 18+
- npm أو yarn أو pnpm

### التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd parking-booking
```

2. تثبيت التبعيات:
```bash
npm install
```

3. إعداد متغيرات البيئة:
انسخ `.env.local` وأدخل قيم API keys الخاصة بك.

4. تشغيل الخادم المحلي:
```bash
npm run dev
```

5. افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## إعداد قاعدة البيانات

1. أنشئ مشروع Supabase جديد
2. شغل الـ SQL script في `database/schema.sql`
3. حدث متغيرات البيئة بالقيم الصحيحة

## النشر

يمكن نشر التطبيق على Vercel:

```bash
npm run build
```

ثم ارفع الملفات إلى Vercel.

## المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل البدء.

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.
