export function generateUserKey(): string {
  const timestamp = Date.now().toString(36); // جزء من الوقت
  const randomPart = Math.random().toString(36).substring(2, 10); // جزء عشوائي
  return `key_${timestamp}_${randomPart}`;
}
