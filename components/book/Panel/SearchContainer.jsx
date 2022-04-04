import SearchBar from '@/components/common/SearchBar';
import { useState } from 'react';

// [Todo] 검색 결과가 저장된 stores에서 결과 container에 뿌려주기
export default function SearchContainer() {
  const [hidden, setHidden] = useState(true);
  return (
    <>
      <SearchBar inputProps={{ onFocus: () => setHidden(false) }} />
      <div className='wrapper' hidden={hidden}>
        <div className='container'>
          <span className='basic_txt medium-Emphasis01'>
            골프장을 검색해주세요.
          </span>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          position: absolute;
          top: 0;
          height: 80%;
          width: 100%;
          z-index: 200;
        }

        .container {
          overflow-y: auto;
          display: flex;
          background-color: var(--neutrals-white);
          padding-top: 62px;
          height: 100%;
        }
      `}</style>
    </>
  );
}
