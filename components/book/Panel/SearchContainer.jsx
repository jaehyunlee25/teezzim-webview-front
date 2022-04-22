import SearchBar from '@/components/common/SearchBar';
import axios from 'axios';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import TeeListArea from './TeeListArea';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

const SearchContainer = observer(() => {
  const { panelStore } = useStores();
  const [hidden, setHidden] = useState(true);
  const [tee, setTee] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState('');
  let pid;
  const registeredList = useMemo(
    () => tee.filter(({ id }) => panelStore.registeredKeys.includes(id)),
    [tee, panelStore.registeredKeys],
  );
  const unregisteredList = useMemo(
    () => tee.filter(({ id }) => !panelStore.registeredKeys.includes(id)),
    [tee, panelStore.registeredKeys],
  );
  const mountRef = useRef(false);

  const handleChangeKeyword = ({ name, value }) => {
    if (name !== 'keyword') return;
    search(value);
    // pid = setTimeout(
    //   () => {
    //     // console.log(`clear ${pid - 1}`);
    //     if (pid) clearTimeout(pid);
    //     setDebouncedValue(value);
    //   },
    //   1000,
    //   value,
    // );
    // console.log(`${value} pid : ${pid}`);

    return pid;
  };

  const search = useCallback(async keyword => {
    if (keyword === '') {
      setTee([]);
      return;
    }
    const {
      status,
      data: { resultCode, message, data },
    } = await axios.get('/teezzim/teeapi/v1/club', {
      params: { keyword },
    });
    // console.log(data);
    if (!mountRef.current) return;
    if (status === 200) {
      if (resultCode === 1) {
        setTee(data);
      } else {
        console.warn(`[error code : ${resultCode}] ${message}`);
      }
    } else {
      console.warn(`[error code : ${status}]`);
    }
  }, []);

  useEffect(() => {
    mountRef.current = true;
    if (debouncedValue || debouncedValue === '') {
      search(debouncedValue);
    }
    return () => {
      mountRef.current = false;
    };
  }, [debouncedValue, search]);

  return (
    <>
      <SearchBar
        inputProps={{
          onFocus: () => setHidden(false),
        }}
        formProps={{
          onSubmit: e => e.preventDefault(),
        }}
        hasCloseBtn={!hidden}
        handleCloseBtn={() => setHidden(true)}
        onChangeKeyword={handleChangeKeyword}
      />

      <div className='wrapper' hidden={hidden}>
        <div className='container'>
          {tee.length <= 0 && (
            <span className='basic_txt medium-Emphasis01'>
              골프장을 검색해주세요.
            </span>
          )}

          <div className='list_Areawrap'>
            <div className='list_Areawrap_inner'>
              <TeeListArea registered list={registeredList} />
              <TeeListArea list={unregisteredList} />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          position: fixed;
          top: 0px;
          height: calc(90% - 71px);
          width: 100%;
          z-index: 250;
        }

        .container {
          display: flex;
          background-color: var(--neutrals-white);
          padding-top: 60px;
          height: 100%;
        }

        .list_Areawrap {
          height: 100%;
        }

        .list_Areawrap_inner {
          overflow-y: auto;
          height: calc(100% - 60px);
          background-color: var(--white);
          border-bottom-right-radius: 20px;
          border-bottom-left-radius: 20px;
        }

        .list_Areawrap_inner::-webkit-scrollbar {
          display: none;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
});

export default SearchContainer;
