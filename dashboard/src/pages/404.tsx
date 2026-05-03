import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h2>404 - Page Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  );
}
