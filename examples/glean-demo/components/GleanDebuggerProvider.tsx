'use client';

import dynamic from 'next/dynamic';

const GleanDebugger = dynamic(
  () => import('@zaob/glean-debug-logger').then((mod) => mod.GleanDebugger),
  { ssr: false }
);

export default function GleanDebuggerProvider() {
  return <GleanDebugger environment="development" user={{ role: 'admin' }} />;
}
