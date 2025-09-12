# Firebase Database Structure Documentation

## Database URL

```
https://fir-project-b3e4e-default-rtdb.firebaseio.com
```

## Database Structure

### 1. Offers Collection

```
/offers/{offerId}
{
  id: string,
  name: string,
  url: string,
  maxParticipants: number,
  remainingParticipants: number,
  completedCount: number,
  status: 'active' | 'inactive',
  createdDate: string,
  description?: string,
  reward?: string,
  category?: string
}
```

**Required Indexes:**

- `status` (for filtering active/inactive offers)
- `category` (for filtering by category)
- `createdDate` (for sorting by date)

### 2. Participants Collection

```
/participants/{participantId}
{
  id: string,
  name: string,
  email: string,
  phone: string,
  socialMediaLinks: {
    facebook?: string,
    instagram?: string,
    twitter?: string,
    tiktok?: string
  },
  completedOffers: string[],
  totalPoints: number,
  joinDate: string,
  status: 'active' | 'inactive' | 'banned',
  referralCode: string,
  referredBy?: string,
  lastActivity: string,
  profileImage?: string
}
```

**Required Indexes:**

- `status` (for filtering active/inactive/banned participants)
- `email` (for unique email lookups)
- `referralCode` (for referral system)
- `totalPoints` (for leaderboard sorting)
- `joinDate` (for date-based filtering)
- `lastActivity` (for activity tracking)

### 3. Winners Collection

```
/winners/{winnerId}
{
  id: string,
  participantId: string,
  participantName: string,
  participantEmail: string,
  drawId: string,
  drawName: string,
  prize: string,
  prizeValue: number,
  winDate: string,
  status: 'pending' | 'claimed' | 'delivered',
  claimDate?: string,
  deliveryDate?: string,
  notes?: string,
  contactInfo: {
    phone: string,
    address?: string
  }
}
```

**Required Indexes:**

- `participantId` (for participant's winning history)
- `drawId` (for draw's winners)
- `status` (for filtering by claim status)
- `winDate` (for date-based filtering)

### 4. Draws Collection

```
/draws/{drawId}
{
  id: string,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  drawDate: string,
  status: 'upcoming' | 'active' | 'completed' | 'cancelled',
  maxParticipants: number,
  currentParticipants: number,
  prizes: {
    first: { name: string, value: number },
    second: { name: string, value: number },
    third: { name: string, value: number },
    consolation?: { name: string, value: number, count: number }
  },
  requirements: {
    minPoints: number,
    minOffers: number,
    socialMediaRequired: boolean
  },
  winners: string[],
  createdAt: string,
  updatedAt: string
}
```

**Required Indexes:**

- `status` (for filtering by draw status)
- `startDate` (for date-based filtering)
- `endDate` (for date-based filtering)
- `drawDate` (for sorting by draw date)
- `currentParticipants` (for capacity tracking)

### 5. Settings Collection

```
/settings
{
  siteName: string,
  siteDescription: string,
  contactEmail: string,
  contactPhone: string,
  socialMedia: {
    facebook: string,
    instagram: string,
    twitter: string,
    tiktok: string
  },
  features: {
    referralSystem: boolean,
    socialMediaVerification: boolean,
    emailNotifications: boolean,
    smsNotifications: boolean
  },
  points: {
    offerCompletion: number,
    referralBonus: number,
    socialMediaShare: number,
    dailyLogin: number
  },
  limits: {
    maxOffersPerDay: number,
    maxReferralsPerUser: number,
    minAge: number,
    maxAge: number
  },
  maintenance: {
    isMaintenanceMode: boolean,
    maintenanceMessage: string
  },
  theme: {
    primaryColor: string,
    secondaryColor: string,
    accentColor: string
  },
  updatedAt: string
}
```

### 6. Stats Collection

```
/stats
{
  totalParticipants: number,
  activeParticipants: number,
  totalOffers: number,
  activeOffers: number,
  totalWinners: number,
  totalDraws: number,
  activeDraws: number,
  completedDraws: number,
  totalPointsDistributed: number,
  totalReferrals: number,
  monthlyStats: {
    newParticipants: number,
    completedOffers: number,
    newWinners: number,
    pointsEarned: number
  },
  dailyStats: {
    newParticipants: number,
    completedOffers: number,
    activeUsers: number,
    pointsEarned: number
  },
  topParticipants: [
    {
      id: string,
      name: string,
      points: number,
      completedOffers: number
    }
  ],
  topOffers: [
    {
      id: string,
      name: string,
      completionRate: number,
      totalCompletions: number
    }
  ],
  lastUpdated: string
}
```

## Firebase Security Rules

### Basic Security Rules

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null && root.child('settings').child('maintenance').child('isMaintenanceMode').val() == false"
  }
}
```

### Advanced Security Rules

```json
{
  "rules": {
    "offers": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "participants": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$participantId": {
        ".write": "auth != null && (auth.uid == $participantId || auth.token.admin == true)"
      }
    },
    "winners": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "draws": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "stats": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    }
  }
}
```

## Required Firebase Indexes

### Composite Indexes for Complex Queries

1. **Participants by Status and Points:**

   - Collection: `participants`
   - Fields: `status` (Ascending), `totalPoints` (Descending)

2. **Offers by Status and Category:**

   - Collection: `offers`
   - Fields: `status` (Ascending), `category` (Ascending)

3. **Winners by Draw and Status:**

   - Collection: `winners`
   - Fields: `drawId` (Ascending), `status` (Ascending)

4. **Draws by Status and Date:**

   - Collection: `draws`
   - Fields: `status` (Ascending), `drawDate` (Descending)

5. **Participants by Referral Code:**

   - Collection: `participants`
   - Fields: `referralCode` (Ascending)

6. **Offers by Completion Rate:**
   - Collection: `offers`
   - Fields: `completedCount` (Descending), `maxParticipants` (Ascending)

## Firebase Console Setup Instructions

1. **Go to Firebase Console:**

   - Visit: https://console.firebase.google.com/
   - Select your project: `fir-project-b3e4e`

2. **Enable Realtime Database:**

   - Go to Realtime Database
   - Click "Create Database"
   - Choose a location (preferably close to your users)
   - Start in test mode for development

3. **Set up Security Rules:**

   - Go to Realtime Database > Rules
   - Replace the default rules with the security rules above
   - Publish the rules

4. **Create Indexes:**

   - Go to Realtime Database > Indexes
   - Add the composite indexes listed above
   - Wait for indexes to build (may take a few minutes)

5. **Initialize Data:**
   - The application will automatically create the initial structure
   - Settings will be initialized with default values
   - Stats will be calculated automatically

## Data Migration (if needed)

If you have existing data, you can migrate it using the following structure:

```javascript
// Example migration script
const migrateData = async () => {
  const oldData = await fetch("/api/old-data");
  const newStructure = {
    offers: {},
    participants: {},
    winners: {},
    draws: {},
    settings: defaultSettings,
    stats: defaultStats
  };

  // Transform old data to new structure
  // Upload to Firebase
};
```

## Monitoring and Analytics

1. **Enable Analytics:**

   - Go to Analytics in Firebase Console
   - Enable Google Analytics for Firebase

2. **Set up Performance Monitoring:**

   - Go to Performance in Firebase Console
   - Enable performance monitoring

3. **Configure Crashlytics:**
   - Go to Crashlytics in Firebase Console
   - Enable crash reporting

## Backup and Recovery

1. **Regular Backups:**

   - Export data regularly using Firebase Admin SDK
   - Store backups in secure cloud storage

2. **Recovery Process:**
   - Use Firebase Admin SDK to restore data
   - Verify data integrity after restoration

## Cost Optimization

1. **Monitor Usage:**

   - Check Firebase Console > Usage and billing
   - Set up budget alerts

2. **Optimize Queries:**

   - Use indexes efficiently
   - Limit data transfer with pagination
   - Cache frequently accessed data

3. **Data Retention:**
   - Implement data archiving for old records
   - Clean up unused data regularly
