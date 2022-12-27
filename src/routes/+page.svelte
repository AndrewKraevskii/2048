<script lang="ts">
	import { Game } from '$lib/logic/store';
	import { onMount } from 'svelte';
	const game = new Game();

    function handle(e: KeyboardEvent) {
        if (e.key === 'ArrowUp') {
            game.Move("up");
        } else if (e.key === 'ArrowDown') {
            game.Move("down");
        } else if (e.key === 'ArrowLeft') {
            game.Move("left");
        } else if (e.key === 'ArrowRight') {
            game.Move("right");
        }
    }
</script>
<svelte:body on:keydown={handle} />
<table>
	{#each $game.AsArray() as arr}
	<tr>
        {#each arr as cell}
        <td><div class="cell">{cell}</div></td>
		{/each}
    </tr>	
    {/each}
</table>


