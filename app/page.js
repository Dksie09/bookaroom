import Image from "next/image";
import Booking from "./components/Booking";
import Main from "./components/Main";


export default function Home() {
  return (
    <div className=" lg:m-20">
      <Main />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* <Booking /> */}
      </main>
    </div>
  );
}
