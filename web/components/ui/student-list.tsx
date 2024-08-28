import { FC, useState, useEffect } from 'react';
import { Card } from './card';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { StudentIntroCoordinator } from '@/coordinator/studentIntroCoordinator';
import { StudentIntro } from '@/models/studentIntro';

export const StudentList: FC = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = new Connection(clusterApiUrl('devnet'));
  const [studentIntros, setStudentIntros] = useState<StudentIntro[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    StudentIntroCoordinator.fetchPage(
      connection,
      page,
      5,
      search,
      search !== ''
    ).then(setStudentIntros);
  }, [page, search, connection]);

  return (
    <div className="py-5 flex flex-col w-fullitems-center justify-center">
      <input
        id="search"
        className="w-[300px] p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-400"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />

      {studentIntros.map((studentIntro, i) => (
        <Card key={i} studentIntro={studentIntro} />
      ))}

      <div className="flex justify-between mt-4">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-6 py-2 bg-gray-300 text-black font-semibold rounded"
          >
            Previous
          </button>
        )}
        {studentIntros.length === 5 && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 bg-gray-300 text-black font-semibold rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
