import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

export const Counter = observer(({ type }) => {
  const { panelStore } = useStores();

  let [name, count] = ['', 0];
  switch (type) {
    case 'registered':
      name = '등록';
      count = panelStore.registeredTeeList.length;
      break;
    case 'unregistered':
      name = '미등록';
      count = panelStore.unregisteredTeeList.length;
      break;
    default:
      name = '골프장';
      count =
        panelStore.registeredTeeList.length +
        panelStore.unregisteredTeeList.length;
      break;
  }
  return (
    <span>
      {count > 0 || name === '골프장' ? (
        <>
          {name}: <b>{count}</b>
        </>
      ) : (
        `${panelStore.filter}에는 ${name}한 골프장이 없습니다.`
      )}
    </span>
  );
});

export default Counter;
