export async function getIP(): Promise<string> {
  const url = 'https://icanhazip.com';
  const response = await fetch(url);
  const data = await response.text();
  return data.trim();
}


export async function getLocationInfo(ip: string): Promise<string> {
  const url = `http://ip-api.com/json/${ip}`;
  const response = await fetch(url);
  const data = await response.json();
  return `${data.city}, ${data.regionName}, ${data.country}`;
}
