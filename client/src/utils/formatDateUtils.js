export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNames = [
        'січ', 'лют', 'бер', 'квіт', 'трав', 'чер',
        'лип', 'сер', 'вер', 'жов', 'лист', 'груд'
    ];
    const month = monthNames[date.getUTCMonth()];
    const year = String(date.getUTCFullYear()).slice(-2);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
