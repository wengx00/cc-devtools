export default function formatLog(...data: any[]) {
  const message = data
    .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
    .join(' ');
  return `[IoC-Web]${new Date().toLocaleString()} ${message}`;
}
