type Period = "day" | "week" | "month";

export const groupByPeriod = <T>(
  items: T[],
  getDate: (item: T) => Date,
  period: Period = "day",
): Record<string, number> => {
  return items.reduce(
    (acc, item) => {
      const date = new Date(getDate(item));

      let start: Date | undefined;
      let end: Date | undefined;

      if (period === "day") {
        start = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
          ),
        );
        end = new Date(start);
      }

      if (period === "week") {
        const day = date.getUTCDay(); // 0 = domingo
        const diffToMonday = day === 0 ? -6 : 1 - day;

        start = new Date(date);
        start.setUTCDate(date.getUTCDate() + diffToMonday);
        start.setUTCHours(0, 0, 0, 0);

        end = new Date(start);
        end.setUTCDate(start.getUTCDate() + 6);
      }

      if (period === "month") {
        start = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
        );
        end = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
        );
      }

      if (!start || !end) {
        throw new Error("Invalid period type");
      }

      const key =
        period === "day"
          ? `${start.toISOString()}`
          : `${start.toISOString()} - ${end.toISOString()}`;
      acc[key] = (acc[key] ?? 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );
};
