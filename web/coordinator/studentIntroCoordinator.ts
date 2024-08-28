import bs58 from 'bs58';
import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';
import { StudentIntro } from '@/models/studentIntro';

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf';

export class StudentIntroCoordinator {
  static accounts: PublicKey[] = [];

  static async prefetchAccounts(connection: Connection, search: string) {
    const accounts = (await connection.getProgramAccounts(
      new PublicKey(STUDENT_INTRO_PROGRAM_ID),
      {
        dataSlice: { offset: 1, length: 12 },
        filters:
          search === ''
            ? []
            : [
                {
                  memcmp: {
                    offset: 5,
                    bytes: bs58.encode(Buffer.from(search)),
                  },
                },
              ],
      }
    )) as Array<{
      pubkey: PublicKey;
      account: AccountInfo<Buffer>;
    }>; // Explicitly define the expected structure

    accounts.sort((a, b) => {
      try {
        // Check if buffers are long enough to avoid out-of-bounds access
        const lengthA = a.account.data.readUInt32LE(0);
        const lengthB = b.account.data.readUInt32LE(0);

        if (
          a.account.data.length < 4 + lengthA ||
          b.account.data.length < 4 + lengthB
        ) {
          throw new Error('Buffer length is insufficient');
        }

        const dataA = a.account.data.subarray(4, 4 + lengthA);
        const dataB = b.account.data.subarray(4, 4 + lengthB);

        return dataA.compare(dataB);
      } catch (error) {
        console.error('Error sorting accounts: ', error);
        return 0; // Default sort order in case of error
      }
    });

    this.accounts = accounts.map((account) => account.pubkey);
  }

  static async fetchPage(
    connection: Connection,
    page: number,
    perPage: number,
    search: string,
    reload = false
  ): Promise<StudentIntro[]> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, search);
    }

    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * perPage,
      page * perPage
    );

    if (paginatedPublicKeys.length === 0) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      paginatedPublicKeys
    );

    const allStudentInfo = accounts.reduce(
      (accumulator: StudentIntro[], account) => {
        try {
          const studentInfo = StudentIntro.deserialize(account?.data);
          if (studentInfo) {
            accumulator.push(studentInfo);
          }
        } catch (error) {
          console.error('Error deserializing movie data: ', error);
        }
        return accumulator;
      },
      []
    );

    return allStudentInfo;
  }
}
