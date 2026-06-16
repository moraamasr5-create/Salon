# Salon
صالون عز - الخارجة

هذا مجسّد مبدئي لتطبيق PWA لادارة الدور في الصالون.

تشغيل محلي:

```bash
npm install
npm run dev

# if you want to run the backend server (Supabase helpers)
node server/index.js
```

طباعة الإيصالات (XP-80)
----------------------

الملف `server/print_service.js` يولد أوامر ESC/POS ويقوم بإرسالها عبر طريقتين:

- `PRINT_METHOD=lp` (افتراضي): يستخدم `lp` (CUPS) لإرسال البايتات للطابعة المحلية. اضبط اسم الطابعة عبر `PRINTER_NAME` في `.env` إذا لزم.
- `PRINT_METHOD=qz`: يرجع الخادم البيانات بصيغة base64 ليأخذها العميل ويستخدم QZ-Tray لطباعة عبر المتصفح.

متغيرات بيئة مهمة (في `.env`):

```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
PRINTER_NAME=XP80_local_name
PRINT_METHOD=lp
SALON_NAME="صالون أبو خاطر"
```

نقاط النهاية المتعلقة بالطباعة:

- `POST /api/print` — يرسل حمولة الطباعة اليدوية: `{ salonName, ticket, customerName, services, employeeName, note }` ويقوم بالطباعة أو يرجع بيانات QZ.

الطباعة التلقائية
----------------
عند اكتمال كل الخدمات داخل زيارة، يقوم الخادم حالياً بتوليد وطباعة الإيصال تلقائياً. يمكنك تغيير هذا الحدث أو الإعلان عنه لاحقًا.

اختبار الطباعة محليًا (باستخدام `lp`):

```bash
# بعد ضبط .env
node server/index.js

# اطبع طلب يدوي (مثال عبر curl)
curl -X POST http://localhost:3000/api/print \
	-H "Content-Type: application/json" \
	-d '{"salonName":"صالون","ticket":"A023","customerName":"محمد","services":[{"name":"قص","price":100,"duration_minutes":20}],"employeeName":"أحمد","note":"استخدم كريم ترطيب"}'
```

إشعارات WhatsApp
-----------------

يمكنك تمكين إشعارات WhatsApp عبر Twilio بتعبئة المتغيرات في `.env`:

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+1415xxxxxxx
```

الخادم سيرسل رسالة تسجيل تلقائية عند إنشاء التذكرة، وسيشغّل مهمة دورية كل `REMIND_INTERVAL_SECONDS` ثانية للتحقق من الطابور وإرسال تذكير عندما يكون `peopleAhead <= REMIND_THRESHOLD`.

تجريب الرسائل (محاكاة): إذا لم تملأ متغيرات Twilio، يعرض الخادم الرسائل في الـ console بدلاً من الإرسال الفعلي.


الملفات الأساسية:
- `src/pages/Scan` — صفحة مسح QR أو إدخال يدوي
- `src/pages/Form` — نموذج بيانات العميل واختيار انضمام/حجز
- `src/pages/Confirm` — صفحة تأكيد تُظهر رقم التذكرة والوقت المتوقع

