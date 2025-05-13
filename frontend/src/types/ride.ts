export interface Ride {
  id: string;
  type: 'offer' | 'request';
  origin: string;
  destination: string;
  state: string;
  university: string;
  date: string;
  time: string;
  price: string;
  seats: string;
  driver: string;
  paymentStatus?: 'pending' | 'locked' | 'released';
} 