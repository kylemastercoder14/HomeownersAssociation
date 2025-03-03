import {
  CheckCircle,
  CircleOff,
  HelpCircle,
  Mars,
  Timer,
  Venus,
} from "lucide-react";

export const statuses = [
  {
    value: "Default",
    label: "Default",
    icon: HelpCircle,
  },
  {
    value: "Pending",
    label: "Pending",
    icon: Timer,
  },
  {
    value: "Approved",
    label: "Approved",
    icon: CheckCircle,
  },
  {
    value: "Rejected",
    label: "Rejected",
    icon: CircleOff,
  },
];

export const availability = [
  {
    value: "In stock",
    label: "In stock",
  },
  {
    value: "Out of stock",
    label: "Out of stock",
  },
];

export const gender = [
  {
    value: "Male",
    label: "Male",
    icon: Mars,
  },
  {
    value: "Female",
    label: "Female",
    icon: Venus,
  },
];
