const DateButton = ({ date, count, className, onClick, ...others }) => {
  const dateText = date?.split('-')[2];
  const day = new Date(date).getUTCDay();
  const classes = className ?? '';
  return (
    <>
      <button className={day === 0 ? 'sunday ' + classes : classes} {...others}>
        <time dateTime={date ?? ''} onClick={onClick}>
          {dateText ?? <>&nbsp;</>}
        </time>
        <p className='number'>
          {count ? (
            <>
              <strong>{count}</strong>T
            </>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </button>
      <style jsx>{`
        button:hover,
        button:focus {
          background-color: initial;
          color: initial;
          border-radius: 0px;
        }
        button:hover .number,
        button:focus .number {
          color: initial;
        }

        button.on {
          background-color: var(--brand-primary);
          color: var(--neutrals-white);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default DateButton;
