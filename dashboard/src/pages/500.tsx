import Link from 'next/link';

export default function Custom500() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h2>500 - Server-side error occurred</h2>
      <Link href="/">Return Home</Link>
    </div>
  );
}
