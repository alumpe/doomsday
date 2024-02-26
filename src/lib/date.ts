export const doomsdaysPerMonth: Record<string, number> = {
	1: 3,
	2: 0,
	3: 0,
	4: 4,
	5: 9,
	6: 6,
	7: 11,
	8: 8,
	9: 5,
	10: 10,
	11: 7,
	12: 12
};

export class DDate extends Date {
	constructor(date: Date | string | number) {
		super(date);
	}

	isWithinLeapYear() {
		const year = this.getFullYear();
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	getDoomsdayOfMonth() {
		if (this.isWithinLeapYear()) {
			if (this.getMonth() + 1 === 1) {
				return 4;
			}
			if (this.getMonth() + 1 === 2) {
				return 29;
			}
		}

		switch (this.getMonth() + 1) {
			case 1:
				return 3;
			case 2:
				return 28;
			case 3:
				return 0;
			case 4:
				return 4;
			case 5:
				return 9;
			case 6:
				return 6;

			case 7:
				return 11;
			case 8:
				return 8;
			case 9:
				return 5;
			case 10:
				return 10;
			case 11:
				return 7;
			case 12:
				return 12;
			default:
				throw new Error('Invalid month');
		}
	}
}
