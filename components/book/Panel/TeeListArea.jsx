import TeeItem from '@/components/book/Panel/TeeItem';

export const TeeListArea = ({ registered, list, handleWarnPopup }) => {
  return (
    <>
      <div className='list_Golfarea'>
        <ul>
          {list?.map((tee, i) => (
            <TeeItem
              handleWarnPopup={handleWarnPopup}
              key={tee.id}
              registered={registered}
              {...tee}
            />
          ))}
        </ul>
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default TeeListArea;
