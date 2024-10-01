// components/SessionProviderWrapper.tsx
"use client"; // Marca este componente como un Client Component

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
