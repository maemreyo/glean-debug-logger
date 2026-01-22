import TestConsolePanel from '@/components/TestConsolePanel';
import TestSensitiveData from '@/components/TestSensitiveData';
import TestXHR from '@/components/TestXHR';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        GleanDebugger Demo
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        GleanDebugger panel is auto-activated in development mode. Look for the floating button in
        the bottom-right corner.
      </p>

      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-1">
        <TestConsolePanel />
        <TestSensitiveData />
        <TestXHR />
      </div>
    </main>
  );
}
