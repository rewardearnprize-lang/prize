# Firebase Security Rules المطلوبة

## 🔐 قواعد الأمان لـ Realtime Database

### 1. الرابط المباشر لقواعد الأمان:

```
https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules
```

### 2. قواعد الأمان المطلوبة:

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

### 3. قواعد الأمان المتقدمة (للإنتاج):

```json
{
  "rules": {
    "offers": {
      ".read": true,
      ".write": "auth != null"
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
    },
    "connection_test": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 🔐 قواعد الأمان لـ Firestore

### 1. الرابط المباشر لقواعد Firestore:

```
https://console.firebase.google.com/project/fir-project-b3e4e/firestore/rules
```

### 2. قواعد Firestore المطلوبة:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Offers collection
    match /offers/{document} {
      allow read, write: if true;
    }

    // Participants collection
    match /participants/{document} {
      allow read, write: if true;
    }

    // Winners collection
    match /winners/{document} {
      allow read, write: if true;
    }

    // Draws collection
    match /draws/{document} {
      allow read, write: if true;
    }

    // Settings collection
    match /settings/{document} {
      allow read, write: if true;
    }

    // Stats collection
    match /stats/{document} {
      allow read, write: if true;
    }

    // Connection test collection
    match /connection_test/{document} {
      allow read, write: if true;
    }
  }
}
```

### 3. قواعد Firestore المتقدمة (للإنتاج):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Offers collection
    match /offers/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Participants collection
    match /participants/{document} {
      allow read, write: if request.auth != null;
    }

    // Winners collection
    match /winners/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Draws collection
    match /draws/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Settings collection
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Stats collection
    match /stats/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Connection test collection
    match /connection_test/{document} {
      allow read, write: if true;
    }
  }
}
```

## 🛠️ خطوات تطبيق قواعد الأمان

### الخطوة 1: تطبيق قواعد Realtime Database

1. اذهب إلى: https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules
2. انسخ قواعد الأمان المطلوبة
3. اضغط "Publish"

### الخطوة 2: تطبيق قواعد Firestore

1. اذهب إلى: https://console.firebase.google.com/project/fir-project-b3e4e/firestore/rules
2. انسخ قواعد الأمان المطلوبة
3. اضغط "Publish"

## ⚠️ ملاحظات مهمة

### 1. قواعد التطوير vs الإنتاج

- **قواعد التطوير**: تسمح بالقراءة والكتابة للجميع
- **قواعد الإنتاج**: تتطلب مصادقة وإذنات محددة

### 2. الأمان

- قواعد التطوير غير آمنة للإنتاج
- استخدم قواعد الإنتاج في البيئة الحقيقية
- أضف مصادقة المستخدمين قبل الإنتاج

### 3. الاختبار

- اختبر القواعد بعد تطبيقها
- استخدم مكون اختبار Firebase للتأكد من الاتصال

## 🔧 حل المشاكل الشائعة

### 1. خطأ "Permission Denied"

- تحقق من قواعد الأمان
- تأكد من تطبيق القواعد بشكل صحيح
- انتظر بضع دقائق بعد التطبيق

### 2. خطأ "Unauthorized"

- تحقق من إعدادات Firebase
- تأكد من صحة API Keys
- تحقق من تفعيل الخدمات

### 3. خطأ "Index Required"

- أضف Indexes المطلوبة
- انتظر إنشاء Indexes
- تحقق من استعلامات البيانات

## 📞 الدعم

إذا واجهت مشاكل في تطبيق قواعد الأمان:

1. تحقق من وثائق Firebase الرسمية
2. تأكد من صحة القواعد
3. اختبر الاتصال باستخدام مكون الاختبار
