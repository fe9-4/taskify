import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/auth/login">로그인</Link>
          </li>
          <li>
            <Link href="/auth/signup">회원가입</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
