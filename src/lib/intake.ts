export const INTAKE_STORAGE_KEY = "aide-intake";

export type Intake = {
  name?: string;
  company?: string;
  email?: string;
  ask?: string;
  tools?: string[];
};

export function readIntake(): Intake {
  try {
    return JSON.parse(localStorage.getItem(INTAKE_STORAGE_KEY) ?? "{}") as Intake;
  } catch {
    return {};
  }
}
