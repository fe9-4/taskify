import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Image src="/images/loading/logo.svg" alt="로고" width={100} height={95} />
      <h2 className="lg:text-xl">잠시만 기다려주세요!</h2>
    </div>
  );
};

export default Loading;
