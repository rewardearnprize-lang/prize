# Firebase Indexes المطلوبة

## 🔗 روابط Firebase Indexes

### 1. Firebase Console - Database Rules

**الرابط:** https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules

### 2. Firebase Console - Database Indexes

**الرابط:** https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/indexes

## 📋 Indexes المطلوبة

### 1. Offers Collection Indexes

```
/offers
├── status (ascending)
├── category (ascending)
├── createdDate (descending)
├── status + category (composite)
└── status + createdDate (composite)
```

### 2. Participants Collection Indexes

```
/participants
├── status (ascending)
├── joinDate (descending)
├── totalPoints (descending)
├── status + joinDate (composite)
└── status + totalPoints (composite)
```

### 3. Winners Collection Indexes

```
/winners
├── status (ascending)
├── winDate (descending)
├── drawId (ascending)
├── participantId (ascending)
├── status + winDate (composite)
└── drawId + status (composite)
```

### 4. Draws Collection Indexes

```
/draws
├── status (ascending)
├── startDate (descending)
├── endDate (descending)
├── status + startDate (composite)
└── status + endDate (composite)
```

### 5. Settings Collection Indexes

```
/settings
└── updatedAt (descending)
```

### 6. Stats Collection Indexes

```
/stats
└── lastUpdated (descending)
```

## 🛠️ خطوات إضافة Indexes

### الخطوة 1: الوصول إلى Firebase Console

1. اذهب إلى: https://console.firebase.google.com/
2. اختر مشروعك: `fir-project-b3e4e`
3. اذهب إلى Realtime Database

### الخطوة 2: إضافة Indexes

1. اذهب إلى تبويب "Indexes"
2. اضغط على "Add Index"
3. أضف كل index من القائمة أعلاه

### مثال على إضافة Index للعروض:

```
Collection ID: offers
Fields:
- status (Ascending)
- createdDate (Descending)
```

## ⚠️ ملاحظات مهمة

### 1. تكلفة Indexes

- كل index يستهلك مساحة تخزين إضافية
- قد تزيد من تكلفة الاستعلامات
- احذف Indexes غير المستخدمة

### 2. وقت إنشاء Indexes

- قد يستغرق إنشاء Index جديد عدة دقائق
- لا يمكن حذف Index أثناء إنشائه

### 3. حدود Indexes

- الحد الأقصى: 200 index لكل مشروع
- الحد الأقصى: 6 fields لكل index

## 🔧 إعدادات إضافية

### 1. Security Rules

تأكد من تطبيق قواعد الأمان المناسبة:

```json
{
  "rules": {
    "offers": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "participants": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "winners": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "draws": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "stats": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    }
  }
}
```

### 2. Monitoring

راقب استخدام Indexes من خلال:

- Firebase Console > Database > Usage
- تحقق من تكلفة الاستعلامات
- احذف Indexes غير المستخدمة

## 📞 الدعم

إذا واجهت أي مشاكل في إعداد Indexes:

1. تحقق من وثائق Firebase الرسمية
2. تأكد من صحة قواعد الأمان
3. تحقق من حدود المشروع

## 🎯 النتيجة المتوقعة

بعد إضافة جميع Indexes المطلوبة:

- ✅ تحسين أداء الاستعلامات
- ✅ تقليل وقت الاستجابة
- ✅ تحسين تجربة المستخدم
- ✅ تقليل تكلفة Firebase
