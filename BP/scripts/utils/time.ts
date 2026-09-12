type DurationReturn = { error: boolean; message: string } | number | string;

export function parseDurationString(durationString: string): DurationReturn {
    if (!durationString) {
        return { error: true, message: "§cEingabe darf nicht leer sein" };
    }

    if (durationString.startsWith("perma")) return "perma";

    const formatRegex = /^(\d+[ymdhYMDH]:)*\d+[ymdhYMDH]$/;
    if (!formatRegex.test(durationString)) {
        return {
            error: true,
            message: '§cUngültiges Dauerformat. Verwenden Sie das Format wie "1y:2m:3d:4h"',
        };
    }

    const durationArray = durationString.split(":");
    let durationMs = 0;

    for (const timeUnit of durationArray) {
        const unit = timeUnit.charAt(timeUnit.length - 1).toLowerCase();
        const value = parseInt(timeUnit.slice(0, -1), 10);

        if (isNaN(value) || value < 0) {
            return { error: true, message: `§cUngültiger Zahlenwert: ${timeUnit}` };
        }

        switch (unit) {
            case "y":
                durationMs += value * 365 * 24 * 60 * 60 * 1000;
                break;
            case "d":
                durationMs += value * 24 * 60 * 60 * 1000;
                break;
            case "h":
                durationMs += value * 60 * 60 * 1000;
                break;
            case "m":
                durationMs += value * 60 * 1000;
                break;
            default:
                return { error: true, message: `§cUngültige Zeiteinheit: ${unit}` };
        }
    }

    const maxDuration = 100 * 365 * 24 * 60 * 60 * 1000;
    if (durationMs > maxDuration) {
        return {
            error: true,
            message: "§cGesamtdauer überschreitet das maximal zulässige (100 Jahre)",
        };
    }

    const futureDate = new Date(Date.now() + durationMs);
    return futureDate.valueOf();
}
