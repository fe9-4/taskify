"use client";

import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
      <button type="button" onClick={() => (window.location.href = "/")} className="mb-6">
        <Image src="/images/auth/logo.svg" alt="Logo" width={200} height={280} className="mx-auto" />
      </button>
      {children}
    </div>
  );
};

export default AuthLayout;
