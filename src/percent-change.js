export function calculatePercentChange(currWeek, prevWeek, key) {
  if (isValidInteger(currWeek, prevWeek)) {
    return percentDiff(currWeek, prevWeek);
  } else if (isValidObject(currWeek, prevWeek, key)) {
    return percentDiff(currWeek[key], prevWeek[key]);
  }

  return 0;
}

export function diff(newNumber, oldNumber, key) {
  if (isValidInteger(newNumber, oldNumber)) {
    return newNumber - oldNumber;
  } else if (isValidObject(oldNumber, newNumber, key)) {
    return newNumber[key] - oldNumber[key];
  }
  return 0;
}

function percentDiff(newNumber, oldNumber) {
  if (newNumber === oldNumber) return 0;
  return Math.round(((newNumber - oldNumber) / oldNumber) * 100);
}

function isValidInteger(newNumber, oldNumber) {
  return Number.isInteger(newNumber) && Number.isInteger(oldNumber);
}

function isValidObject(newNumber, oldNumber, key) {
  return (
    key !== undefined &&
    newNumber &&
    Number.isInteger(newNumber[key]) &&
    oldNumber &&
    Number.isInteger(oldNumber[key])
  );
}
