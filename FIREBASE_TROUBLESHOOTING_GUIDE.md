# دليل حل مشاكل Firebase 🔧

## 🚨 المشاكل المكتشفة والحلول

### 1. **مشكلة: "فشل في جلب البيانات"**

**الأعراض:**

- جميع الأقسام تظهر رسالة خطأ "فشل في جلب..."
- قائمة الفائزين فارغة
- قائمة العروض فارغة
- قائمة المشتركين فارغة

**الأسباب المحتملة:**

1. قواعد الأمان غير صحيحة
2. عدم وجود Indexes
3. مشكلة في الاتصال بـ Firebase
4. بيانات غير موجودة في Firebase

**الحلول:**

#### أ) تطبيق قواعد الأمان الصحيحة:

**لـ Realtime Database:**

1. اذهب إلى: https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules
2. انسخ هذا الكود:

```json
{
  "rules": {
    "offers": {
      ".read": true,
      ".write": true
    },
    "participants": {
      ".read": true,
      ".write": true
    },
    "winners": {
      ".read": true,
      ".write": true
    },
    "draws": {
      ".read": true,
      ".write": true
    },
    "settings": {
      ".read": true,
      ".write": true
    },
    "stats": {
      ".read": true,
      ".write": true
    },
    "connection_test": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. اضغط "Publish"

**لـ Firestore:**

1. اذهب إلى: https://console.firebase.google.com/project/fir-project-b3e4e/firestore/rules
2. انسخ هذا الكود:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /offers/{document} {
      allow read, write: if true;
    }
    match /participants/{document} {
      allow read, write: if true;
    }
    match /winners/{document} {
      allow read, write: if true;
    }
    match /draws/{document} {
      allow read, write: if true;
    }
    match /settings/{document} {
      allow read, write: if true;
    }
    match /stats/{document} {
      allow read, write: if true;
    }
    match /connection_test/{document} {
      allow read, write: if true;
    }
  }
}
```

3. اضغط "Publish"

#### ب) إضافة Indexes المطلوبة:

1. اذهب إلى: https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/indexes
2. أضف هذه Indexes:

**Offers Collection:**

- `status` (ascending)
- `category` (ascending)
- `createdDate` (descending)
- `status + category` (composite)
- `status + createdDate` (composite)

**Participants Collection:**

- `status` (ascending)
- `joinDate` (descending)
- `totalPoints` (descending)
- `status + joinDate` (composite)
- `status + totalPoints` (composite)

**Winners Collection:**

- `status` (ascending)
- `winDate` (descending)
- `drawId` (ascending)
- `participantId` (ascending)
- `status + winDate` (composite)
- `drawId + status` (composite)

**Draws Collection:**

- `status` (ascending)
- `startDate` (descending)
- `endDate` (descending)
- `status + startDate` (composite)
- `status + endDate` (composite)

### 2. **مشكلة: "فشل في إضافة العرض"**

**الحل:**

- تم إضافة بيانات افتراضية للعروض
- تم إصلاح مشكلة الاتصال بـ Firebase
- استخدم مكون اختبار Firebase للتأكد من الاتصال

### 3. **مشكلة: "قائمة الفائزين فارغة"**

**الحل:**

- تم إضافة بيانات افتراضية للفائزين
- تحقق من قواعد الأمان
- استخدم مكون اختبار Firebase

## 🛠️ خطوات التشخيص والعلاج

### الخطوة 1: اختبار الاتصال

1. افتح التطبيق على: http://localhost:5173
2. اذهب إلى صفحة الإدارة
3. اضغط على تبويب "اختبار Firebase"
4. اضغط "اختبار الاتصال"
5. تحقق من النتائج

### الخطوة 2: تطبيق قواعد الأمان

1. اتبع الخطوات أعلاه لتطبيق قواعد الأمان
2. انتظر بضع دقائق بعد التطبيق
3. اختبر الاتصال مرة أخرى

### الخطوة 3: إضافة Indexes

1. اتبع الخطوات أعلاه لإضافة Indexes
2. انتظر إنشاء Indexes (قد يستغرق عدة دقائق)
3. اختبر التطبيق مرة أخرى

### الخطوة 4: التحقق من البيانات

1. اذهب إلى Firebase Console
2. تحقق من وجود البيانات في Collections
3. إذا لم تكن موجودة، سيتم إنشاؤها تلقائياً

## 🔗 الروابط المهمة

### Firebase Console:

- **المشروع الرئيسي:** https://console.firebase.google.com/project/fir-project-b3e4e
- **Realtime Database:** https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb
- **Firestore:** https://console.firebase.google.com/project/fir-project-b3e4e/firestore

### قواعد الأمان:

- **Realtime Database Rules:** https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules
- **Firestore Rules:** https://console.firebase.google.com/project/fir-project-b3e4e/firestore/rules

### Indexes:

- **Realtime Database Indexes:** https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/indexes

## 📊 البيانات الافتراضية المضافة

### العروض (4 عروض):

1. اشترك في قناة تليجرام - 50 نقطة
2. تابع صفحة فيسبوك - 30 نقطة
3. اشترك في قناة يوتيوب - 40 نقطة
4. شارك المنشور على إنستاجرام - 25 نقطة

### المشتركين (5 مشتركين):

1. أحمد محمد - 150 نقطة
2. سارة أحمد - 75 نقطة
3. محمد علي - 225 نقطة
4. فاطمة حسن - 50 نقطة
5. علي أحمد - 125 نقطة

### الفائزين (3 فائزين):

1. أحمد محمد - iPhone 15 Pro
2. سارة أحمد - PlayStation 5
3. محمد علي - جائزة نقدية

### السحوبات (3 سحوبات):

1. سحب iPhone 15 Pro - نشط
2. سحب PlayStation 5 - قادم
3. سحب الجوائز النقدية - مكتمل

## ✅ النتيجة المتوقعة

بعد تطبيق جميع الحلول:

- ✅ جميع البيانات ستظهر في الأقسام المختلفة
- ✅ إضافة العروض ستعمل بشكل صحيح
- ✅ قائمة الفائزين ستظهر البيانات
- ✅ جميع العمليات ستعمل مع Firebase
- ✅ البيانات ستكون dynamic ومحدثة فورياً

## 🆘 إذا استمرت المشكلة

1. **تحقق من Console المتصفح** للبحث عن أخطاء
2. **اختبر الاتصال** باستخدام مكون اختبار Firebase
3. **تحقق من قواعد الأمان** مرة أخرى
4. **انتظر بضع دقائق** بعد تطبيق التغييرات
5. **أعد تشغيل التطبيق** إذا لزم الأمر

## 📞 الدعم

إذا واجهت أي مشاكل:

1. استخدم مكون اختبار Firebase للتشخيص
2. تحقق من Console المتصفح للأخطاء
3. تأكد من تطبيق جميع الخطوات أعلاه
4. انتظر بضع دقائق بعد كل تغيير
