import fetchPayoutData from "../../utils/fetchPayoutData";
import { QueryGetUserPayoutsArgs, User } from "../../types/types";

const resolver = {
  Query: {
    async getUserPayouts(
      _: any,
      { sort }: QueryGetUserPayoutsArgs,
      _ctx: any
    ): Promise<User[]> {
      const users = await fetchPayoutData();

      if (sort === "ASCENDING") {
        users?.length > 0 &&
          users.sort((a: any, b: any) => a.gross_pay - b.gross_pay);
      } else {
        users?.length > 0 &&
          users.sort((a: any, b: any) => b.gross_pay - a.gross_pay);
      }

      const response: User[] =
        users?.length > 0
          ? users.map((user: any) => {
              return {
                name: user.full_name,
                phoneNumber: user.phone_number,
                email: user.email,
                grossPay: user.gross_pay,
                employers: [user.employer],
              };
            })
          : [];

      return response;
    },
  },
};

export default resolver;
