import { useState } from 'react';

const PopUp = ({
  reverse = false,
  smallClose = false,
  isCancel = false,
  children,
  buttonText = '확인',
  buttonType = 'primary',
  onButtonClick,
  cancelButtonClick,
  hidden,
}) => {
  return (
    <>
      <div id='popupAlert' className='popup-wrap is-active' hidden={hidden}>
        <div className='popup popup-modal'>
          <div className='popup-inner'>
            <div className='popup-body'>{children}</div>
            <div className='popup-foot'>
              <div className='btn-group grid btn-group__fixed'>
                {
                  reverse ?
                    <div className='flex'>
                      {cancelButtonClick &&
                        <div className={smallClose ? 'col col-4' : 'col col-6'}>
                          <button
                            type='button'
                            className={`btn large secondary full`}
                            onClick={cancelButtonClick}
                          >
                            {
                              isCancel ? '취소' : '닫기'
                            }
                          </button>
                        </div>
                      }
                      <div className={smallClose ? 'col col-8':'col col-6'}>
                        <button
                          type='button'
                          className={`btn large ${buttonType === 'primary' ? buttonType : 'warning-medium'
                            } full`}
                          onClick={onButtonClick}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                    :
                    <>
                      <div>
                        <button
                          type='button'
                          className={`btn large ${buttonType === 'primary' ? buttonType : 'warning-medium'
                            } full`}
                          onClick={onButtonClick}
                        >
                          {buttonText}
                        </button>
                      </div>
                      {cancelButtonClick &&
                        <div>
                          <button
                            type='button'
                            className={`btn large warning-medium full`}
                            onClick={cancelButtonClick}
                          >
                            닫기
                          </button>
                        </div>
                      }
                    </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        #popupAlert {
          z-index: 4500;
        }
      `}</style>
    </>
  );
};

export default PopUp;
