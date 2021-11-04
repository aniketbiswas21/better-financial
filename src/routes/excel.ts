import { Request, Response, Router } from "express";
import Excel from "exceljs";
import fetchPayoutData from "../utils/fetchPayoutData";

const router = Router();

router.get("/payoutExcel", async (req: Request, res: Response) => {
  try {
    const fileName = "payout_data.xlsx";
    let sortOrder = "DESCENDING";

    if (req.query.sort === "ASCENDING") {
      sortOrder = "ASCENDING";
    }

    const users = await fetchPayoutData();

    if (sortOrder === "ASCENDING") {
      users?.length > 0 &&
        users.sort((a: any, b: any) => a.gross_pay - b.gross_pay);
    } else {
      users?.length > 0 &&
        users.sort((a: any, b: any) => b.gross_pay - a.gross_pay);
    }

    console.log("[APP] Generating Excel");

    let workbook = new Excel.Workbook();

    let worksheetObj = await workbook.addWorksheet("payout");
    worksheetObj.columns = [
      { header: "Full Name", key: "full_name", width: 20 },
      { header: "Phone Number", key: "phone_number", width: 20 },
      { header: "Email", key: "email", width: 20 },
      { header: "Gross Pay", key: "gross_pay", width: 20 },
      { header: "Employer", key: "employer", width: 20 },
    ];

    for (const user of users) {
      worksheetObj.addRow({
        full_name: user.full_name,
        phone_number: user.phone_number,
        email: user.email,
        gross_pay: user.gross_pay,
        employer: user.employer,
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

    return workbook.xlsx.write(res).then(function () {
      res.end();
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
