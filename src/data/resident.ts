import db from "@/lib/db";

export const getResidentByEmail = async (email: string) => {
  try {
    const resident = await db.residents.findFirst({
      where: {
        email,
      },
    });
    return resident;
  } catch {
    return;
  }
};
