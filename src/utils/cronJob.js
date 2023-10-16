import schedule from "node-schedule";
import userModel from "../../DB/Model/user.model.js";

export const deleteUnConfirmedEmails = function () {
  schedule.scheduleJob("* * 1 * *", async function () {
    await userModel.updateMany({ ConfirmEmail: false }, { isDeleted: true });
    console.log("deleted unconfirmed emails");
  });
};
