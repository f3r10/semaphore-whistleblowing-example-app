import Image from 'next/image';
import fileSearching from '../../../public/file-searching.gif';

export default function Card({
  address,
  imgSrc,
  imgAlt,
  leakTitle,
  timeLeft,
  tags,
  newCard,
}) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gradient-to-br from-purple-800 via-violet-900 to-purple-800 h-full">
      <Image
        className="w-full"
        src={imgSrc || fileSearching}
        alt={imgAlt || 'fileSearching'}
        height={imgSrc ? undefined : 360}
        width={imgSrc ? undefined : 480}
      />
      <div className="px-6 py-4">
        {newCard ? (
          <div className="text-white font-bold text-xl text-center mt-24">
            Add new leak
          </div>
        ) : (
          <>
            <div className="font-bold text-xl mb-2 text-white">
              {leakTitle}
            </div>
            {address && (
              <p className="text-yellow-500 text-base break-all">
                Leak at {address}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
