export default function ChipButton({
  children,
  radius,
  bColor,
  tColor,
  color = 'default',
  padding,
  status,
  ...props
}) {
  /* 
    @Props
        children(React.NodeList) : 내부 콘텐츠
        radius(number | string) : border-radius 값
        bColor(string) : background-color 값
        tColor(string) : text color 값
        color(string) : default | active | dark (미리 세팅된 color 조합)
        padding(string) : 내부 padding 값
        status(string | number) : 상태 표시 하위 Chip에 들어갈 값
  */
  if (color === 'dark') {
    tColor = 'var(--neutrals-white)';
    bColor = 'var(--neutrals-grey-8-text)';
  } else if (color === 'active') {
    tColor = 'var(--neutrals-white)';
    bColor = 'var(--brand-primary)';
  }

  return (
    <>
      <div className='chip-wrapper' {...props}>
        {children}
        {status && status > 0 ? <div className='sub-chip'>{status}</div> : null}
      </div>
      <style jsx>{`
        .chip-wrapper {
          max-width: max-content;
          max-height: 32px;
          border-radius: ${radius ?? 16}px;
          background-color: ${bColor ?? 'var(--neutrals-grey-3)'};
          color: ${tColor ?? 'var(--neutrals-black)'};
          padding: ${padding ?? (status ? '5px 5px 5px 8px' : '8px')};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .sub-chip {
          margin-left: 5px;
          padding: 4px 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.75);
          color: var(--neutrals-black);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
