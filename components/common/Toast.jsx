import useStores from '@/stores/useStores';
import { useEffect, useRef, useState } from 'react';

export default function Toast({ message, ...props }) {
  /* 
    @Props
        message(string) : Toast에 띄울 메세지
 */
  const ref = useRef(null);
  const { toastStore } = useStores();
  useEffect(() => {
    const pid = setTimeout(() => {
      if (ref.current) {
        ref.current.style.display = 'none';
        toastStore.setHidden(true);
      }
    }, 2000);
    return () => {
      clearTimeout(pid);
    };
  }, [toastStore]);

  return (
    <>
      <div ref={ref} className='notice' {...props}>
        <p>{message}</p>
      </div>
      <style jsx>{`
        .notice {
          position: absolute;
          max-width: 80%;
          top: 80%;
          left: 50%;
          transform: translate(-50%, 0);
          animation: 0.85s 1.3s fadeOut linear;
          display: block;
          z-index: 4000;
          height: max-content;
        }

        .notice > p {
          padding: 4px 8px;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
