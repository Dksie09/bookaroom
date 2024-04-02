import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <button className="flex items-center space-x-4 rounded p-2 bg-white text-black">Add room</button>
      </div>
    </main>
  );
}
