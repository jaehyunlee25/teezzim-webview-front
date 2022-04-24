import { useState } from 'react';

const PopUp = ({
  children,
  buttonText = '확인',
  buttonType = 'primary',
  onButtonClick,
  hidden,
}) => {
  return (
    <div id='popupAlert' className='popup-wrap is-active' hidden={hidden}>
      <div className='popup popup-modal'>
        <div className='popup-inner'>
          <div className='popup-body'>{children}</div>
          <div className='popup-foot'>
            <ul className='btn-group btn-group__fixed'>
              <li>
                <button
                  type='button'
                  className={`btn large ${
                    buttonType === 'primary' ? buttonType : 'warning-medium'
                  } full`}
                  onClick={onButtonClick}
                >
                  {buttonText}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
