export const GROUP1 = 'GROUP1'
export const EVENTS = {
  TEST1: {
    CLIENT: 'TEST1_CLIENT',
    SERVER: 'TEST1_SERVER',
    TO: '/TEST1_SERVER',
  },
  TEST2: {
    CLIENT: 'TEST2_CLIENT',
    SERVER: 'TEST2_SERVER',
    TO: '/TEST2_SERVER',
  },
  TEST3: {
    CLIENT: 'TEST3_CLIENT',
    SERVER: 'TEST3_SERVER',
    TO: '/TEST3_SERVER',
  },
  [GROUP1]: {
    TEST1: {
      CLIENT: `${GROUP1}/TEST1_CLIENT`,
      SERVER: `${GROUP1}/TEST1_SERVER`,
      TO: `/${GROUP1}/TEST1_SERVER`,
    },
  },
}
