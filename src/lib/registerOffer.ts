export async function registerOfferInFirestore(offerId: string, prizeId: string) {
  const response = await fetch("/api/add-offer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offerId, prizeId })
  });

  if (!response.ok) {
    throw new Error("Failed to register offer in Firestore");
  }

  return response.json();
}
