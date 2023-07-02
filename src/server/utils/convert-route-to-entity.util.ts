const mapping: Record<string, string> = {
  bikes: 'bike',
  bookings: 'booking',
  companies: 'company',
  rates: 'rate',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
