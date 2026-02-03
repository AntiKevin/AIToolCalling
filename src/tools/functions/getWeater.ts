export function getWeather(args: Record<string, any>): string {
  const city = args.city;
  return JSON.stringify({ city, temperature: 22, unit: 'celsius', condition: 'sunny' });
}

export function getTime(args: Record<string, any>): string {
  const city = args.city;
  return JSON.stringify({ city, time: '14:30', timezone: 'CET' });
}