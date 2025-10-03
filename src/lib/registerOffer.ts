export async function registerOfferInFirestore(offerId: string, prizeId: string) {
  try {
    const response = await fetch("https://yourproject.vercel.app/api/add-offer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ offerId, prizeId })
    });

    const data = await response.json();

    if (data.success) {
      console.log("تم تسجيل العرض بنجاح في Firestore ✅");
    } else {
      console.error("خطأ أثناء التسجيل:", data.error);
    }
  } catch (error) {
    console.error("خطأ في الاتصال بالـ API:", error);
  }
}
