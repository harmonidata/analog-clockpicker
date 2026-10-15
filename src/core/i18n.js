/**
 * Time formatting, parsing, and Indonesian word description helpers
 */

const ANGKA_INDO = [
  'nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam',
  'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas'
];

export function formatTime12(hours, minutes, period) {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m} ${period}`;
}

export function formatTime24(hours, minutes, period, is24Mode = false) {
  let h24 = hours;
  if (!is24Mode) {
    if (period === 'AM') {
      h24 = hours === 12 ? 0 : hours;
    } else {
      h24 = hours === 12 ? 12 : hours + 12;
    }
  }
  const hStr = h24.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
}

export function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') {
    return { hours: 10, minutes: 30, period: 'AM', format24: false };
  }

  const trimmed = timeStr.trim();
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const p = match12[3] ? match12[3].toUpperCase() : (h >= 12 ? 'PM' : 'AM');
    if (!match12[3] && h > 12) {
      // 24-hour style format parsed into 12h
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return { hours: h12, minutes: m, period: 'PM', format24: false };
    }
    return { hours: h, minutes: m, period: p, format24: false };
  }

  return { hours: 10, minutes: 30, period: 'AM', format24: false };
}

export function getIndonesianTimeWord(h, m, period, is24 = false) {
  let hourNum = h;
  if (is24) {
    if (hourNum === 0) hourNum = 12;
    else if (hourNum > 12) hourNum -= 12;
  }
  const hourWord = ANGKA_INDO[hourNum] || hourNum;

  let waktuHari = 'pagi';
  if (!is24) {
    if (period === 'AM') {
      waktuHari = (h >= 11) ? 'siang' : 'pagi';
    } else {
      if (h === 12 || h < 3) waktuHari = 'siang';
      else if (h >= 3 && h < 6) waktuHari = 'sore';
      else waktuHari = 'malam';
    }
  } else {
    if (h >= 4 && h < 11) waktuHari = 'pagi';
    else if (h >= 11 && h < 15) waktuHari = 'siang';
    else if (h >= 15 && h < 18) waktuHari = 'sore';
    else waktuHari = 'malam';
  }

  let minuteWord = '';
  if (m === 0) {
    minuteWord = 'tepat';
  } else if (m === 15) {
    minuteWord = 'lewat seperempat';
  } else if (m === 30) {
    const nextHour = (hourNum % 12) + 1;
    minuteWord = 'setengah ' + (ANGKA_INDO[nextHour] || nextHour);
    return `Pukul ${minuteWord} ${waktuHari}`;
  } else if (m === 45) {
    const nextHour = (hourNum % 12) + 1;
    minuteWord = 'kurang seperempat menuju pukul ' + (ANGKA_INDO[nextHour] || nextHour);
    return `${minuteWord} ${waktuHari}`;
  } else {
    minuteWord = `lewat ${m} menit`;
  }

  return `Pukul ${hourWord} ${minuteWord} ${waktuHari}`;
}
