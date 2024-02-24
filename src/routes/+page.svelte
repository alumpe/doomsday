<script lang="ts">
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const startDate = new Date('1900-01-01');
	const endDate = new Date('2024-01-01');
	const difference = endDate.getTime() - startDate.getTime();

	let date = $state<Date | undefined>(undefined);

	let weekday = $derived(date && daysOfWeek[date.getDay()]);

	let solution = $derived.by(() => {
		if (date === undefined) return undefined;

		const century = date.getFullYear() - (date.getFullYear() % 100);
		const centuryDoomsday = (() => {
			if (century === 1900) return 3;
			if (century === 2000) return 2;
			throw new Error('Century doomsday not implemented');
		})();

		const yearInCentury = date.getFullYear() % 100;

		const twelve = Math.floor(yearInCentury / 12);
		const moduloTwelve = yearInCentury % 12;
		const fourInRest = Math.floor(moduloTwelve / 4);

		const doomsday = (twelve + moduloTwelve + fourInRest + centuryDoomsday) % 7;

		return {
			century,
			centuryDoomsday,
			twelve,
			moduloTwelve,
			fourInRest,
			doomsday
		};
	});

	let isSolutionRevealed = $state(false);
	let isWeekdayRevealed = $state(false);

	function generateDate() {
		const randomTime = Math.random() * difference;
		date = new Date(Math.floor(startDate.getTime() + randomTime));
	}
</script>

<h1>Doomsday method</h1>

<button onclick={generateDate}>Generate</button>

{#if date !== undefined}
	<p>
		{date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}
	</p>
{/if}

<!-- Solution path -->
{#if solution !== undefined}
	<button onclick={() => (isSolutionRevealed = !isSolutionRevealed)}
		>{isSolutionRevealed ? 'Hide' : 'Show'} solution path</button
	>
	{#if isSolutionRevealed}
		<p>
			Calculated doomsday: ({solution.twelve} + {solution.moduloTwelve} + {solution.fourInRest} + {solution.centuryDoomsday})
			% 7 = {solution.doomsday}
		</p>
		<p>{daysOfWeek[solution.doomsday]}</p>
	{/if}
{/if}

<!-- Weekday -->
{#if weekday !== undefined}
	<button onclick={() => (isWeekdayRevealed = !isWeekdayRevealed)}
		>{isWeekdayRevealed ? 'Hide' : 'Show'} weekday</button
	>
	{#if isWeekdayRevealed}
		<p>{weekday}</p>
	{/if}
{/if}
