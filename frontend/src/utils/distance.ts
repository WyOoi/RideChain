// Haversine formula to calculate the distance between two points on Earth
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Calculate price based on distance (RM 3.50 base for 5km + RM 0.50/km)
export function calculatePrice(distanceKm: number): number {
  const basePrice = 3.50;
  const baseCoveredDistance = 5; // kilometers
  const additionalRatePerKm = 0.50;
  
  if (distanceKm <= 0) return 0;
  if (distanceKm <= baseCoveredDistance) return basePrice;
  
  const additionalDistance = distanceKm - baseCoveredDistance;
  const additionalCost = additionalDistance * additionalRatePerKm;
  
  return basePrice + additionalCost;
}

// Format price to 2 decimal places
export function formatPrice(price: number): string {
  return price.toFixed(2);
} 