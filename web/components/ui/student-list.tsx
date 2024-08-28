import { FC, useState, useEffect } from 'react';
import { Card } from './card';
import { StudentIntro } from '@/models/studentIntro';

export const StudentList: FC = () => {
  const [studentIntros, setStudentIntros] = useState<StudentIntro[]>([]);

  useEffect(() => {
    setStudentIntros(StudentIntro.mocks);
  }, []);

  return (
    <div className="py-5 flex flex-col w-fullitems-center justify-center">
      {studentIntros.map((studentIntro, i) => (
        <Card key={i} studentIntro={studentIntro} />
      ))}
    </div>
  );
};
