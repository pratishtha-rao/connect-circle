export function relativeDate(date: Date) {
  const now = new Date();

  const booking = new Date(date);

  const diff =
    booking.getTime() - now.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (Math.abs(minutes) < 60) {
    if (minutes >= 0) {
      return `in ${minutes} min`;
    }

    return `${Math.abs(minutes)} min ago`;
  }

  if (Math.abs(hours) < 24) {
    if (hours >= 0) {
      return `in ${hours} hr`;
    }

    return `${Math.abs(hours)} hr ago`;
  }

  if (Math.abs(days) < 7) {
    if (days >= 0) {
      return `in ${days} day${days === 1 ? "" : "s"}`;
    }

    return `${Math.abs(days)} day${
      Math.abs(days) === 1 ? "" : "s"
    } ago`;
  }

  return booking.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      booking.getFullYear() !==
      now.getFullYear()
        ? "numeric"
        : undefined,
  });
}