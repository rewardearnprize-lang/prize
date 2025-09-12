# 🔗 الروابط المباشرة لـ Firebase

## 🚀 **الروابط الأساسية:**

### **1. Firebase Console الرئيسي:**

```
https://console.firebase.google.com/project/fir-project-b3e4e
```

### **2. Realtime Database:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb
```

### **3. Firestore Database:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/firestore
```

## 🔐 **قواعد الأمان:**

### **4. Realtime Database Rules:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules
```

### **5. Firestore Rules:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/firestore/rules
```

## 📊 **Indexes:**

### **6. Realtime Database Indexes:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/indexes
```

### **7. Firestore Indexes:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/firestore/indexes
```

## 🔧 **الإعدادات:**

### **8. إعدادات المشروع:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/settings
```

### **9. إعدادات التطبيق:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/settings/general
```

## 📈 **المراقبة والإحصائيات:**

### **10. Usage & Billing:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/usage
```

### **11. Analytics:**

```
https://console.firebase.google.com/project/fir-project-b3e4e/analytics
```

## 🛠️ **خطوات سريعة:**

### **الخطوة 1: تطبيق قواعد الأمان**

#### **لـ Realtime Database:**

1. انسخ الرابط: `https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules`
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

#### **لـ Firestore:**

1. انسخ الرابط: `https://console.firebase.google.com/project/fir-project-b3e4e/firestore/rules`
2. انسخ هذا الكود:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all collections for testing
    match /{document=**} {
      allow read, write: if true;
    }

    // Specific collections
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

    match /test_data/{document} {
      allow read, write: if true;
    }
  }
}
```

3. اضغط "Publish"

### **الخطوة 2: إنشاء Indexes (في الكود)**

1. افتح التطبيق: `http://localhost:8082`
2. اذهب إلى صفحة الإدارة
3. اضغط على تبويب "اختبار Firebase"
4. اضغط "إنشاء Indexes"

### **الخطوة 2.1: إنشاء Indexes بالروابط المباشرة**

استخدم الروابط من ملف `FIRESTORE_INDEXES_URLS.md`:

1. انسخ أي رابط من الروابط المباشرة
2. اضغط عليه في المتصفح
3. سيتم فتح Firebase Console مباشرة
4. اضغط "Create Index"

### **الخطوة 3: اختبار Firestore**

1. في نفس صفحة الإدارة
2. اضغط على تبويب "اختبار Firestore"
3. اختبر جميع العمليات (Create, Read, Update, Delete)

## ⚡ **اختبار سريع:**

### **اختبار الاتصال:**

1. افتح: `http://localhost:8082`
2. اذهب إلى: Admin Panel
3. اضغط: "اختبار Firebase"
4. اضغط: "اختبار الاتصال"

### **اختبار Firestore:**

1. في نفس صفحة الإدارة
2. اضغط: "اختبار Firestore"
3. اضغط: "إنشاء بيانات" لاختبار الإضافة
4. اضغط: "قراءة البيانات" لاختبار القراءة
5. استخدم أزرار التعديل والحذف لاختبار باقي العمليات

### **إنشاء Indexes تلقائياً:**

1. في صفحة اختبار Firebase
2. اضغط: "إنشاء Indexes"
3. انتظر حتى يكتمل الإنشاء

## 🎯 **النتيجة المتوقعة:**

بعد تطبيق جميع الخطوات:

- ✅ جميع البيانات ستظهر في الأقسام المختلفة
- ✅ إضافة العروض ستعمل في Firestore
- ✅ قائمة الفائزين ستظهر البيانات
- ✅ جميع العمليات ستعمل مع Firebase
- ✅ اختبار Firestore سيعمل بشكل كامل

## 📞 **إذا واجهت مشاكل:**

1. **تحقق من قواعد الأمان** - استخدم الروابط 4 و 5
2. **تحقق من Indexes** - استخدم الرابط 6
3. **اختبر الاتصال** - استخدم مكون الاختبار في التطبيق
4. **تحقق من Console المتصفح** للأخطاء
5. **اختبر Firestore** - استخدم مكون اختبار Firestore

## 🔍 **ملاحظات مهمة:**

- **التطبيق يعمل الآن بالكامل مع Firestore**
- **جميع البيانات تُخزن في Firestore**
- **يمكنك اختبار جميع العمليات في تبويب "اختبار Firestore"**
- **تحقق من Console المتصفح لرؤية التفاصيل**
