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
  let retryCount = 0;
  const maxRetries = 1; // 减少重试次数
  const timeout = 3000; // 减少超时时间到3秒

  async function fetchStats() {
    try {
      console.log('开始获取访问统计数据...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch('https://um-api.fis.ink/blog/', {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // 添加缓存控制
        cache: 'no-cache'
      }).catch(err => {
        console.error('Fetch请求失败:', err);
        throw err;
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('API响应异常:', response.status, response.statusText);
        throw new Error(`API响应异常: ${response.status}`);
      }
      
      const data = await response.json().catch(err => {
        console.error('JSON解析失败:', err);
        throw new Error('数据格式错误');
      });
      
      console.log('成功获取访问统计数据:', data);
      stats = data;
      error = null; // 清除错误状态
    } catch (err) {
      console.error('获取访问统计数据错误:', err);
      
      if (err.name === 'AbortError') {
        error = new Error('请求超时');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        error = new Error('网络连接失败');
      } else if (err.message.includes('API响应异常')) {
        error = new Error('服务暂时不可用');
      } else {
        error = new Error('加载失败');
      }
      
      // 只在第一次失败时重试
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`准备第 ${retryCount} 次重试...`);
        // 延迟重试
        setTimeout(() => fetchStats(), 1000);
        return;
      }
    } finally {
      loading = false;
      console.log('加载状态结束，当前状态:', { loading, error });
    }
  }

  onMount(() => {
    fetchStats();
    
    // 确保在5秒后停止加载状态
    setTimeout(() => {
      if (loading) {
        loading = false;
        if (!error) {
          error = new Error('加载超时');
        }
      }
    }, 5000);
  });
</script>

<div class="pb-4 card-base card-shadow onload-animation" style="animation-delay: 250ms">
  <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">访问统计</div>
  
  <div id="visitor-stats" class="px-4 overflow-hidden">
    {#if loading}
      <div class="text-sm text-gray-500 py-2">
        <div class="flex items-center justify-center">
          <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </div>
      </div>
    {:else if error}
      <div class="text-sm py-2">
        <div class="flex items-center justify-center text-gray-500 dark:text-gray-400">
          <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          统计服务暂时不可用
        </div>
        <div class="text-center mt-2">
          <button 
            class="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            on:click={() => { loading = true; error = null; retryCount = 0; fetchStats(); }}
          >
            重新加载
          </button>
        </div>
      </div>
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