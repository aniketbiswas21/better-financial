import axios from "./axios";

let fetchUrl = "/payouts?limit=200";
const finalData: any[] = [];

export default async function fetchPayoutData(): Promise<any> {
  try {
    const payouts = await axios.get(`${fetchUrl}`);

    if (payouts.status !== 200) {
      throw new Error(payouts.statusText);
    }

    const promiseArr: Promise<any>[] = [];

    for (const payout of (payouts.data as any).results as any[]) {
      promiseArr.push(
        axios
          .get(`profiles?account=${payout.account}`)
          .catch(() => console.log("not found"))
      );
    }

    const profiles = await Promise.all(promiseArr);

    for (const payout of (payouts.data as any).results as any[]) {
      for (const item of profiles) {
        if (!item || !item.data) continue;

        const profile = (item as any).data.results.find(
          (profile: any) => profile.account === payout.account
        );

        if (!profile) continue;

        finalData.push({ ...profile, ...payout });
      }
    }

    if ((payouts as any).next) {
      fetchUrl = (payouts as any).next.split("v1")[1] + "&limit=200";
      fetchPayoutData();
    }

    const final = finalData.filter(
      (v, i, a) => a.findIndex((t) => t.email === v.email) === i
    );

    return final;
  } catch (e) {
    console.error(e);
  }
}
