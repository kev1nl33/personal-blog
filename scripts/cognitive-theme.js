/* Preserve chart data and the original light palette; only adapt chart chrome. */
(function () {
    if (!window.Chart) return;
    var originals = new WeakMap();
    var properties = {ticks: 'color', grid: 'color', border: 'color'};

    Chart.register({
        id: 'cognitiveTheme',
        beforeUpdate: function (chart) {
            var dark = document.documentElement.dataset.theme === 'dark';
            var saved = originals.get(chart);
            if (!saved) {
                saved = {};
                originals.set(chart, saved);
                saved.legend = chart.options.plugins.legend && chart.options.plugins.legend.labels.color;
                saved.datasets = chart.data.datasets.map(function (dataset) {
                    return dataset.backgroundColor;
                });
            }
            if (chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = dark ? '#b7b6ae' : saved.legend;
            }
            chart.data.datasets.forEach(function (dataset, index) {
                var original = saved.datasets[index];
                function adapt(color) {
                    return dark && typeof color === 'string' && color.toLowerCase() === '#0a0a0a'
                        ? '#ecebe4' : color;
                }
                dataset.backgroundColor = Array.isArray(original) ? original.map(adapt) : adapt(original);
            });
            Object.keys(chart.options.scales || {}).forEach(function (axis) {
                var scale = chart.options.scales[axis];
                if (!saved[axis]) {
                    saved[axis] = {};
                    Object.keys(properties).forEach(function (part) {
                        saved[axis][part] = scale[part][properties[part]];
                    });
                }
                Object.keys(properties).forEach(function (part) {
                    scale[part][properties[part]] = dark
                        ? (part === 'ticks' ? '#b7b6ae' : '#5c5b55')
                        : saved[axis][part];
                });
            });
        }
    });
    window.addEventListener('themechange', function () {
        Object.keys(Chart.instances).forEach(function (id) {
            Chart.instances[id].update('none');
        });
    });

    /* 一键复制认知武器行动卡（纯文本，附带模型名、核心观点与原文地址） */
    document.addEventListener('DOMContentLoaded', function () {
        var copyBtn = document.querySelector('[data-cog-copy]');
        if (!copyBtn) return;
        var timer = 0;
        copyBtn.addEventListener('click', function () {
            var title = (document.querySelector('meta[property="og:title"]') || {}).content || document.title;
            var desc = (document.querySelector('meta[name="description"]') || {}).content || '';
            var url = (document.querySelector('link[rel="canonical"]') || {}).href || window.location.href;
            var card = '【认知武器】' + title.split(' | ')[0] + '\n' + desc + '\n来源：AIKev1n · ' + url;
            function done(ok) {
                copyBtn.textContent = ok ? '已复制行动卡 ✓' : '复制失败，请手动复制网址';
                copyBtn.classList.toggle('is-copied', ok);
                clearTimeout(timer);
                timer = setTimeout(function () {
                    copyBtn.textContent = '复制行动卡';
                    copyBtn.classList.remove('is-copied');
                }, 2200);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(card).then(function () { done(true); }, function () { done(false); });
            } else {
                var ta = document.createElement('textarea');
                ta.value = card;
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                var ok = false;
                try { ok = document.execCommand('copy'); } catch (e) {}
                ta.remove();
                done(ok);
            }
        });
    });
})();
