// app/page.tsx
import Link from 'next/link';
import FondoVanta from './components/FondoVanta'; // Ajusta la ruta si es necesario
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      {/* El fondo interactivo se renderiza aquí */}
      <FondoVanta />

      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            <span className={styles.titleEmoji}>🧠</span>
            JuegoManía
          </h1>
          <p className={styles.subtitle}>
            Selecciona una actividad para desafiar tu mente
          </p>
        </div>

        {/* Los 3 botones ahora son "tarjetas" que enlazan a tus juegos */}
        <div className={styles.cardGrid}>
          
          <Link href="/sopa_letras" className={styles.card}>
            <span className={styles.cardEmoji}>🧩</span>
            Sopa de Letras
          </Link>
          
          <Link href="/2048_juego" className={styles.card}>
            <span className={styles.cardEmoji}>🔢</span>
            Juego 2048
          </Link>

          <Link href="/mente_activa" className={styles.card}>
            <span className={styles.cardEmoji}>🎴</span>
            Mente Activa
          </Link>
          
        </div>
      </main>
    </>
  );
}