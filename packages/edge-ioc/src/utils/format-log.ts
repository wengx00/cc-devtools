export default function formatLog(...data: any[]) {
  const message = data
    .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
    .join(' ');
  return `[Edge-IoC] ${new Date().toLocaleString()} ${message}`;
}
