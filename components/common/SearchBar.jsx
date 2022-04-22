import Image from 'next/image';
import useInput from '@/lib/hooks/useInput';
import CloseBtnMedium from '@/assets/images/Icon_Close-Medium2.svg';

// MyStory, Panel 페이지에서 사용
export default function SearchBar({
  textButton,
  formProps,
  inputProps,
  hasCloseBtn,
  handleCloseBtn,
  onChangeKeyword,
}) {
  /* 
    @Props
        textButton(boolean) : textButton이 true면 `검색 버튼` false면 `검색 아이콘` 렌더링
  */
  const { inputs, handleChange } = useInput(
    { keyword: '' },
    { cb: onChangeKeyword },
  );
  const { keyword } = inputs;
  return (
    <>
      {/* <div id='header'> */}
      <div className='inner'>
        <div className={textButton ? 'SearchWrapsmall' : 'SearchWrap bd'}>
          <div
            className={
              textButton ? 'search_topsmall inblk' : 'search_top inblk'
            }
          >
            <form {...formProps}>
              <label htmlFor='' className='blind'>
                검색
              </label>
              <input
                type='text'
                className='search_input'
                name='keyword'
                value={keyword}
                onChange={handleChange}
                autoComplete='off'
                {...inputProps}
              />
              {textButton && <span className='search_icon'></span>}

              <button
                type='submit'
                id=''
                className={textButton ? 'search_btn bg-grey4' : 'search_btn'}
              >
                <span className={textButton ? 'text-grey6' : 'ir'}>검색</span>
              </button>

              <span
                className='close-btn'
                onClick={hasCloseBtn ? handleCloseBtn : () => {}}
              >
                <Image src={CloseBtnMedium} alt='X' />{' '}
              </span>
            </form>
          </div>
        </div>
      </div>
      {/* </div> */}
      <style jsx>{`
        .inner {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 300;
        }

        input.search_input {
          height: 100%;
          padding: 4px 1% 4px 37px;
          width: ${textButton ? '75%' : '100%'};
        }

        button.search_btn.bg-grey4 {
          padding: 1px 6px;
        }

        .SearchWrap.bd {
          border-bottom: unset;
        }

        .close-btn {
          position: absolute;
          right: 4px;
          top: 4px;
          cursor: pointer;
          opacity: ${hasCloseBtn ? 1 : 0};
        }
        input {
          -moz-user-select: auto;
          -webkit-user-select: auto;
          -ms-user-select: auto;
          user-select: auto;
        }
      `}</style>
    </>
  );
}
