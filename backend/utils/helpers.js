export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `HCD-${timestamp}-${random}`.toUpperCase();
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const isWithinDeliveryHours = (operatingHours) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "lowercase" });
  const currentTime = now.toTimeString().slice(0, 5);

  const dayHours = operatingHours[currentDay];
  if (!dayHours || !dayHours.isOpen) return false;

  return currentTime >= dayHours.open && currentTime <= dayHours.close;
};
