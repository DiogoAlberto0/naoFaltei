export interface IDaySchedule {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  restTimeInMinutes: number;
  isDayOff: boolean;
}
export interface ISchedule {
  sunday: IDaySchedule;
  monday: IDaySchedule;
  tuesday: IDaySchedule;
  wednesday: IDaySchedule;
  thursday: IDaySchedule;
  friday: IDaySchedule;
  saturday: IDaySchedule;
}

export type IScheduleArray = [keyof ISchedule, IDaySchedule][];
