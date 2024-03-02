<script lang="ts">
	import { getDoomsdayOfMonth } from '$lib/date';
	import { daysOfWeek } from '$lib/solution';

	const startDate = new Date('1900-01-01');
	const endDate = new Date();
	const difference = endDate.getTime() - startDate.getTime();

	let date = $state<Date | null>(null);

	const weekday = $derived(date?.toLocaleString('en', { weekday: 'long' }));

	const solution = $derived.by(() => {
		if (!date) return undefined;

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
			yearInCentury,
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

	const formatDate = (d: Date) => {
		const day = String(d.getDate()).padStart(2, '0');
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const year = d.getFullYear();

		return `${year}-${month}-${day}`;
	};
</script>

<div class="container">
	<h1>Doomsday method</h1>

	<p><button onclick={generateDate}>Generate random day</button></p>
	<input
		type="date"
		min="1900-01-01"
		max="2099-12-31"
		value={date ? formatDate(date) : null}
		onchange={(e) => (date = e.currentTarget.valueAsDate)}
	/>

	{#if !!date}
		<!-- Solution path -->
		{#if !!solution}
			<p>
				<button onclick={() => (isSolutionRevealed = !isSolutionRevealed)}
					>{isSolutionRevealed ? 'Hide' : 'Show'} solution path</button
				>
			</p>
			{#if isSolutionRevealed}
				<h2>Calculating year doomsday</h2>
				<p>12 fits {solution.twelve} times into {solution.yearInCentury}.</p>
				<p>The rest (modulo 12) is {solution.moduloTwelve}.</p>
				<p>4 fits {solution.fourInRest} times into {solution.moduloTwelve}.</p>
				<p>The century doomsday for {solution.century} is {solution.centuryDoomsday}.</p>

				<p>
					Calculated doomsday for {date.getFullYear()}:
					<span class="no-wrap"
						>({solution.twelve} + {solution.moduloTwelve} + {solution.fourInRest}
						+
						{solution.centuryDoomsday}) % 7 = {solution.doomsday} ({daysOfWeek[
							solution.doomsday
						]})</span
					>
				</p>

				<h2>Extrapolate to the day</h2>

				<p>
					Doomsday for {date.toLocaleString('en', { month: 'long' })}: {getDoomsdayOfMonth(date)}.
				</p>

				<p>
					{date.toLocaleString('en', { month: 'long' })}
					{getDoomsdayOfMonth(date)}. is a {daysOfWeek[solution.doomsday]}.
				</p>

				<p>
					{date.toLocaleString('en', { month: 'long', day: 'numeric' })} is a {daysOfWeek[
						(solution.doomsday + date.getDate() - getDoomsdayOfMonth(date) + 35) % 7
					]}.
				</p>
			{/if}
		{/if}

		<!-- Weekday -->
		{#if !!weekday}
			<button onclick={() => (isWeekdayRevealed = !isWeekdayRevealed)}
				>{isWeekdayRevealed ? 'Hide' : 'Show'} weekday</button
			>
			{#if isWeekdayRevealed}
				<p>{weekday}</p>
			{/if}
		{/if}
	{/if}
</div>

<style lang="scss">
	button {
		padding: 0.5rem 1rem;
		@media (max-width: 600px) {
			width: 100%;
		}
	}

	.container {
		margin-inline: auto;
		width: min(40rem, calc(100vw - 2rem));
	}

	.no-wrap {
		white-space: nowrap;
	}
</style>
