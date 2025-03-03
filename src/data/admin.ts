import db from "@/lib/db";

export const getEmployeeByEmail = async (email: string) => {
  try {
    const employee = await db.admin.findFirst({
      where: {
        email,
      },
    });
    return employee;
  } catch {
    return;
  }
};
