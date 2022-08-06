import { useRouter } from 'next/router'

const Uuid = () => {
  const router = useRouter()
  const { uuid } = router.query

  return <p>uuid: { uuid }</p>
}

export default Uuid
