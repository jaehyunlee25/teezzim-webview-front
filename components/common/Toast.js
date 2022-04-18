import { useEffect, useRef } from 'react';

export default function Toast({ message, ...props }) {
  /* 
    @Props
        message(string) : Toast에 띄울 메세지
 */
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = 'block';
      ref.current.style.animation = '0.5s 1.5s fadeOut linear';
    }
    const pid = setTimeout(() => {
      if (ref.current) {
        ref.current.style.display = 'none';
      }
    }, 2000);
    return () => clearTimeout(pid);
  }, []);

  return (
    <>
      <div ref={ref} className='notice' {...props}>
        <p>{message}</p>
      </div>
      <style jsx>{`
        .notice {
          bottom: 15%;
          left: 50%;
          transform: translate(-50%, 0);
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
