"use server";

import { HouseholdFormValues } from "@/validators/household";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createHouseHold = async (data: HouseholdFormValues) => {
  try {
    // First, create the household
    const household = await db.household.create({
      data: {
        block: data.block,
        lot: data.lot,
        type: data.type,
        status: data.status,
        address: data.address,
        seniorCitizenCount: data.seniorCitizenCount,
        pwdCount: data.pwdCount,
        soloParentCount: data.soloParentCount,
        headId: data.headId,
      },
    });

    // Then update all selected residents to link them to this household
    await db.residents.updateMany({
      where: {
        id: {
          in: data.residentIds,
        },
      },
      data: {
        householdId: household.id,
      },
    });

    // Revalidate any paths that show household data
    revalidatePath("/admin/household-registration");
    revalidatePath(`/admin/household-registration/${household.id}`);

    return { success: true, household };
  } catch (error) {
    console.error("Error creating household:", error);
    return { success: false, error: "Failed to create household" };
  }
};

export const updateHouseHold = async (
  data: HouseholdFormValues,
  householdId: string
) => {
  if (!householdId) {
    return { success: false, error: "Household ID is required" };
  }

  try {
    // First, update the household
    const household = await db.household.update({
      where: {
        id: householdId,
      },
      data: {
        block: data.block,
        lot: data.lot,
        type: data.type,
        status: data.status,
        address: data.address,
        seniorCitizenCount: data.seniorCitizenCount,
        pwdCount: data.pwdCount,
        soloParentCount: data.soloParentCount,
        headId: data.headId,
      },
    });

    // Get current residents of this household
    const currentResidents = await db.residents.findMany({
      where: {
        householdId: household.id,
      },
      select: {
        id: true,
      },
    });

    const currentResidentIds = currentResidents.map((r) => r.id);

    // Residents to remove from this household (in current but not in new selection)
    const residentsToRemove = currentResidentIds.filter(
      (id) => !data.residentIds.includes(id)
    );

    // Residents to add to this household (in new selection but not in current)
    const residentsToAdd = data.residentIds.filter(
      (id) => !currentResidentIds.includes(id)
    );

    // Update all residents that need to be removed
    if (residentsToRemove.length > 0) {
      await db.residents.updateMany({
        where: {
          id: {
            in: residentsToRemove,
          },
        },
        data: {
          householdId: null,
        },
      });
    }

    // Update all residents that need to be added
    if (residentsToAdd.length > 0) {
      await db.residents.updateMany({
        where: {
          id: {
            in: residentsToAdd,
          },
        },
        data: {
          householdId: household.id,
        },
      });
    }

    // Revalidate any paths that show household data
    revalidatePath("/admin/household-registration");
    revalidatePath(`/admin/household-registration/${household.id}`);

    return { success: true, household };
  } catch (error) {
    console.error("Error updating household:", error);
    return { success: false, error: "Failed to update household" };
  }
};
