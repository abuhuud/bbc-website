/**
 * Date formatting helpers for Indonesian locale
 */
function formatDateIndo(dateStr) {
    if (!dateStr) return '';
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${day} ${months[monthIndex]} ${year}`;
}

function getDayMonthParts(dateStr) {
    if (!dateStr) return { day: '00', month: 'BBC', year: '2026' };
    const monthsShort = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { day: '00', month: 'BBC', year: '2026' };
    const monthIdx = parseInt(parts[1], 10) - 1;
    return {
        day: String(parseInt(parts[2], 10)).padStart(2, '0'),
        month: monthsShort[monthIdx] || 'BBC',
        year: parts[0]
    };
}