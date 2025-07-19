<script lang="ts">
  import { onMount } from 'svelte';
  
  let stats = {
    today_uv: 0,
    today_pv: 0,
    yesterday_uv: 0,
    yesterday_pv: 0,
    last_month_pv: 0,
    last_year_pv: 0
  };
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('https://um-api.fis.ink/blog/');
      if (!response.ok) throw new Error('Network response was not ok');
      stats = await response.json();
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  });
</script>

<div class="pb-4 card-base card-shadow onload-animation" style="animation-delay: 250ms">
  <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">访问统计</div>
  
  <div id="visitor-stats" class="px-4 overflow-hidden">
    {#if loading}
      <div class="text-sm text-gray-500">加载中...</div>
    {:else if error}
      <div class="text-sm text-red-500">加载失败: {error.message}</div>
    {:else}
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span>今日访客:</span>
          <span>{stats.today_uv}</span>
        </div>
        <div class="flex justify-between">
          <span>今日访问:</span>
          <span>{stats.today_pv}</span>
        </div>
        <div class="flex justify-between">
          <span>昨日访客:</span>
          <span>{stats.yesterday_uv}</span>
        </div>
        <div class="flex justify-between">
          <span>昨日访问:</span>
          <span>{stats.yesterday_pv}</span>
        </div>
        <div class="flex justify-between">
          <span>本月访问:</span>
          <span>{stats.last_month_pv}</span>
        </div>
        <div class="flex justify-between">
          <span>今年访问:</span>
          <span>{stats.last_year_pv}</span>
        </div>
      </div>
    {/if}
  </div>
</div>