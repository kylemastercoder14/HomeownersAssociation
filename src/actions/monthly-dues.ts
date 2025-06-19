"use server";

import { DueFormValues } from "@/validators/dues";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { $Enums, DueType } from "@prisma/client";

// Utility function to check if household exists
async function validateHousehold(householdId: string) {
  const household = await db.household.findUnique({
    where: { id: householdId },
    select: { id: true, status: true },
  });

  if (!household) {
    return { valid: false, message: "Household does not exist" };
  }
  if (household.status !== "Active") {
    return { valid: false, message: "Household is not active" };
  }
  return { valid: true };
}

// Validate water bill specific fields
function validateWaterBillFields(data: DueFormValues) {
  if (data.type === "WATER_BILL") {
    if (data.meterReading === undefined || data.previousReading === undefined) {
      return {
        valid: false,
        message: "Meter readings are required for water bills",
      };
    }
    if (data.meterReading < 0 || data.previousReading < 0) {
      return { valid: false, message: "Meter readings cannot be negative" };
    }
    if (data.meterReading < data.previousReading) {
      return {
        valid: false,
        message: "Current reading cannot be less than previous reading",
      };
    }
  }
  return { valid: true };
}

// Check for duplicate dues (same household, type, fiscal period)
async function checkForDuplicateDue(
  householdId: string,
  type: DueType,
  fiscalMonth: number,
  fiscalYear: number,
  excludeId?: string
) {
  const existingDue = await db.due.findFirst({
    where: {
      householdId,
      type,
      fiscalMonth,
      fiscalYear,
      id: { not: excludeId },
    },
  });

  if (existingDue) {
    return {
      valid: false,
      message: `A ${type
        .toLowerCase()
        .replace(
          "_",
          " "
        )} already exists for this household and fiscal period`,
    };
  }
  return { valid: true };
}

function validateDueDate(dueDate: Date, type: DueType) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // For arrears and penalties, past dates are allowed
  if (["ARREARAGES", "PENALTY"].includes(type)) {
    return { valid: true };
  }

  // For other types, due date must be today or in the future
  const dueDateNormalized = new Date(dueDate);
  dueDateNormalized.setHours(0, 0, 0, 0);

  if (dueDateNormalized < today) {
    return {
      valid: false,
      message: "Due date cannot be in the past for this due type",
    };
  }

  return { valid: true };
}

// Validate fiscal period
function validateFiscalPeriod(month: number, year: number) {
  if (month < 1 || month > 12) {
    return { valid: false, message: "Fiscal month must be between 1 and 12" };
  }
  if (year < 2000 || year > 2100) {
    return {
      valid: false,
      message: "Fiscal year must be between 2000 and 2100",
    };
  }
  return { valid: true };
}

// Validate amount based on due type
function validateAmount(type: DueType, amount: number) {
  const minimumAmounts = {
    MONTHLY_DUES: 100,
    WATER_BILL: 50,
    ELECTRICITY: 50,
    SPECIAL_ASSESSMENT: 1,
    ARREARAGES: 1,
    PENALTY: 1,
  };

  if (amount <= 0) {
    return { valid: false, message: "Amount must be greater than 0" };
  }

  const minimum = minimumAmounts[type] || 1;
  if (amount < minimum) {
    return {
      valid: false,
      message: `Amount for ${type
        .toLowerCase()
        .replace("_", " ")} must be at least ${minimum}`,
    };
  }

  return { valid: true };
}

export const createMonthlyDue = async (data: DueFormValues) => {
  try {
    // Step 1: Validate household
    const householdValidation = await validateHousehold(data.householdId);
    if (!householdValidation.valid) {
      return { success: false, message: householdValidation.message };
    }

    // Step 2: Validate water bill fields if applicable
    const waterBillValidation = validateWaterBillFields(data);
    if (!waterBillValidation.valid) {
      return { success: false, message: waterBillValidation.message };
    }

    // Step 3: Check for duplicate dues
    const duplicateValidation = await checkForDuplicateDue(
      data.householdId,
      data.type,
      data.fiscalMonth,
      data.fiscalYear
    );
    if (!duplicateValidation.valid) {
      return { success: false, message: duplicateValidation.message };
    }

    // Step 4: Validate fiscal period
    const fiscalValidation = validateFiscalPeriod(
      data.fiscalMonth,
      data.fiscalYear
    );
    if (!fiscalValidation.valid) {
      return { success: false, message: fiscalValidation.message };
    }

    // Step 5: Validate amount
    const amountValidation = validateAmount(data.type, data.amount);
    if (!amountValidation.valid) {
      return { success: false, message: amountValidation.message };
    }

    // Step 6: Validate due date is not in the past (except for arrears/penalties)
    const dueDateValidation = validateDueDate(data.dueDate, data.type);
    if (!dueDateValidation.valid) {
      return {
        success: false,
        message: dueDateValidation.message,
      };
    }

    // All validations passed - create the due
    const due = await db.due.create({
      data: {
        householdId: data.householdId,
        amount: data.amount,
        dueDate: data.dueDate,
        fiscalMonth: data.fiscalMonth,
        fiscalYear: data.fiscalYear,
        description: data.description,
        status: data.status,
        lateFee: data.lateFee,
        type: data.type,
        meterReading: data.type === "WATER_BILL" ? data.meterReading : null,
        previousReading:
          data.type === "WATER_BILL" ? data.previousReading : null,
      },
    });

    // Create corresponding ledger entry
    await db.ledger.create({
      data: {
        householdId: data.householdId,
        transactionDate: new Date(),
        description: `Due created: ${data.type}`,
        debit: data.amount,
        balance: data.amount, // Initial balance equals the due amount
        referenceType: "DUE",
        referenceId: due.id,
      },
    });

    return {
      success: true,
      message: "Due created successfully",
      data: due,
    };
  } catch (error) {
    console.error("Error creating due:", error);
    return {
      success: false,
      message: "Failed to create due",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateMonthlyDue = async (id: string, data: DueFormValues) => {
  try {
    // Step 1: Check if due exists
    const existingDue = await db.due.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!existingDue) {
      return { success: false, message: "Due not found" };
    }

    // Step 2: Validate household
    const householdValidation = await validateHousehold(data.householdId);
    if (!householdValidation.valid) {
      return { success: false, message: householdValidation.message };
    }

    // Step 3: Validate water bill fields if applicable
    const waterBillValidation = validateWaterBillFields(data);
    if (!waterBillValidation.valid) {
      return { success: false, message: waterBillValidation.message };
    }

    // Step 4: Check for duplicate dues (excluding current due)
    const duplicateValidation = await checkForDuplicateDue(
      data.householdId,
      data.type,
      data.fiscalMonth,
      data.fiscalYear,
      id
    );
    if (!duplicateValidation.valid) {
      return { success: false, message: duplicateValidation.message };
    }

    // Step 5: Validate fiscal period
    const fiscalValidation = validateFiscalPeriod(
      data.fiscalMonth,
      data.fiscalYear
    );
    if (!fiscalValidation.valid) {
      return { success: false, message: fiscalValidation.message };
    }

    // Step 6: Validate amount
    const amountValidation = validateAmount(data.type, data.amount);
    if (!amountValidation.valid) {
      return { success: false, message: amountValidation.message };
    }

    // Step 7: Prevent updates if payments exist and certain fields are changed
    if (existingDue.payments.length > 0) {
      const protectedFields = ["amount", "type", "fiscalMonth", "fiscalYear"];
      const changedFields = protectedFields.filter(
        (field) =>
          existingDue[field as keyof typeof existingDue] !==
          data[field as keyof typeof data]
      );

      if (changedFields.length > 0) {
        return {
          success: false,
          message: `Cannot modify ${changedFields.join(
            ", "
          )} after payments have been made`,
        };
      }
    }

    // All validations passed - update the due
    const due = await db.due.update({
      where: { id },
      data: {
        householdId: data.householdId,
        amount: data.amount,
        dueDate: data.dueDate,
        fiscalMonth: data.fiscalMonth,
        fiscalYear: data.fiscalYear,
        description: data.description,
        status: data.status,
        lateFee: data.lateFee,
        type: data.type,
        meterReading: data.type === "WATER_BILL" ? data.meterReading : null,
        previousReading:
          data.type === "WATER_BILL" ? data.previousReading : null,
      },
    });

    // Update corresponding ledger entry if amount changed
    if (existingDue.amount !== data.amount) {
      await db.ledger.updateMany({
        where: {
          referenceType: "DUE",
          referenceId: id,
        },
        data: {
          debit: data.amount,
          balance:
            data.amount -
            existingDue.payments.reduce((sum, p) => sum + p.amount, 0),
        },
      });
    }

    return {
      success: true,
      message: "Due updated successfully",
      data: due,
    };
  } catch (error) {
    console.error("Error updating due:", error);
    return {
      success: false,
      message: "Failed to update due",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const handleDueFormSubmit = async (
  data: DueFormValues,
  initialData?: { id: string } | null
) => {
  try {
    let result:
      | {
          success: boolean;
          message: string | undefined;
          data?: undefined;
          error?: undefined;
        }
      | {
          success: boolean;
          message: string;
          data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: $Enums.DueType;
            status: $Enums.DueStatus;
            householdId: string;
            amount: number;
            dueDate: Date;
            fiscalMonth: number;
            fiscalYear: number;
            description: string | null;
            lateFee: number;
            meterReading: number | null;
            previousReading: number | null;
          };
          error?: undefined;
        }
      | { success: boolean; message: string; error: string; data?: undefined };

    if (initialData?.id) {
      result = await updateMonthlyDue(initialData.id, data);
    } else {
      result = await createMonthlyDue(data);
    }

    if (!result.success) {
      return result;
    }

    revalidatePath("/admin/monthly-dues");

    return result;
  } catch (error) {
    console.error("Error handling due form submission:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
