import ClientDb from "@/components/pg";
import LiveClientDb from "@/components/pgLive";

export default function Home() {
  return (
    <main className="p-24">
      {/* <p>client db:</p>
      <ClientDb />
      <br /> */}
      <p>live client db:</p>
      <LiveClientDb />
    </main>
  );
}
