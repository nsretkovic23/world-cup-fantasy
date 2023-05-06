import Image from "next/image";
import styles from "./page.module.css";
import UserProvider from "@/context/UserContext";
import Login from "./login/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello nextjs</h1>
    </main>
  );
}

// <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
