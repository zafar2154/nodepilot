import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-blue-600">VoltIQ</h1>
      <p className="mt-4">
        Pantau & kontrol perangkat IoT Anda secara real-time.
      </p>

      <div className="mt-8 flex space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 bg-green-600 rounded">
          Register
        </Link>
      </div>
    </main>
  );
}
