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
})();
