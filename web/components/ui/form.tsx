import { FC, FormEvent, useState } from 'react';
import { StudentIntro } from '@/models/studentIntro';

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf';

export const Form: FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const studentIntro = new StudentIntro(name, message);
    handleTransactionSubmit(studentIntro);
  };

  const handleTransactionSubmit = async (studentIntro: StudentIntro) => {
    try {
      console.log(studentIntro);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="py-4 px-6 max-w-[450px] flex items-center justify-center flex-col border border-gray-700 rounded-lg bg-gray-800 text-white"
    >
      <div className="mb-4">
        <label className="block text-gray-400 mb-2" htmlFor="title">
          What do we call you?
        </label>
        <input
          id="name"
          className="p-2 w-[400px] bg-gray-700 border border-gray-600 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 mb-2" htmlFor="review">
          What brings you to Solana, friend?
        </label>
        <textarea
          id="message"
          className="w-[400px] p-2 bg-gray-700 border border-gray-600 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-[400px] p-2 bg-green-600 hover:bg-green-700 rounded"
      >
        Submit Review
      </button>
    </form>
  );
};
