import styles from '@/styles/Home.module.css';
import useStores from '@/stores/useStores';

export default function Home() {
  const {globalStore} = useStores();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        Hello TeeZZim {globalStore.isTest}
      </main>
    </div>
  )
}
