import { useRouter } from 'next/router';

export default function GolfHomepage() {
  const router = useRouter();
  const { url } = router.query;

  return <iframe src={url} width='100%' height='100%' />;
}
