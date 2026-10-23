// Sizes in bytes, and dates, as displayed on the monitoring page

function formatSize(bytes) {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let value = bytes;
	let unit = 0;
	while (value >= 1000 && unit < units.length - 1) {
		value /= 1000;
		unit++;
	}
	return (unit === 0 ? value : value.toFixed(1)) + " " + units[unit];
}

function formatDate(isoDate) {
	return isoDate === null ? "never" : isoDate.substring(0, 10);
}

// YYYY-MM-DD of a date, days before today
function daysAgo(days) {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date.toISOString().substring(0, 10);
}

export {formatSize, formatDate, daysAgo};
