"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO 로그인 로직 구현
    console.log("로그인 시도:", email, password);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-4 text-2xl font-bold">로그인</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
          로그인
        </button>
      </form>
    </div>
  );
}
