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
    case 'checked':
      name = '골프장';
      count = panelStore.checkedTeeList.size;
      break;
  }
  return (
    <span>
      {name}: <b>{count}</b>
    </span>
  );
});

export default Counter;
