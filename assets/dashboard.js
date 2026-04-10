const apiBase = window.FUELWISE_CONFIG?.apiBase || "/api/fuelwise";

let fuelwisePayload = null;
let fuelwiseCopy = null;

const fuelwiseUrls = {
    dashboard: `${apiBase}/dashboard`,
    drilldown: `${apiBase}/dashboard/drilldown`,
    stationTrend: `${apiBase}/dashboard/station-trend`,
    mapMarkers: `${apiBase}/dashboard/map-markers`,
    priceTrend: `${apiBase}/dashboard/price-trend`,
    copy: `${apiBase}/dashboard-copy`
};

async function loadBootData() {
            const params = new URLSearchParams(window.location.search);
            const query = params.toString();
            const requestUrls = [
                `${fuelwiseUrls.copy}`,
                `${fuelwiseUrls.dashboard}${query ? `?${query}` : ''}`
            ];
            const [copyResponse, dashboardResponse] = await Promise.all(
                requestUrls.map((url) => fetch(url, { headers: { 'Accept': 'application/json' } }))
            );
            if (!copyResponse.ok || !dashboardResponse.ok) {
                throw new Error('Failed to load FuelWise dashboard data');
            }
            const copyPayload = await copyResponse.json();
            const dashboardPayload = await dashboardResponse.json();
            document.documentElement.lang = copyPayload.lang || 'en';
            document.title = copyPayload.copy?.page_title || 'FuelWise Supply Dashboard';
            const descriptionEl = document.querySelector('meta[name="description"]');
            if (descriptionEl && copyPayload.copy?.meta_description) {
                descriptionEl.setAttribute('content', copyPayload.copy.meta_description);
            }
            fuelwiseCopy = copyPayload.copy;
            fuelwisePayload = dashboardPayload;
}

(async function initFuelwiseDashboard() {
    try {
        await loadBootData();
    } catch (error) {
        console.error("Failed to boot FuelWise dashboard", error);
        const shell = document.querySelector(".page-shell");
        if (shell) {
            shell.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">FuelWise</p><h1>Dashboard unavailable</h1><p class="hero-summary">The FuelWise web app could not reach the backend API. Check the Vercel API rewrite and backend availability, then try again.</p></div></section>`;
        }
        return;
    }

    const pageShellEl = document.querySelector(".page-shell");
            const formEl = document.getElementById("fuelwise-global-filter-form");
            const fuelEl = document.getElementById("fuelwise-global-fuel-filter");
            const fuelInputEl = document.getElementById("fuelwise-global-fuel-filter-input");
            const fuelListEl = document.getElementById("fuelwise-global-fuel-filter-list");
            const departmentEl = document.getElementById("fuelwise-global-department-filter");
            const departmentInputEl = document.getElementById("fuelwise-global-department-filter-input");
            const departmentListEl = document.getElementById("fuelwise-global-department-filter-list");
            const timeframeEl = document.getElementById("fuelwise-global-timeframe-filter");
            const timeframeDatesEl = document.getElementById("fuelwise-timeframe-dates");
            const activeFiltersEl = document.getElementById("fuelwise-active-filters");
            const stationSearchEl = document.getElementById("fuelwise-station-search");
            const clearStationSearchEl = document.getElementById("fuelwise-clear-station-search");
            const heroScopeEl = document.getElementById("fuelwise-hero-scope");
            const heroSummaryEl = document.getElementById("fuelwise-hero-summary");
            const sourcePillEl = document.getElementById("fuelwise-source-pill");
            const dbStatusEl = document.getElementById("fuelwise-db-status");
            const generatedAtEl = document.getElementById("fuelwise-generated-at");
            const totalStationsEl = document.getElementById("fuelwise-metric-total-stations");
            const totalStationsFootEl = document.getElementById("fuelwise-metric-total-foot");
            const shortageStationsEl = document.getElementById("fuelwise-metric-shortage-stations");
            const shortageStationsFootEl = document.getElementById("fuelwise-metric-shortage-foot");
            const affectedDepartmentsEl = document.getElementById("fuelwise-metric-affected-departments");
            const affectedDepartmentsFootEl = document.getElementById("fuelwise-metric-affected-foot");
            const shortageRowsEl = document.getElementById("fuelwise-metric-shortage-rows");
            const shortageRowsFootEl = document.getElementById("fuelwise-metric-rows-foot");
            const departmentsBodyEl = document.getElementById("fuelwise-departments-body");
            const chipListEl = document.getElementById("fuelwise-chip-list");
            const barChartEl = document.getElementById("fuelwise-bar-chart");
            const detailListEl = document.getElementById("fuelwise-station-detail-list");
            const detailTitleEl = document.getElementById("fuelwise-detail-title");
            const stationChartTitleEl = document.getElementById("fuelwise-station-chart-title");
            const stationChartNoteEl = document.getElementById("fuelwise-station-chart-note");
            const stationChartLegendEl = document.getElementById("fuelwise-station-chart-legend");
            const stationChartEl = document.getElementById("fuelwise-station-chart");
            const stationChartEmptyEl = document.getElementById("fuelwise-station-chart-empty");
            const stationChartTooltipEl = document.getElementById("fuelwise-station-chart-tooltip");
            const stationChartValueEl = document.getElementById("fuelwise-station-chart-value");
            const stationChartTotalEl = document.getElementById("fuelwise-station-chart-total");

            const shortageChartEl = document.getElementById("fuelwise-chart");
            const shortageEmptyEl = document.getElementById("fuelwise-chart-empty");
            const shortageTooltipEl = document.getElementById("fuelwise-chart-tooltip");
            const shortageLegendEl = document.getElementById("fuelwise-chart-legend");
            const shortageValueEl = document.getElementById("fuelwise-chart-value");
            const shortageChangeEl = document.getElementById("fuelwise-chart-change");
            const shortageMonthChangeEl = document.getElementById("fuelwise-chart-month-change");

            const priceChartEl = document.getElementById("fuelwise-price-chart");
            const priceEmptyEl = document.getElementById("fuelwise-price-chart-empty");
            const priceTooltipEl = document.getElementById("fuelwise-price-tooltip");
            const priceLegendEl = document.getElementById("fuelwise-price-chart-legend");
            const priceValueEl = document.getElementById("fuelwise-price-value");
            const priceChangeEl = document.getElementById("fuelwise-price-change");
            const pricePeriodChangeEl = document.getElementById("fuelwise-price-period-change");
            const mapLegendEl = document.getElementById("fuelwise-map-legend");

            const shortageAxisLabels = fuelwiseCopy.lang === "fr"
                ? { left: "Stations en penurie", right: "Part des stations" }
                : { left: "Stations with shortages", right: "Share of stations" };
            const shortageSeriesColors = {
                all: "#64d3ff",
                Gazole: "#ffbf47",
                SP95: "#ffbf47",
                E10: "#46d29e",
                SP98: "#ff6b57"
            };
            const fuelDisplayNames = {
                all: "All",
                SP95: "SP95-E10",
                E10: "SP95-E10"
            };
            const stationSeriesColors = {
                all: "#64d3ff",
                Gazole: "#ffbf47",
                SP95: "#ffbf47",
                E10: "#46d29e",
                SP98: "#ff6b57",
                E85: "#9e7bff",
                GPLc: "#f78fb3",
                Unknown: "#9db0c3"
            };

            let selectedDetailDepartmentCode = "";
            let selectedDetailDepartmentName = "";
            let detailStations = [];
            let stationSearchTerm = "";
            let dashboardRequest = null;
            let selectedStationId = null;
            let selectedStationName = "";
            let stationTrendRequest = null;
            let pendingStationSelection = null;
            let currentStationTrendPayload = null;
            let resizeFrame = null;
            let franceReferenceTotalStations = null;
            let openComboboxKind = "";
            const timeframeOptions = [
                { step: "0", value: "7", label: "Last 7 days" },
                { step: "1", value: "3", label: "Last 3 days" },
                { step: "2", value: "90", label: "Last 90 days" },
                { step: "3", value: "all", label: "All" }
            ];
            const filterComboboxes = {
                fuel: {
                    kind: "fuel",
                    hiddenEl: fuelEl,
                    inputEl: fuelInputEl,
                    listEl: fuelListEl,
                    options: []
                },
                department: {
                    kind: "department",
                    hiddenEl: departmentEl,
                    inputEl: departmentInputEl,
                    listEl: departmentListEl,
                    options: []
                }
            };
            const stationFuelPriority = ["SP98", "Gazole", "SP95", "E10", "E85", "GPLc", "Unknown"];
            const initialQuery = new URLSearchParams(window.location.search);
            if (timeframeEl && initialQuery.has("timeframe")) {
                const matchedTimeframe = timeframeOptions.find((option) => option.value === (initialQuery.get("timeframe") || "all"));
                timeframeEl.value = matchedTimeframe?.step || "3";
            }

            function isPhoneViewport() {
                return window.matchMedia("(max-width: 640px)").matches;
            }

            function isTabletViewport() {
                return window.matchMedia("(max-width: 980px)").matches;
            }

            function getChartConfig(kind) {
                const isPhone = isPhoneViewport();
                const isTablet = isTabletViewport();
                const base = {
                    shortage: {
                        width: isPhone ? 640 : 960,
                        height: isPhone ? 260 : 320,
                        padding: isPhone
                            ? { top: 18, right: 46, bottom: 38, left: 40 }
                            : { top: 20, right: 66, bottom: 44, left: 58 },
                        xTickCount: isPhone ? 4 : (isTablet ? 5 : 7),
                        ySteps: isPhone ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1],
                        showAxisLabels: !isPhone,
                        tooltipBounds: { min: isPhone ? 18 : 14, max: isPhone ? 82 : 86 },
                        pointRadius: isPhone ? 4 : 5
                    },
                    price: {
                        width: isPhone ? 640 : 960,
                        height: isPhone ? 260 : 320,
                        padding: isPhone
                            ? { top: 18, right: 16, bottom: 38, left: 46 }
                            : { top: 20, right: 24, bottom: 44, left: 64 },
                        xTickCount: isPhone ? 4 : (isTablet ? 5 : 7),
                        ySteps: isPhone ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1],
                        tooltipBounds: { min: isPhone ? 18 : 14, max: isPhone ? 82 : 86 },
                        pointRadius: isPhone ? 4 : 5
                    },
                    station: {
                        width: isPhone ? 640 : 960,
                        height: isPhone ? 260 : 320,
                        padding: isPhone
                            ? { top: 18, right: 16, bottom: 38, left: 40 }
                            : { top: 20, right: 24, bottom: 44, left: 58 },
                        xTickCount: isPhone ? 4 : (isTablet ? 5 : 7),
                        ySteps: isPhone ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1],
                        tooltipBounds: { min: isPhone ? 14 : 12, max: isPhone ? 86 : 88 }
                    }
                };
                return base[kind];
            }

            function setChartViewport(svgEl, config) {
                if (!svgEl || !config) {
                    return;
                }
                svgEl.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);
                svgEl.setAttribute("preserveAspectRatio", isPhoneViewport() ? "xMidYMid meet" : "none");
            }

            function getVisibleLabelStep(pointCount, targetCount) {
                if (pointCount <= targetCount) {
                    return 1;
                }
                return Math.max(1, Math.ceil((pointCount - 1) / Math.max(targetCount - 1, 1)));
            }

            function formatChartDateLabel(value) {
                return String(value || "").slice(5).replace("-", "/");
            }

            function escapeHtml(value) {
                return String(value ?? "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            }

            function setPageLoading(isLoading) {
                if (!pageShellEl) {
                    return;
                }
                pageShellEl.classList.toggle("is-loading", isLoading);
                if (fuelEl) {
                    fuelEl.disabled = isLoading;
                }
                if (fuelInputEl) {
                    fuelInputEl.disabled = isLoading;
                }
                if (departmentEl) {
                    departmentEl.disabled = isLoading;
                }
                if (departmentInputEl) {
                    departmentInputEl.disabled = isLoading;
                }
            }

            function replaceTokens(template, values) {
                let output = String(template || "");
                Object.entries(values || {}).forEach(([key, value]) => {
                    output = output.replace(`{${key}}`, value ?? "");
                });
                return output;
            }

            function formatInteger(value) {
                return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
            }

            function formatPercent(value) {
                return `${Number(value || 0).toFixed(1)}%`;
            }

            function formatSignedPercent(value) {
                const numeric = Number(value || 0);
                const prefix = numeric > 0 ? "+" : "";
                return `${prefix}${numeric.toFixed(1)}%`;
            }

            function formatDeltaLabel(current, previous) {
                if (previous === null || previous === undefined) {
                    return "-> Not enough history";
                }
                const delta = Number(current || 0) - Number(previous || 0);
                if (Math.abs(delta) < 0.05) {
                    return "-> 0.0 pts";
                }
                return `${delta > 0 ? "↑" : "↓"} ${Math.abs(delta).toFixed(1)} pts`;
            }

            function displayFuelName(value) {
                return fuelDisplayNames[value] || value || "";
            }

            function shortageify(value) {
                return String(value || "")
                    .replace(/\bRuptures\b/g, "Shortages")
                    .replace(/\bRupture\b/g, "Shortage")
                    .replace(/\bruptures\b/g, "shortages")
                    .replace(/\brupture\b/g, "shortage");
            }

            function normalizeDepartmentCode(value) {
                return String(value || "").trim().toUpperCase();
            }

            function getSelectedTimeframeValue() {
                const rawStep = String(timeframeEl?.value || "0");
                return timeframeOptions.find((option) => option.step === rawStep)?.value || "all";
            }

            function getSelectedTimeframeDays() {
                const rawValue = getSelectedTimeframeValue();
                return rawValue === "all" ? null : Math.max(1, Number(rawValue) || 30);
            }

            function getSelectedTimeframeLabel() {
                return timeframeOptions.find((option) => option.value === getSelectedTimeframeValue())?.label || "All";
            }

            function formatDateRangeLabel(startDate, endDate) {
                if (!startDate || !endDate) {
                    return "Showing the full available range";
                }
                return `${startDate} to ${endDate}`;
            }

            function updateTimeframeSummary() {
                if (!timeframeDatesEl) {
                    return;
                }
                const baseSeries = Array.isArray(fuelwisePayload?.time_series?.series?.all)
                    ? fuelwisePayload.time_series.series.all
                    : [];
                const visibleSeries = sliceSeriesWindow(baseSeries, getSelectedTimeframeDays());
                const firstDate = visibleSeries[0]?.date || baseSeries[0]?.date || "";
                const lastDate = visibleSeries[visibleSeries.length - 1]?.date || baseSeries[baseSeries.length - 1]?.date || "";
                timeframeDatesEl.textContent = formatDateRangeLabel(firstDate, lastDate);
            }

            function orderedFuelTypes(fuelTypes) {
                const uniqueFuelTypes = Array.from(new Set((fuelTypes || []).filter(Boolean)));
                return [
                    ...stationFuelPriority.filter((fuelType) => uniqueFuelTypes.includes(fuelType)),
                    ...uniqueFuelTypes.filter((fuelType) => !stationFuelPriority.includes(fuelType))
                ];
            }

            function sliceSeriesWindow(points, days) {
                if (!Array.isArray(points)) {
                    return [];
                }
                if (!days || points.length <= days) {
                    return points;
                }
                return points.slice(-days);
            }

            function pointDaysAgo(points, daysAgo) {
                if (!Array.isArray(points) || !points.length) {
                    return null;
                }
                const index = Math.max(0, points.length - 1 - daysAgo);
                return points[index] || points[0] || null;
            }

            function renderActiveFilters(payload) {
                if (!activeFiltersEl) {
                    return;
                }
                const badges = [];
                const selectedFuel = payload?.filters?.fuel_type || "all";
                const selectedDepartment = payload?.filters?.department_code || "";
                if (selectedFuel && selectedFuel !== "all") {
                    badges.push({
                        kind: "fuel",
                        value: selectedFuel,
                        label: `Fuel: ${displayFuelName(selectedFuel)}`
                    });
                }
                if (selectedDepartment) {
                    badges.push({
                        kind: "department",
                        value: selectedDepartment,
                        label: `Departement: ${payload?.scope?.department_name || selectedDepartment}`
                    });
                }
                if (getSelectedTimeframeDays()) {
                    badges.push({
                        kind: "timeframe",
                        value: getSelectedTimeframeValue(),
                        label: `Trend window: ${getSelectedTimeframeLabel()}`
                    });
                }
                activeFiltersEl.hidden = !badges.length;
                activeFiltersEl.innerHTML = badges.map((badge) => `
                    <button type="button" class="filter-badge" data-filter-kind="${escapeHtml(badge.kind)}" data-filter-value="${escapeHtml(badge.value)}">
                        <span>${escapeHtml(badge.label)}</span>
                        <span class="filter-badge-remove" aria-hidden="true">&times;</span>
                    </button>
                `).join("");
            }

            function scopeText(payload) {
                const scope = payload?.scope || {};
                if (scope.fuel_type === "all" && !scope.department_code) {
                    return "All main fuels across France";
                }
                if (scope.fuel_type !== "all" && !scope.department_code) {
                    return `${displayFuelName(scope.fuel_type)} across France`;
                }
                if (scope.fuel_type === "all" && scope.department_code) {
                    return `All main fuels in ${scope.department_name}`;
                }
                return `${displayFuelName(scope.fuel_type)} in ${scope.department_name}`;
            }

            function renderHero(payload) {
                updateTimeframeSummary();
                if (heroScopeEl) {
                    heroScopeEl.textContent = scopeText(payload);
                }
                if (heroSummaryEl) {
                    heroSummaryEl.textContent = "Monitor fuel shortages across France, compare Departements quickly, and drill into the stations that need attention.";
                }
                if (sourcePillEl) {
                    sourcePillEl.className = `pill pill-${payload.data_mode || "live"}`;
                    sourcePillEl.textContent = fuelwiseCopy.source_label[payload.data_mode] || fuelwiseCopy.source_label.live;
                }
                if (dbStatusEl) {
                    dbStatusEl.textContent = payload.database?.connected ? fuelwiseCopy.database_connected : fuelwiseCopy.database_unavailable;
                }
                if (generatedAtEl) {
                    generatedAtEl.textContent = replaceTokens(fuelwiseCopy.generated_at, { value: payload.generated_at || "" });
                }
            }

            function renderMetrics(payload) {
                const scopeName = payload?.scope?.department_name || "France";
                const totalStations = Number(payload.summary?.total_stations || 0);
                const shortageStations = Number(payload.summary?.stations_with_rupture || 0);
                const affectedDepartments = Number(payload.summary?.affected_departments || 0);
                const shortageRows = Number(payload.summary?.rupture_rows || 0);
                const isDepartmentScope = Boolean(payload?.scope?.department_code);
                if (totalStationsEl) {
                    totalStationsEl.textContent = formatInteger(totalStations);
                }
                if (shortageStationsEl) {
                    shortageStationsEl.textContent = formatInteger(shortageStations);
                }
                if (affectedDepartmentsEl) {
                    affectedDepartmentsEl.textContent = formatInteger(affectedDepartments);
                }
                if (shortageRowsEl) {
                    shortageRowsEl.textContent = formatInteger(shortageRows);
                }
                if (!franceReferenceTotalStations && !isDepartmentScope) {
                    franceReferenceTotalStations = totalStations;
                }
                if (totalStationsFootEl) {
                    if (isDepartmentScope && franceReferenceTotalStations) {
                        totalStationsFootEl.textContent = `${formatPercent((totalStations / franceReferenceTotalStations) * 100)} of French stations are in ${scopeName}.`;
                    } else {
                        totalStationsFootEl.textContent = "Total stations in Metropolitan France.";
                    }
                }
                if (shortageStationsFootEl) {
                    shortageStationsFootEl.textContent = isDepartmentScope
                        ? `${formatPercent(totalStations ? (shortageStations / totalStations) * 100 : 0)} of stations in ${scopeName} are affected right now.`
                        : `${formatPercent(totalStations ? (shortageStations / totalStations) * 100 : 0)} of tracked stations are affected right now.`;
                }
                if (affectedDepartmentsFootEl) {
                    affectedDepartmentsFootEl.textContent = isDepartmentScope
                        ? `Current focus is ${scopeName}. Clear the Departement filter to compare the national spread.`
                        : "Departements with at least one station currently affected.";
                }
                if (shortageRowsFootEl) {
                    shortageRowsFootEl.textContent = isDepartmentScope
                        ? `Fuel shortage entries recorded in ${scopeName} in the latest snapshot.`
                        : "Fuel shortage entries recorded across France in the latest snapshot.";
                }
            }

            function normalizeComboboxValue(kind, value) {
                const fallbackValue = kind === "fuel" ? "all" : "";
                if (kind === "fuel" && value === "SP95") {
                    return "E10";
                }
                return value == null ? fallbackValue : String(value);
            }

            function formatComboboxOption(option, kind) {
                const value = kind === "department" ? option.code : option.value;
                if (kind === "fuel" && value === "SP95") {
                    return null;
                }
                const label = kind === "department"
                    ? (option.code === "" ? fuelwiseCopy.filters.all_france : option.name)
                    : (option.value === "all" ? fuelwiseCopy.filters.all_main_fuels : displayFuelName(option.label));
                return {
                    value: normalizeComboboxValue(kind, value),
                    label: String(label || "")
                };
            }

            function getComboboxState(kind) {
                return filterComboboxes[kind] || null;
            }

            function getSelectedComboboxOption(state) {
                if (!state) {
                    return null;
                }
                const selectedValue = normalizeComboboxValue(state.kind, state.hiddenEl?.value);
                return state.options.find((option) => option.value === selectedValue) || state.options[0] || null;
            }

            function syncComboboxInput(state) {
                if (!state?.inputEl) {
                    return;
                }
                const selectedOption = getSelectedComboboxOption(state);
                state.inputEl.value = selectedOption?.label || "";
            }

            function getComboboxMatches(state, query) {
                const needle = String(query || "").trim().toLowerCase();
                if (!needle) {
                    return state.options;
                }
                return state.options.filter((option) => option.label.toLowerCase().includes(needle));
            }

            function renderComboboxMenu(state, query) {
                if (!state?.listEl || !state?.inputEl) {
                    return;
                }
                const selectedOption = getSelectedComboboxOption(state);
                const matches = getComboboxMatches(state, query);
                if (!matches.length) {
                    state.listEl.innerHTML = `<div class="filter-combobox-empty">No matches found.</div>`;
                    state.listEl.hidden = false;
                    state.inputEl.setAttribute("aria-expanded", "true");
                    return;
                }
                state.listEl.innerHTML = matches.map((option) => `
                    <button
                        type="button"
                        class="filter-combobox-option${selectedOption && selectedOption.value === option.value ? " is-selected" : ""}"
                        role="option"
                        data-value="${escapeHtml(option.value)}"
                        aria-selected="${selectedOption && selectedOption.value === option.value ? "true" : "false"}">
                        ${escapeHtml(option.label)}
                    </button>
                `).join("");
                state.listEl.hidden = false;
                state.inputEl.setAttribute("aria-expanded", "true");
            }

            function closeCombobox(kind, restoreSelectedLabel = true) {
                const state = getComboboxState(kind);
                if (!state?.listEl || !state?.inputEl) {
                    return;
                }
                state.listEl.hidden = true;
                state.inputEl.setAttribute("aria-expanded", "false");
                if (restoreSelectedLabel) {
                    syncComboboxInput(state);
                }
                if (openComboboxKind === kind) {
                    openComboboxKind = "";
                }
            }

            function openCombobox(kind, query = "") {
                const state = getComboboxState(kind);
                if (!state?.inputEl || !state?.listEl) {
                    return;
                }
                if (openComboboxKind && openComboboxKind !== kind) {
                    closeCombobox(openComboboxKind);
                }
                openComboboxKind = kind;
                renderComboboxMenu(state, query);
            }

            function setComboboxValue(kind, value, { refresh = false, close = true } = {}) {
                const state = getComboboxState(kind);
                if (!state?.hiddenEl) {
                    return;
                }
                state.hiddenEl.value = normalizeComboboxValue(kind, value);
                syncComboboxInput(state);
                if (close) {
                    closeCombobox(kind, false);
                }
                if (refresh) {
                    refreshDashboard();
                }
            }

            function renderSelectOptions(selectEl, options, selectedValue, kind) {
                const state = kind ? getComboboxState(kind) : null;
                if (!selectEl || !state) {
                    return;
                }
                state.options = (options || [])
                    .map((option) => formatComboboxOption(option, kind))
                    .filter(Boolean);
                selectEl.value = normalizeComboboxValue(kind, selectedValue);
                syncComboboxInput(state);
                closeCombobox(kind, false);
            }

            function renderDepartments(payload) {
                const departments = Array.isArray(payload.departments) ? payload.departments : [];
                if (!departmentsBodyEl) {
                    return;
                }
                if (!departments.length) {
                    departmentsBodyEl.innerHTML = `<tr><td colspan="4">${escapeHtml(fuelwiseCopy.departments.empty)}</td></tr>`;
                    return;
                }
                departmentsBodyEl.innerHTML = departments.map((department) => `
                    <tr class="department-row" data-department-code="${escapeHtml(department.code || "")}" data-department-name="${escapeHtml(department.name || "")}" tabindex="0" role="button">
                        <td>
                            <strong>${escapeHtml(department.name || "")}</strong>
                            <span class="row-sub">${escapeHtml(replaceTokens(fuelwiseCopy.departments.row_sub, { value: department.issue_rate }))}</span>
                        </td>
                        <td><span class="status-badge status-${escapeHtml(department.status_level || "stable")}">${escapeHtml(fuelwiseCopy.status_labels[department.status_level] || department.status_label || "")}</span></td>
                        <td>${escapeHtml(`${department.issue_station_count || 0} / ${department.total_station_count || 0}`)}</td>
                        <td>${escapeHtml(`${department.rupture_count || 0}`)}</td>
                    </tr>
                `).join("");
                setActiveDepartment(selectedDetailDepartmentCode);
            }

            function renderPriority(payload) {
                const departments = Array.isArray(payload.departments) ? payload.departments : [];
                if (!chipListEl) {
                    return;
                }
                if (!departments.length) {
                    chipListEl.innerHTML = `<span class="area-chip">${escapeHtml(fuelwiseCopy.priority.empty)}</span>`;
                    return;
                }
                chipListEl.innerHTML = departments.map((department) => `
                    <button
                        type="button"
                        class="area-chip area-chip-${escapeHtml(department.status_level || "stable")} department-chip"
                        data-department-code="${escapeHtml(department.code || "")}"
                        data-department-name="${escapeHtml(department.name || "")}"
                    >
                        ${escapeHtml(replaceTokens(fuelwiseCopy.priority.chip_label, { name: department.name, count: department.issue_station_count }))}
                    </button>
                `).join("");
                setActiveDepartment(selectedDetailDepartmentCode);
            }

            function renderBars(payload) {
                const items = Array.isArray(payload.bar_charts?.departments) ? payload.bar_charts.departments : [];
                if (!barChartEl) {
                    return;
                }
                if (!items.length) {
                    barChartEl.innerHTML = `<p class="empty-state">${escapeHtml(fuelwiseCopy.bars.empty)}</p>`;
                    return;
                }
                barChartEl.innerHTML = items.map((item) => `
                    <button
                        type="button"
                        class="bar-row"
                        data-department-code="${escapeHtml(item.code || "")}"
                        data-department-name="${escapeHtml(item.label || "")}"
                    >
                        <div class="bar-label">${escapeHtml(item.label || "")}</div>
                        <div class="bar-track">
                            <span class="bar-fill bar-fill-${escapeHtml(item.status_level || "stable")}" style="width: ${Number(item.width || 0)}%;"></span>
                        </div>
                        <div class="bar-value">${escapeHtml(`${formatInteger(item.value || 0)} · ${Number(item.percentage || 0).toFixed(1)}%`)}</div>
                    </button>
                `).join("");
            }

            function renderStations(stations, { store = true } = {}) {
                if (store) {
                    detailStations = Array.isArray(stations) ? stations : [];
                }
                const visibleStations = getVisibleDetailStations();
                if (stationSearchEl) {
                    stationSearchEl.disabled = !detailStations.length;
                }
                if (clearStationSearchEl) {
                    clearStationSearchEl.disabled = !stationSearchTerm;
                }
                if (!detailListEl) {
                    return;
                }
                if (!visibleStations.length) {
                    detailListEl.innerHTML = `<tr><td colspan="3" class="empty-state-cell">${escapeHtml(stationSearchTerm ? "No stations match this search in the current scope." : fuelwiseCopy.detail.empty)}</td></tr>`;
                    return;
                }
                detailListEl.innerHTML = visibleStations.map((station) => {
                    const location = [station.city || "", station.address || ""].filter(Boolean).join(" · ");
                    const fuels = Array.from(new Set((Array.isArray(station.fuel_list) ? station.fuel_list : []).map((fuel) => displayFuelName(fuel))));
                    return `
                        <tr class="station-item" data-station-id="${escapeHtml(station.station_id || "")}" data-station-name="${escapeHtml(station.name || fuelwiseCopy.common_station)}" tabindex="0" role="button">
                            <td>
                                <strong class="station-primary">${escapeHtml(station.name || fuelwiseCopy.common_station)}</strong>
                                <span class="station-secondary">${escapeHtml(station.department_name || "")}</span>
                            </td>
                            <td>
                                <span class="station-secondary">${escapeHtml(location || fuelwiseCopy.detail.location_unavailable)}</span>
                            </td>
                            <td>
                                <div class="fuel-tags">
                                    ${fuels.map((fuel) => `<span>${escapeHtml(fuel)}</span>`).join("")}
                                </div>
                            </td>
                        </tr>
                    `;
                }).join("");
                setActiveStation(selectedStationId);
            }

            function setActiveStation(stationId) {
                document.querySelectorAll(".station-item").forEach((el) => {
                    const isActive = Boolean(stationId) && Number(el.dataset.stationId) === Number(stationId);
                    el.classList.toggle("is-active", isActive);
                    el.setAttribute("aria-selected", isActive ? "true" : "false");
                });
            }

            function scrollStationIntoView(stationId) {
                if (!stationId) {
                    return;
                }
                const stationEl = detailListEl?.querySelector(`.station-item[data-station-id="${String(stationId)}"]`);
                stationEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            function syncScopedDetail(payload) {
                const departmentCode = normalizeDepartmentCode(payload.filters?.department_code);
                if (!departmentCode) {
                    resetDetail(payload);
                    return;
                }
                selectedDetailDepartmentCode = departmentCode;
                selectedDetailDepartmentName = payload.scope?.department_name || departmentCode;
                stationSearchTerm = "";
                if (stationSearchEl) {
                    stationSearchEl.value = "";
                    stationSearchEl.disabled = false;
                }
                if (clearStationSearchEl) {
                    clearStationSearchEl.disabled = true;
                }
                if (detailTitleEl) {
                    detailTitleEl.textContent = replaceTokens(fuelwiseCopy.detail.department_title, { name: selectedDetailDepartmentName });
                }
                renderStations(payload.rupture_stations || []);
                setActiveDepartment(departmentCode);
            }

            function applyDepartmentFilter(code, name) {
                const nextCode = normalizeDepartmentCode(code);
                selectedDetailDepartmentCode = nextCode;
                selectedDetailDepartmentName = name || "";
                stationSearchTerm = "";
                if (stationSearchEl) {
                    stationSearchEl.value = "";
                }
                if (departmentEl) {
                    departmentEl.value = nextCode;
                }
                syncComboboxInput(getComboboxState("department"));
                refreshDashboard();
            }

            function renderStationLegend(fuelTypes) {
                if (!stationChartLegendEl) {
                    return;
                }
                const sortedFuelTypes = orderedFuelTypes(fuelTypes);
                if (!sortedFuelTypes.length) {
                    stationChartLegendEl.innerHTML = "";
                    return;
                }
                stationChartLegendEl.innerHTML = sortedFuelTypes.map((fuelType) => `
                    <span class="chart-legend-item">
                        <i class="chart-legend-swatch" style="--swatch:${escapeHtml(stationSeriesColors[fuelType] || stationSeriesColors.Unknown)}"></i>
                        ${escapeHtml(displayFuelName(fuelType))}
                    </span>
                `).join("");
            }

            function resetStationChart() {
                if (stationTrendRequest) {
                    stationTrendRequest.abort();
                    stationTrendRequest = null;
                }
                currentStationTrendPayload = null;
                selectedStationId = null;
                selectedStationName = "";
                setActiveStation(null);
                renderStationLegend([]);
                if (stationChartTitleEl) {
                    stationChartTitleEl.textContent = shortageify(fuelwiseCopy.station_chart.title);
                }
                if (stationChartNoteEl) {
                    stationChartNoteEl.textContent = `Select a station to see a ${getSelectedTimeframeLabel().toLowerCase()} stacked breakdown by fuel shortage.`;
                }
                if (stationChartValueEl) {
                    stationChartValueEl.textContent = "0";
                }
                if (stationChartTotalEl) {
                    stationChartTotalEl.textContent = "0";
                }
                if (stationChartEl) {
                    stationChartEl.innerHTML = "";
                    stationChartEl.setAttribute("hidden", "hidden");
                }
                if (stationChartEmptyEl) {
                    stationChartEmptyEl.hidden = false;
                    stationChartEmptyEl.textContent = shortageify(fuelwiseCopy.station_chart.empty);
                }
                if (stationChartTooltipEl) {
                    stationChartTooltipEl.hidden = true;
                }
            }

            function resetDetail(payload) {
                selectedDetailDepartmentCode = "";
                selectedDetailDepartmentName = "";
                detailStations = Array.isArray(payload.rupture_stations) ? payload.rupture_stations : [];
                stationSearchTerm = "";
                if (stationSearchEl) {
                    stationSearchEl.value = "";
                    stationSearchEl.disabled = !detailStations.length;
                }
                if (clearStationSearchEl) {
                    clearStationSearchEl.disabled = true;
                }
                if (detailTitleEl) {
                    detailTitleEl.textContent = fuelwiseCopy.detail.title;
                }
                renderStations(detailStations, { store: false });
                setActiveDepartment("");
                resetStationChart();
            }

            function setActiveDepartment(code) {
                document.querySelectorAll(".department-row, .department-chip").forEach((el) => {
                    const isActive = Boolean(code) && el.dataset.departmentCode === code;
                    el.classList.toggle("is-active", isActive);
                    if (el.classList.contains("department-row")) {
                        el.setAttribute("aria-selected", isActive ? "true" : "false");
                    }
                });
            }

            function getVisibleDetailStations() {
                const needle = stationSearchTerm.trim().toLowerCase();
                if (!needle) {
                    return detailStations;
                }
                return detailStations.filter((station) => {
                    const haystack = [
                        station.name,
                        station.city,
                        station.address,
                        station.department_name
                    ].filter(Boolean).join(" ").toLowerCase();
                    return haystack.includes(needle);
                });
            }

            function formatShortageValue(value, totalStations) {
                const numericValue = Number(value || 0);
                if (!totalStations) {
                    return `${formatInteger(numericValue)} · 0.0%`;
                }
                return `${formatInteger(numericValue)} · ${((numericValue / totalStations) * 100).toFixed(1)}%`;
            }

            function formatPercentChange(first, last) {
                if (Math.abs(first) < 0.0001) {
                    return last > 0 ? "+100%" : "0%";
                }
                const change = ((last - first) / Math.abs(first)) * 100;
                const prefix = change > 0 ? "+" : "";
                return `${prefix}${change.toFixed(1)}%`;
            }

            function formatCountLabel(value) {
                return `${formatInteger(value)} ${Number(value || 0) === 1 ? "instance" : "instances"}`;
            }

            function buildChartPath(points, width, height, padding, maxValue) {
                let started = false;
                return points.map((point) => {
                    if (point?.missing) {
                        started = false;
                        return "";
                    }
                    const x = padding.left + ((width - padding.left - padding.right) * Number(point.position || 0));
                    const rawValue = Number(point.count || 0);
                    const y = height - padding.bottom - ((height - padding.top - padding.bottom) * rawValue / Math.max(maxValue, 1));
                    const command = started ? "L" : "M";
                    started = true;
                    return `${command} ${x.toFixed(2)} ${y.toFixed(2)}`;
                }).filter(Boolean).join(" ");
            }

            function buildStationSegmentPath(x, y, width, height, roundTop, roundBottom, radius) {
                const effectiveHeight = Math.max(height, 0);
                const effectiveRadius = Math.min(radius, width / 2, effectiveHeight / 2);
                const topLeft = roundTop ? effectiveRadius : 0;
                const topRight = roundTop ? effectiveRadius : 0;
                const bottomRight = roundBottom ? effectiveRadius : 0;
                const bottomLeft = roundBottom ? effectiveRadius : 0;
                const right = x + width;
                const bottom = y + effectiveHeight;
                return [
                    `M ${x + topLeft} ${y}`,
                    `L ${right - topRight} ${y}`,
                    topRight ? `Q ${right} ${y} ${right} ${y + topRight}` : `L ${right} ${y}`,
                    `L ${right} ${bottom - bottomRight}`,
                    bottomRight ? `Q ${right} ${bottom} ${right - bottomRight} ${bottom}` : `L ${right} ${bottom}`,
                    `L ${x + bottomLeft} ${bottom}`,
                    bottomLeft ? `Q ${x} ${bottom} ${x} ${bottom - bottomLeft}` : `L ${x} ${bottom}`,
                    `L ${x} ${y + topLeft}`,
                    topLeft ? `Q ${x} ${y} ${x + topLeft} ${y}` : `L ${x} ${y}`,
                    "Z"
                ].join(" ");
            }

            function renderShortageLegend(seriesEntries) {
                if (!shortageLegendEl) {
                    return;
                }
                if (!seriesEntries.length) {
                    shortageLegendEl.innerHTML = "";
                    return;
                }
                shortageLegendEl.innerHTML = seriesEntries.map(([fuelType]) => `
                    <span class="chart-legend-item">
                        <i class="chart-legend-swatch" style="--swatch:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"></i>
                        ${escapeHtml(displayFuelName(fuelType))}
                    </span>
                `).join("");
            }

            function renderShortageChart() {
                if (!shortageChartEl) {
                    return;
                }
                const chartConfig = getChartConfig("shortage");
                const timeframeDays = getSelectedTimeframeDays();
                const shortageChartWidth = chartConfig.width;
                const shortageChartHeight = chartConfig.height;
                const shortagePadding = chartConfig.padding;
                setChartViewport(shortageChartEl, chartConfig);
                const allSeries = fuelwisePayload.time_series?.series || {};
                const selectedFuelType = fuelwisePayload.filters?.fuel_type || "all";
                const normalizedSelectedFuelType = selectedFuelType === "SP95" ? "E10" : selectedFuelType;
                const visibleFuelTypes = (normalizedSelectedFuelType === "all"
                    ? (fuelwisePayload.time_series?.fuel_types || [])
                    : [normalizedSelectedFuelType]
                ).filter((fuelType) => fuelType !== "SP95" && Array.isArray(allSeries[fuelType]) && allSeries[fuelType].length);
                const visibleSeries = visibleFuelTypes.map((fuelType) => [fuelType, sliceSeriesWindow(allSeries[fuelType], timeframeDays)]);
                const summarySeries = (
                    normalizedSelectedFuelType === "all"
                        ? (Array.isArray(allSeries.all) && allSeries.all.length ? sliceSeriesWindow(allSeries.all, timeframeDays) : visibleSeries[0]?.[1])
                        : (allSeries[normalizedSelectedFuelType] || visibleSeries[0]?.[1])
                );
                const effectiveSummarySeries = sliceSeriesWindow(summarySeries || [], timeframeDays);
                const totalStations = Number(fuelwisePayload.summary?.total_stations || 0);

                if (!visibleSeries.length || !effectiveSummarySeries.length) {
                    shortageChartEl.innerHTML = "";
                    shortageChartEl.setAttribute("hidden", "hidden");
                    shortageEmptyEl.hidden = false;
                    if (shortageTooltipEl) {
                        shortageTooltipEl.hidden = true;
                    }
                    renderShortageLegend([]);
                    shortageValueEl.textContent = "0";
                    shortageChangeEl.textContent = "Not enough history";
                    if (shortageMonthChangeEl) {
                        shortageMonthChangeEl.textContent = "Not enough history";
                    }
                    return;
                }

                shortageChartEl.removeAttribute("hidden");
                shortageEmptyEl.hidden = true;
                renderShortageLegend(visibleSeries);

                const summaryDates = effectiveSummarySeries.map((point) => point.date).filter(Boolean);
                const dates = (summaryDates.length
                    ? summaryDates
                    : Array.from(new Set(
                        visibleSeries.flatMap(([, points]) => points.map((point) => point.date)).filter(Boolean)
                    )).sort()
                );
                const dateCount = dates.length;

                if (!dateCount) {
                    shortageChartEl.innerHTML = "";
                    shortageChartEl.setAttribute("hidden", "hidden");
                    shortageEmptyEl.hidden = false;
                    if (shortageTooltipEl) {
                        shortageTooltipEl.hidden = true;
                    }
                    renderShortageLegend([]);
                    shortageValueEl.textContent = "0";
                    shortageChangeEl.textContent = "0%";
                    return;
                }

                const chartSeries = visibleSeries.map(([fuelType, points]) => {
                    const pointMap = new Map(points.map((point) => [point.date, point]));
                    return [
                        fuelType,
                        dates.map((date, index) => {
                            const sourcePoint = pointMap.get(date);
                            return {
                                date,
                                count: Number(sourcePoint?.count || 0),
                                percentage: Number(sourcePoint?.percentage || 0),
                                missing: !sourcePoint,
                                position: dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1)
                            };
                        })
                    ];
                });

                const values = chartSeries.flatMap(([, points]) => points.filter((point) => !point.missing).map((point) => point.count));
                const maxValue = Math.max(...values, 1);
                const latest = effectiveSummarySeries[effectiveSummarySeries.length - 1];
                const yesterdayPoint = pointDaysAgo(effectiveSummarySeries, 1);
                const monthPoint = pointDaysAgo(effectiveSummarySeries, 30);
                shortageValueEl.textContent = formatPercent(latest?.percentage || 0);
                shortageChangeEl.textContent = formatDeltaLabel(latest?.percentage || 0, yesterdayPoint?.percentage);
                if (shortageMonthChangeEl) {
                    shortageMonthChangeEl.textContent = formatDeltaLabel(latest?.percentage || 0, monthPoint?.percentage);
                }

                const yTicks = chartConfig.ySteps.map((step) => {
                    const value = maxValue * step;
                    const y = shortageChartHeight - shortagePadding.bottom - ((shortageChartHeight - shortagePadding.top - shortagePadding.bottom) * step);
                    const percentage = totalStations ? (value / totalStations) * 100 : 0;
                    return `
                        <g class="chart-tick">
                            <line x1="${shortagePadding.left}" y1="${y}" x2="${shortageChartWidth - shortagePadding.right}" y2="${y}" />
                            <text x="${shortagePadding.left - 10}" y="${y + 4}" text-anchor="end">${Math.round(value)}</text>
                            <text x="${shortageChartWidth - shortagePadding.right + 10}" y="${y + 4}" text-anchor="start">${percentage.toFixed(1)}%</text>
                        </g>
                    `;
                }).join("");

                const labelStep = getVisibleLabelStep(dates.length, chartConfig.xTickCount);
                const xLabels = dates.map((date, index) => {
                    if (index % labelStep !== 0 && index !== dates.length - 1) {
                        return "";
                    }
                    const ratio = dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1);
                    const x = shortagePadding.left + ((shortageChartWidth - shortagePadding.left - shortagePadding.right) * ratio);
                    return `<text class="chart-x-label" x="${x}" y="${shortageChartHeight - 14}" text-anchor="middle">${escapeHtml(formatChartDateLabel(date))}</text>`;
                }).join("");
                const axisLabelY = (shortageChartHeight - shortagePadding.bottom + shortagePadding.top) / 2;
                const axisLabels = chartConfig.showAxisLabels
                    ? `
                        <text class="chart-axis-label" x="18" y="${axisLabelY}" text-anchor="middle" transform="rotate(-90 18 ${axisLabelY})">${escapeHtml(shortageAxisLabels.left)}</text>
                        <text class="chart-axis-label" x="${shortageChartWidth - 18}" y="${axisLabelY}" text-anchor="middle" transform="rotate(90 ${shortageChartWidth - 18} ${axisLabelY})">${escapeHtml(shortageAxisLabels.right)}</text>
                    `
                    : "";

                const lineMarkup = chartSeries.map(([fuelType, points]) => `
                    <path
                        class="chart-line chart-line-shortage"
                        d="${buildChartPath(points, shortageChartWidth, shortageChartHeight, shortagePadding, maxValue)}"
                        style="--line-color:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"
                    />
                `).join("");

                const hoverTargets = dates.map((date, index) => {
                    const leftRatio = dateCount === 1 ? 0 : Math.max((index - 0.5) / Math.max(dateCount - 1, 1), 0);
                    const rightRatio = dateCount === 1 ? 1 : Math.min((index + 0.5) / Math.max(dateCount - 1, 1), 1);
                    const x = shortagePadding.left + ((shortageChartWidth - shortagePadding.left - shortagePadding.right) * (dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1)));
                    const rectX = shortagePadding.left + ((shortageChartWidth - shortagePadding.left - shortagePadding.right) * leftRatio);
                    const rectWidth = Math.max(
                        18,
                        ((shortageChartWidth - shortagePadding.left - shortagePadding.right) * (rightRatio - leftRatio))
                    );
                    return `
                        <g class="chart-hover-target" data-index="${index}">
                            <rect x="${rectX}" y="${shortagePadding.top}" width="${rectWidth}" height="${shortageChartHeight - shortagePadding.top - shortagePadding.bottom}" fill="transparent"></rect>
                            <line class="chart-hover-line" x1="${x}" y1="${shortagePadding.top}" x2="${x}" y2="${shortageChartHeight - shortagePadding.bottom}" />
                        </g>
                    `;
                }).join("");

                shortageChartEl.innerHTML = `
                    ${yTicks}
                    ${axisLabels}
                    ${lineMarkup}
                    <g id="fuelwise-shortage-active-points"></g>
                    ${hoverTargets}
                    ${xLabels}
                `;

                const activePointsEl = shortageChartEl.querySelector("#fuelwise-shortage-active-points");
                const hoverTargetEls = shortageChartEl.querySelectorAll(".chart-hover-target");

                function hideShortageTooltip() {
                    hoverTargetEls.forEach((targetEl) => targetEl.classList.remove("is-active"));
                    if (activePointsEl) {
                        activePointsEl.innerHTML = "";
                    }
                    if (shortageTooltipEl) {
                        shortageTooltipEl.hidden = true;
                        shortageTooltipEl.classList.remove("chart-tooltip-below", "chart-tooltip-above");
                    }
                }

                function showShortageTooltip(index) {
                    const activeDate = dates[index];
                    if (!activeDate) {
                        hideShortageTooltip();
                        return;
                    }
                    hoverTargetEls.forEach((targetEl) => {
                        targetEl.classList.toggle("is-active", Number(targetEl.dataset.index) === index);
                    });

                    const ratio = dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1);
                    const x = shortagePadding.left + ((shortageChartWidth - shortagePadding.left - shortagePadding.right) * ratio);
                    const visibleRows = chartSeries
                        .map(([fuelType, points]) => [fuelType, points[index]])
                        .filter(([, point]) => point && !point.missing);
                    const pointMarkup = visibleRows.map(([fuelType, point]) => {
                        const y = shortageChartHeight - shortagePadding.bottom - ((shortageChartHeight - shortagePadding.top - shortagePadding.bottom) * Number(point.count || 0) / Math.max(maxValue, 1));
                        return `
                            <circle
                                class="chart-point chart-point-shortage"
                                cx="${x}"
                                cy="${y}"
                                r="${chartConfig.pointRadius}"
                                style="--point-color:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"
                            ></circle>
                        `;
                    }).join("");
                    if (activePointsEl) {
                        activePointsEl.innerHTML = pointMarkup;
                    }
                    if (!visibleRows.length) {
                        hideShortageTooltip();
                        return;
                    }

                    if (!shortageTooltipEl) {
                        return;
                    }
                    const rows = visibleRows.map(([fuelType, point]) => {
                        return `
                            <span class="chart-tooltip-row">
                                <i class="chart-legend-swatch" style="--swatch:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"></i>
                                ${escapeHtml(displayFuelName(fuelType))}: ${escapeHtml(formatShortageValue(point?.count, totalStations))}
                            </span>
                        `;
                    }).join("");
                    shortageTooltipEl.hidden = false;
                    shortageTooltipEl.innerHTML = `
                        <strong>${escapeHtml(activeDate)}</strong>
                        ${rows}
                    `;
                    shortageTooltipEl.style.left = `${Math.min(Math.max((x / shortageChartWidth) * 100, chartConfig.tooltipBounds.min), chartConfig.tooltipBounds.max)}%`;

                    const topPoint = visibleRows.reduce((minY, [, point]) => {
                        const y = shortageChartHeight - shortagePadding.bottom - ((shortageChartHeight - shortagePadding.top - shortagePadding.bottom) * Number(point?.count || 0) / Math.max(maxValue, 1));
                        return Math.min(minY, y);
                    }, shortageChartHeight - shortagePadding.bottom);
                    const tooltipHeight = shortageTooltipEl.offsetHeight || 96;
                    const spaceAbove = topPoint - shortagePadding.top;
                    const spaceBelow = (shortageChartHeight - shortagePadding.bottom) - topPoint;
                    const prefersBelow = spaceAbove < (tooltipHeight + 24) && spaceBelow > spaceAbove;
                    shortageTooltipEl.classList.toggle("chart-tooltip-below", prefersBelow);
                    shortageTooltipEl.classList.toggle("chart-tooltip-above", !prefersBelow);
                    const anchorY = prefersBelow
                        ? Math.min(topPoint, shortageChartHeight - shortagePadding.bottom - tooltipHeight - 24)
                        : Math.max(topPoint, shortagePadding.top + tooltipHeight + 24);
                    shortageTooltipEl.style.top = `${anchorY}px`;
                }

                hoverTargetEls.forEach((targetEl) => {
                    const index = Number(targetEl.dataset.index);
                    targetEl.addEventListener("mouseenter", () => showShortageTooltip(index));
                    targetEl.addEventListener("mousemove", () => showShortageTooltip(index));
                    targetEl.addEventListener("click", () => showShortageTooltip(index));
                });
                shortageChartEl.addEventListener("mouseleave", hideShortageTooltip);
            }

            function formatPrice(value) {
                if (value === null || value === undefined || Number.isNaN(Number(value))) {
                    return "-";
                }
                return `${Number(value).toFixed(3)} €/L`;
            }

            function formatPriceDelta(value) {
                if (value === null || value === undefined || Number.isNaN(Number(value))) {
                    return "-";
                }
                const prefix = Number(value) > 0 ? "+" : "";
                return `${prefix}${Number(value).toFixed(3)} €/L`;
            }

            function renderPriceLegend(seriesEntries) {
                if (!priceLegendEl) {
                    return;
                }
                if (!seriesEntries.length) {
                    priceLegendEl.innerHTML = "";
                    return;
                }
                priceLegendEl.innerHTML = seriesEntries.map(([fuelType]) => `
                    <span class="chart-legend-item">
                        <i class="chart-legend-swatch" style="--swatch:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"></i>
                        ${escapeHtml(displayFuelName(fuelType))}
                    </span>
                `).join("");
            }

            function renderPriceChart() {
                if (!priceChartEl) {
                    return;
                }
                const chartConfig = getChartConfig("price");
                const timeframeDays = getSelectedTimeframeDays();
                const priceChartWidth = chartConfig.width;
                const priceChartHeight = chartConfig.height;
                const pricePadding = chartConfig.padding;
                setChartViewport(priceChartEl, chartConfig);
                const priceTrend = fuelwisePayload.price_trend || { points: [], series: {} };
                const selectedFuelType = fuelwisePayload.filters?.fuel_type || "all";
                const normalizedSelectedFuelType = selectedFuelType === "SP95" ? "E10" : selectedFuelType;
                const allSeries = priceTrend.series || {};
                const visibleFuelTypes = (normalizedSelectedFuelType === "all"
                    ? (priceTrend.fuel_types || [])
                    : [normalizedSelectedFuelType]
                ).filter((fuelType) => fuelType !== "SP95" && Array.isArray(allSeries[fuelType]) && allSeries[fuelType].length);
                const visibleSeries = visibleFuelTypes.map((fuelType) => [fuelType, sliceSeriesWindow(allSeries[fuelType], timeframeDays)]);
                const summaryPoints = sliceSeriesWindow(Array.isArray(priceTrend.points) ? priceTrend.points : [], timeframeDays);

                const latestPoint = summaryPoints[summaryPoints.length - 1];
                const previousPoint = pointDaysAgo(summaryPoints, 1);
                const monthPoint = pointDaysAgo(summaryPoints, 30);
                priceValueEl.textContent = formatPrice(latestPoint?.price ?? priceTrend.latest_price);
                priceChangeEl.textContent = previousPoint ? formatPriceDelta(Number(latestPoint?.price || 0) - Number(previousPoint.price || 0)) : "-";
                pricePeriodChangeEl.textContent = monthPoint ? formatPriceDelta(Number(latestPoint?.price || 0) - Number(monthPoint.price || 0)) : "-";

                if (!visibleSeries.length || !summaryPoints.length) {
                    priceChartEl.innerHTML = "";
                    priceChartEl.setAttribute("hidden", "hidden");
                    priceEmptyEl.hidden = false;
                    priceTooltipEl.hidden = true;
                    renderPriceLegend([]);
                    priceValueEl.textContent = "-";
                    priceChangeEl.textContent = "-";
                    pricePeriodChangeEl.textContent = "-";
                    return;
                }

                priceChartEl.removeAttribute("hidden");
                priceEmptyEl.hidden = true;
                renderPriceLegend(visibleSeries);

                const dates = Array.from(new Set(
                    visibleSeries.flatMap(([, points]) => points.map((point) => point.date)).filter(Boolean)
                )).sort();
                const dateCount = dates.length;
                const chartSeries = visibleSeries.map(([fuelType, points]) => {
                    const pointMap = new Map(points.map((point) => [point.date, point]));
                    return [
                        fuelType,
                        dates.map((date, index) => {
                            const sourcePoint = pointMap.get(date);
                            return {
                                date,
                                price: Number(sourcePoint?.price || 0),
                                missing: !sourcePoint,
                                position: dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1)
                            };
                        })
                    ];
                });

                const values = chartSeries.flatMap(([, points]) => points.filter((point) => !point.missing).map((point) => Number(point.price || 0)));
                const minValue = Math.min(...values);
                const maxValue = Math.max(...values);
                const valueRange = Math.max(maxValue - minValue, 0.0001);
                const lineMarkup = chartSeries.map(([fuelType, points]) => {
                    let started = false;
                    const path = points.map((point) => {
                        if (point.missing) {
                            started = false;
                            return "";
                        }
                        const x = pricePadding.left + ((priceChartWidth - pricePadding.left - pricePadding.right) * Number(point.position || 0));
                        const ratio = (Number(point.price || 0) - minValue) / valueRange;
                        const y = priceChartHeight - pricePadding.bottom - ((priceChartHeight - pricePadding.top - pricePadding.bottom) * ratio);
                        const command = started ? "L" : "M";
                        started = true;
                        return `${command} ${x.toFixed(2)} ${y.toFixed(2)}`;
                    }).filter(Boolean).join(" ");
                    return `
                        <path
                            class="chart-line chart-line-price-series"
                            d="${path}"
                            style="--line-color:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"
                        />
                    `;
                }).join("");

                const labelStep = getVisibleLabelStep(dates.length, chartConfig.xTickCount);
                const xLabels = dates.map((date, index) => {
                    if (index % labelStep !== 0 && index !== dates.length - 1) {
                        return "";
                    }
                    const x = pricePadding.left + ((priceChartWidth - pricePadding.left - pricePadding.right) * (dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1)));
                    return `<text class="chart-x-label" x="${x}" y="${priceChartHeight - 14}" text-anchor="middle">${escapeHtml(formatChartDateLabel(date))}</text>`;
                }).join("");

                const yTicks = chartConfig.ySteps.map((step) => {
                    const value = minValue + (valueRange * step);
                    const y = priceChartHeight - pricePadding.bottom - ((priceChartHeight - pricePadding.top - pricePadding.bottom) * step);
                    return `
                        <g class="chart-tick">
                            <line x1="${pricePadding.left}" y1="${y}" x2="${priceChartWidth - pricePadding.right}" y2="${y}" />
                            <text x="${pricePadding.left - 10}" y="${y + 4}" text-anchor="end">${value.toFixed(3)}</text>
                        </g>
                    `;
                }).join("");

                const hoverTargets = dates.map((date, index) => {
                    const leftRatio = dateCount === 1 ? 0 : Math.max((index - 0.5) / Math.max(dateCount - 1, 1), 0);
                    const rightRatio = dateCount === 1 ? 1 : Math.min((index + 0.5) / Math.max(dateCount - 1, 1), 1);
                    const x = pricePadding.left + ((priceChartWidth - pricePadding.left - pricePadding.right) * (dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1)));
                    const rectX = pricePadding.left + ((priceChartWidth - pricePadding.left - pricePadding.right) * leftRatio);
                    const rectWidth = Math.max(18, ((priceChartWidth - pricePadding.left - pricePadding.right) * (rightRatio - leftRatio)));
                    return `
                        <g class="chart-hover-target" data-index="${index}">
                            <rect x="${rectX}" y="${pricePadding.top}" width="${rectWidth}" height="${priceChartHeight - pricePadding.top - pricePadding.bottom}" fill="transparent"></rect>
                            <line class="chart-hover-line" x1="${x}" y1="${pricePadding.top}" x2="${x}" y2="${priceChartHeight - pricePadding.bottom}" />
                        </g>
                    `;
                }).join("");

                priceChartEl.innerHTML = `
                    ${yTicks}
                    ${lineMarkup}
                    <g id="fuelwise-price-active-points"></g>
                    ${hoverTargets}
                    ${xLabels}
                `;

                const activePointsEl = priceChartEl.querySelector("#fuelwise-price-active-points");
                const hoverTargetEls = priceChartEl.querySelectorAll(".chart-hover-target");

                function hidePriceTooltip() {
                    hoverTargetEls.forEach((targetEl) => targetEl.classList.remove("is-active"));
                    if (activePointsEl) {
                        activePointsEl.innerHTML = "";
                    }
                    if (priceTooltipEl) {
                        priceTooltipEl.hidden = true;
                        priceTooltipEl.classList.remove("chart-tooltip-below", "chart-tooltip-above");
                    }
                }

                function showPriceTooltip(index) {
                    const activeDate = dates[index];
                    if (!activeDate || !priceTooltipEl) {
                        hidePriceTooltip();
                        return;
                    }
                    hoverTargetEls.forEach((targetEl) => {
                        targetEl.classList.toggle("is-active", Number(targetEl.dataset.index) === index);
                    });
                    const ratio = dateCount === 1 ? 0.5 : index / Math.max(dateCount - 1, 1);
                    const x = pricePadding.left + ((priceChartWidth - pricePadding.left - pricePadding.right) * ratio);
                    const visibleRows = chartSeries
                        .map(([fuelType, points]) => [fuelType, points[index]])
                        .filter(([, point]) => point && !point.missing);
                    const pointMarkup = visibleRows.map(([fuelType, point]) => {
                        const y = priceChartHeight - pricePadding.bottom - ((priceChartHeight - pricePadding.top - pricePadding.bottom) * ((Number(point.price || 0) - minValue) / valueRange));
                        return `
                            <circle
                                class="chart-point chart-point-shortage"
                                cx="${x}"
                                cy="${y}"
                                r="${chartConfig.pointRadius}"
                                style="--point-color:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"
                            ></circle>
                        `;
                    }).join("");
                    if (activePointsEl) {
                        activePointsEl.innerHTML = pointMarkup;
                    }

                    const rows = visibleRows.map(([fuelType, point]) => `
                        <span class="chart-tooltip-row">
                            <i class="chart-legend-swatch" style="--swatch:${escapeHtml(shortageSeriesColors[fuelType] || "#64d3ff")}"></i>
                            ${escapeHtml(displayFuelName(fuelType))}: ${escapeHtml(formatPrice(point.price))}
                        </span>
                    `).join("");
                    priceTooltipEl.hidden = false;
                    priceTooltipEl.innerHTML = `
                        <strong>${escapeHtml(priceTrend.area_name || fuelwiseCopy.prices.all_france)}</strong>
                        <span>${escapeHtml(fuelwiseCopy.prices.tooltip_date)}: ${escapeHtml(activeDate)}</span>
                        ${rows}
                    `;
                    priceTooltipEl.style.left = `${Math.min(Math.max((x / priceChartWidth) * 100, chartConfig.tooltipBounds.min), chartConfig.tooltipBounds.max)}%`;

                    const topPoint = visibleRows.reduce((minY, [, point]) => {
                        const y = priceChartHeight - pricePadding.bottom - ((priceChartHeight - pricePadding.top - pricePadding.bottom) * ((Number(point.price || 0) - minValue) / valueRange));
                        return Math.min(minY, y);
                    }, priceChartHeight - pricePadding.bottom);
                    const tooltipHeight = priceTooltipEl.offsetHeight || 96;
                    const spaceAbove = topPoint - pricePadding.top;
                    const spaceBelow = (priceChartHeight - pricePadding.bottom) - topPoint;
                    const prefersBelow = spaceAbove < (tooltipHeight + 24) && spaceBelow > spaceAbove;
                    priceTooltipEl.classList.toggle("chart-tooltip-below", prefersBelow);
                    priceTooltipEl.classList.toggle("chart-tooltip-above", !prefersBelow);
                    const anchorY = prefersBelow
                        ? Math.min(topPoint, priceChartHeight - pricePadding.bottom - tooltipHeight - 24)
                        : Math.max(topPoint, pricePadding.top + tooltipHeight + 24);
                    priceTooltipEl.style.top = `${anchorY}px`;
                }

                hoverTargetEls.forEach((targetEl) => {
                    const index = Number(targetEl.dataset.index);
                    targetEl.addEventListener("mouseenter", () => showPriceTooltip(index));
                    targetEl.addEventListener("mousemove", () => showPriceTooltip(index));
                    targetEl.addEventListener("click", () => showPriceTooltip(index));
                });
                priceChartEl.addEventListener("mouseleave", hidePriceTooltip);
            }

            function renderStationChart(payload) {
                if (!stationChartEl) {
                    return;
                }
                currentStationTrendPayload = payload;
                const chartConfig = getChartConfig("station");
                const stationChartWidth = chartConfig.width;
                const stationChartHeight = chartConfig.height;
                const stationPadding = chartConfig.padding;
                setChartViewport(stationChartEl, chartConfig);
                const series = Array.isArray(payload?.series) ? payload.series : [];
                const fuelTypes = orderedFuelTypes((Array.isArray(payload?.fuel_types) ? payload.fuel_types : []).filter((fuelType) => fuelType !== "SP95"));
                const maxTotal = Math.max(...series.map((item) => Number(item.total || 0)), 1);

                renderStationLegend(fuelTypes);
                if (stationChartValueEl) {
                    stationChartValueEl.textContent = formatInteger(payload?.totals?.latest_total || 0);
                }
                if (stationChartTotalEl) {
                    stationChartTotalEl.textContent = formatInteger(payload?.totals?.period_total || 0);
                }

                if (!series.length || !fuelTypes.length || !series.some((item) => Number(item.total || 0) > 0)) {
                    stationChartEl.innerHTML = "";
                    stationChartEl.setAttribute("hidden", "hidden");
                    stationChartEmptyEl.hidden = false;
                    stationChartEmptyEl.textContent = shortageify(fuelwiseCopy.station_chart.no_data);
                    if (stationChartTooltipEl) {
                        stationChartTooltipEl.hidden = true;
                    }
                    return;
                }

                stationChartEl.removeAttribute("hidden");
                stationChartEmptyEl.hidden = true;

                const plotWidth = stationChartWidth - stationPadding.left - stationPadding.right;
                const stepWidth = plotWidth / Math.max(series.length, 1);
                const barWidth = Math.max(8, Math.min(24, stepWidth * 0.72));
                const yTicks = chartConfig.ySteps.map((step) => {
                    const value = maxTotal * step;
                    const y = stationChartHeight - stationPadding.bottom - ((stationChartHeight - stationPadding.top - stationPadding.bottom) * step);
                    return `
                        <g class="chart-tick">
                            <line x1="${stationPadding.left}" y1="${y}" x2="${stationChartWidth - stationPadding.right}" y2="${y}" />
                            <text x="${stationPadding.left - 10}" y="${y + 4}" text-anchor="end">${Math.round(value)}</text>
                        </g>
                    `;
                }).join("");

                const labelStep = getVisibleLabelStep(series.length, chartConfig.xTickCount);
                const xLabels = series.map((point, index) => {
                    if (index % labelStep !== 0 && index !== series.length - 1) {
                        return "";
                    }
                    const x = stationPadding.left + (stepWidth * index) + (stepWidth / 2);
                    return `<text class="chart-x-label" x="${x}" y="${stationChartHeight - 14}" text-anchor="middle">${escapeHtml(formatChartDateLabel(point.date))}</text>`;
                }).join("");

                const barMarkup = series.map((point, index) => {
                    const x = stationPadding.left + (stepWidth * index) + ((stepWidth - barWidth) / 2);
                    let runningHeight = 0;
                    const visibleSegments = fuelTypes.filter((fuelType) => Number(point.segments?.[fuelType] || 0) > 0);
                    const segmentCount = visibleSegments.length;
                    const segments = visibleSegments.map((fuelType, segmentIndex) => {
                        const value = Number(point.segments?.[fuelType] || 0);
                        const segmentHeight = ((stationChartHeight - stationPadding.top - stationPadding.bottom) * value) / Math.max(maxTotal, 1);
                        const y = stationChartHeight - stationPadding.bottom - runningHeight - segmentHeight;
                        runningHeight += segmentHeight;
                        const isBottom = segmentIndex === 0;
                        const isTop = segmentIndex === segmentCount - 1;
                        const radius = 4;
                        return `
                            <path
                                class="station-bar-segment"
                                d="${buildStationSegmentPath(x, y, barWidth, segmentHeight, isTop, isBottom, radius)}"
                                fill="${escapeHtml(stationSeriesColors[fuelType] || stationSeriesColors.Unknown)}"
                            ></path>
                        `;
                    }).join("");
                    return `
                        <g class="station-bar-group" data-index="${index}">
                            ${segments}
                            <rect class="station-bar-hover" x="${x - Math.max((stepWidth - barWidth) / 2, 4)}" y="${stationPadding.top}" width="${Math.max(stepWidth, barWidth + 8)}" height="${stationChartHeight - stationPadding.top - stationPadding.bottom}" fill="transparent"></rect>
                        </g>
                    `;
                }).join("");

                stationChartEl.innerHTML = `
                    ${yTicks}
                    ${barMarkup}
                    ${xLabels}
                `;

                const barGroups = stationChartEl.querySelectorAll(".station-bar-group");

                function hideStationTooltip() {
                    barGroups.forEach((groupEl) => groupEl.classList.remove("is-active"));
                    if (stationChartTooltipEl) {
                        stationChartTooltipEl.hidden = true;
                    }
                }

                function showStationTooltip(index) {
                    const point = series[index];
                    if (!point || !stationChartTooltipEl) {
                        hideStationTooltip();
                        return;
                    }
                    barGroups.forEach((groupEl) => {
                        groupEl.classList.toggle("is-active", Number(groupEl.dataset.index) === index);
                    });
                    const rows = fuelTypes
                        .filter((fuelType) => Number(point.segments?.[fuelType] || 0) > 0)
                        .map((fuelType) => `
                            <span class="chart-tooltip-row">
                                <i class="chart-legend-swatch" style="--swatch:${escapeHtml(stationSeriesColors[fuelType] || stationSeriesColors.Unknown)}"></i>
                                ${escapeHtml(displayFuelName(fuelType))}: ${escapeHtml(formatInteger(point.segments?.[fuelType] || 0))}
                            </span>
                        `)
                        .join("");
                    stationChartTooltipEl.hidden = false;
                    stationChartTooltipEl.innerHTML = `
                        <strong>${escapeHtml(point.date || "")}</strong>
                        <span>${escapeHtml(fuelwiseCopy.station_chart.tooltip_total)}: ${escapeHtml(formatInteger(point.total || 0))}</span>
                        ${rows}
                    `;
                    const x = stationPadding.left + (stepWidth * index) + (stepWidth / 2);
                    const y = stationChartHeight - stationPadding.bottom - (((stationChartHeight - stationPadding.top - stationPadding.bottom) * Number(point.total || 0)) / Math.max(maxTotal, 1));
                    stationChartTooltipEl.style.left = `${Math.min(Math.max((x / stationChartWidth) * 100, chartConfig.tooltipBounds.min), chartConfig.tooltipBounds.max)}%`;
                    stationChartTooltipEl.style.top = `${Math.min(Math.max((y / stationChartHeight) * 100, 16), 76)}%`;
                }

                barGroups.forEach((groupEl) => {
                    const index = Number(groupEl.dataset.index);
                    groupEl.addEventListener("mouseenter", () => showStationTooltip(index));
                    groupEl.addEventListener("mousemove", () => showStationTooltip(index));
                    groupEl.addEventListener("click", () => showStationTooltip(index));
                });
                stationChartEl.addEventListener("mouseleave", hideStationTooltip);
            }

            const mapController = (function createMapController() {
                const mapEl = document.getElementById("fuelwise-france-map");
                const loadingEl = document.getElementById("fuelwise-map-loading");
                if (!mapEl) {
                    return { observe() {}, sync() {} };
                }

                let started = false;
                let map = null;
                let markerLayer = null;
                let departmentLayer = null;
                let departmentGeoJson = null;
                let stations = Array.isArray(fuelwisePayload.rupture_map_stations) ? fuelwisePayload.rupture_map_stations : [];
                let markerRequest = null;
                let moveFetchTimer = null;
                let skipNextMoveFetch = false;
                let lastMode = null;
                let lastSelectionCode = null;
                const mainlandBoundsArray = [[41.0, -5.7], [51.5, 9.8]];
                const markerLegendItems = [
                    { className: "legend-critical", label: "3+ fuel types affected" },
                    { className: "legend-warning", label: "2 fuel types affected" },
                    { className: "legend-stable", label: "1 fuel type affected" }
                ];
                const departmentLegendItems = [
                    { className: "legend-critical", label: "25%+ of stations affected" },
                    { className: "legend-warning", label: "12% to 25% affected" },
                    { className: "legend-stable", label: "0% to 12% affected" },
                    { className: "legend-muted", label: "No active shortage signal" }
                ];

                function loadStylesheet(href) {
                    return new Promise((resolve, reject) => {
                        const existing = document.querySelector(`link[href="${href}"]`);
                        if (existing) {
                            resolve();
                            return;
                        }
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = href;
                        link.crossOrigin = "";
                        link.onload = resolve;
                        link.onerror = reject;
                        document.head.appendChild(link);
                    });
                }

                function loadScript(src) {
                    return new Promise((resolve, reject) => {
                        if (window.L) {
                            resolve();
                            return;
                        }
                        const script = document.createElement("script");
                        script.src = src;
                        script.crossOrigin = "";
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }

                async function loadDepartmentBoundaries() {
                    if (departmentGeoJson) {
                        return departmentGeoJson;
                    }
                    const response = await fetch("/assets/departements-1000m.geojson", {
                        headers: { "Accept": "application/json" }
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to load department boundaries (${response.status})`);
                    }
                    const raw = await response.json();
                    departmentGeoJson = {
                        ...raw,
                        features: Array.isArray(raw.features)
                            ? raw.features.filter((feature) => {
                                const code = normalizeDepartmentCode(feature?.properties?.code);
                                return code && !/^9[78]/.test(code);
                            })
                            : []
                    };
                    return departmentGeoJson;
                }

                function getMainlandBounds() {
                    return window.L
                        ? L.latLngBounds(L.latLng(mainlandBoundsArray[0][0], mainlandBoundsArray[0][1]), L.latLng(mainlandBoundsArray[1][0], mainlandBoundsArray[1][1]))
                        : null;
                }

                function getDepartmentMetrics() {
                    const metrics = new Map();
                    const sourceDepartments = Array.isArray(fuelwisePayload.map_departments) && fuelwisePayload.map_departments.length
                        ? fuelwisePayload.map_departments
                        : (fuelwisePayload.departments || []);
                    sourceDepartments.forEach((department) => {
                        metrics.set(normalizeDepartmentCode(department.code), department);
                    });
                    return metrics;
                }

                function getDepartmentMode() {
                    return fuelwisePayload.filters?.department_code ? "stations" : "departments";
                }

                function getDepartmentFillColor(issueRate) {
                    const value = Number(issueRate || 0);
                    if (value >= 25) {
                        return "#d9483b";
                    }
                    if (value >= 12) {
                        return "#f47f3d";
                    }
                    if (value > 0) {
                        return "#ffb24a";
                    }
                    return "#173247";
                }

                function updateLegend(mode) {
                    if (!mapLegendEl) {
                        return;
                    }
                    const items = mode === "stations" ? markerLegendItems : departmentLegendItems;
                    mapLegendEl.innerHTML = items.map((item) => `
                        <span><i class="legend-dot ${escapeHtml(item.className)}"></i> ${escapeHtml(item.label)}</span>
                    `).join("");
                }

                function buildDepartmentPopup(properties, metrics, code) {
                    const affected = Number(metrics?.issue_station_count || 0);
                    const total = Number(metrics?.total_station_count || 0);
                    const issueRate = Number(metrics?.issue_rate || 0);
                    return `
                        <div class="fuelwise-popup">
                            <strong>${escapeHtml(properties.nom || metrics?.name || code)}</strong>
                            <div>${escapeHtml(code)}</div>
                            <div class="popup-metric"><strong>${escapeHtml(formatPercent(issueRate))}</strong> of stations affected</div>
                            <div>${escapeHtml(`${formatInteger(affected)} / ${formatInteger(total)} stations`)}</div>
                        </div>
                    `;
                }

                function drawDepartments() {
                    if (!map || !window.L || !departmentGeoJson) {
                        return;
                    }
                    if (departmentLayer) {
                        map.removeLayer(departmentLayer);
                        departmentLayer = null;
                    }
                    const departmentMetrics = getDepartmentMetrics();
                    const selectedCode = normalizeDepartmentCode(fuelwisePayload.filters?.department_code);
                    departmentLayer = L.geoJSON(departmentGeoJson, {
                        style(feature) {
                            const code = normalizeDepartmentCode(feature?.properties?.code);
                            const metrics = departmentMetrics.get(code);
                            const issueRate = Number(metrics?.issue_rate || 0);
                            const isSelected = Boolean(selectedCode) && code === selectedCode;
                            return {
                                color: isSelected ? "#f6f8fb" : "rgba(255,255,255,0.18)",
                                weight: isSelected ? 2.4 : 1,
                                fillColor: getDepartmentFillColor(issueRate),
                                fillOpacity: isSelected ? 0.72 : (issueRate > 0 ? 0.62 : 0.24)
                            };
                        },
                        onEachFeature(feature, layer) {
                            const code = normalizeDepartmentCode(feature?.properties?.code);
                            const metrics = departmentMetrics.get(code);
                            layer.bindTooltip(buildDepartmentPopup(feature.properties || {}, metrics, code), {
                                sticky: true,
                                direction: "top",
                                className: "department-tooltip"
                            });
                            layer.on({
                                mouseover() {
                                    layer.setStyle({
                                        weight: 2.2,
                                        color: "#f6f8fb"
                                    });
                                },
                                mouseout() {
                                    departmentLayer.resetStyle(layer);
                                },
                                click() {
                                    const nextCode = code;
                                    const nextName = feature?.properties?.nom || metrics?.name || nextCode;
                                    applyDepartmentFilter(nextCode, nextName);
                                }
                            });
                        }
                    }).addTo(map);
                }

                function drawMarkers({ fitToMarkers = false } = {}) {
                    if (!map || !markerLayer || !window.L) {
                        return;
                    }
                    markerLayer.clearLayers();
                    const franceBounds = getMainlandBounds();
                    const stationBounds = [];
                    const colorByStatus = {
                        critical: "#d9483b",
                        warning: "#f47f3d",
                        stable: "#ffb24a"
                    };

                    stations.forEach((station) => {
                        if (typeof station.lat !== "number" || typeof station.lng !== "number") {
                            return;
                        }
                        const latLng = [station.lat, station.lng];
                        stationBounds.push(latLng);
                        const fuels = Array.isArray(station.fuel_list) ? station.fuel_list.join(", ") : "";
                        const marker = L.circleMarker(latLng, {
                            radius: Math.max(6, Math.min(14, 5 + Number(station.fuel_count || 1) * 2)),
                            color: colorByStatus[station.status_level] || colorByStatus.stable,
                            weight: 2,
                            fillColor: colorByStatus[station.status_level] || colorByStatus.stable,
                            fillOpacity: 0.45
                        });
                        marker.bindPopup(`
                            <div class="fuelwise-popup">
                                <strong>${escapeHtml(station.name || fuelwiseCopy.common_station)}</strong>
                                <div>${escapeHtml(station.city || "")}</div>
                                ${station.address ? `<div>${escapeHtml(station.address)}</div>` : ""}
                                ${fuels ? `<div><b>${escapeHtml(fuelwiseCopy.map.popup_label)}:</b> ${escapeHtml(fuels)}</div>` : ""}
                            </div>
                        `);
                        marker.on("click", () => {
                            focusStationFromMap(station);
                        });
                        marker.addTo(markerLayer);
                    });

                    if (fitToMarkers) {
                        skipNextMoveFetch = true;
                        if (stationBounds.length) {
                            map.fitBounds(L.latLngBounds(stationBounds).pad(0.18));
                        } else if (franceBounds) {
                            map.fitBounds(franceBounds);
                        }
                    }
                    if (loadingEl) {
                        loadingEl.hidden = true;
                    }
                }

                async function fetchVisibleStations({ fitToMarkers = false } = {}) {
                    if (!map) {
                        return;
                    }
                    if (markerRequest) {
                        markerRequest.abort();
                    }
                    const requestController = new AbortController();
                    markerRequest = requestController;
                    const params = new URLSearchParams({
                        source_type: fuelwisePayload.snapshot_source_type || "official",
                        snapshot_date: fuelwisePayload.latest_snapshot_date || "",
                        fuel_type: fuelwisePayload.filters?.fuel_type || "all",
                        limit: "1500"
                    });
                    if (fuelwisePayload.filters?.department_code) {
                        params.set("department_code", fuelwisePayload.filters.department_code);
                    }
                    const bounds = map.getBounds?.();
                    if (bounds && bounds.isValid()) {
                        params.set("lat_min", String(bounds.getSouth()));
                        params.set("lat_max", String(bounds.getNorth()));
                        params.set("lng_min", String(bounds.getWest()));
                        params.set("lng_max", String(bounds.getEast()));
                    }
                    if (loadingEl) {
                        loadingEl.hidden = false;
                        loadingEl.textContent = fuelwiseCopy.map.loading;
                    }
                    try {
                        const response = await fetch(`${fuelwiseUrls.mapMarkers}?${params.toString()}`, {
                            headers: { "Accept": "application/json" },
                            signal: requestController.signal
                        });
                        if (!response.ok) {
                            throw new Error(`Request failed with ${response.status}`);
                        }
                        const payload = await response.json();
                        stations = Array.isArray(payload.stations) ? payload.stations : [];
                        drawMarkers({ fitToMarkers });
                    } catch (error) {
                        if (error.name === "AbortError") {
                            return;
                        }
                        console.error("fuelwise map markers failed", error);
                        if (loadingEl) {
                            loadingEl.hidden = false;
                            loadingEl.textContent = fuelwiseCopy.map.failed;
                        }
                    } finally {
                        if (markerRequest === requestController) {
                            markerRequest = null;
                        }
                    }
                }

                function scheduleVisibleStationFetch(options = {}) {
                    if (!started || !map) {
                        return;
                    }
                    if (moveFetchTimer) {
                        window.clearTimeout(moveFetchTimer);
                    }
                    moveFetchTimer = window.setTimeout(() => {
                        moveFetchTimer = null;
                        fetchVisibleStations(options);
                    }, 140);
                }

                function clearMarkers() {
                    if (markerLayer) {
                        markerLayer.clearLayers();
                    }
                }

                function syncMapScene() {
                    if (!started || !map) {
                        return;
                    }
                    const mode = getDepartmentMode();
                    const selectedCode = normalizeDepartmentCode(fuelwisePayload.filters?.department_code);

                    updateLegend(mode);
                    drawDepartments();

                    if (mode === "stations") {
                        if (departmentLayer && selectedCode && selectedCode !== lastSelectionCode) {
                            departmentLayer.eachLayer((layer) => {
                                const code = normalizeDepartmentCode(layer?.feature?.properties?.code);
                                if (code === selectedCode) {
                                    const bounds = layer.getBounds?.();
                                    if (bounds?.isValid?.()) {
                                        skipNextMoveFetch = true;
                                        map.fitBounds(bounds.pad(0.08));
                                    }
                                }
                            });
                        }
                        scheduleVisibleStationFetch({ fitToMarkers: false });
                        if (loadingEl) {
                            loadingEl.hidden = false;
                            loadingEl.textContent = fuelwiseCopy.map.loading;
                        }
                    } else {
                        if (markerRequest) {
                            markerRequest.abort();
                            markerRequest = null;
                        }
                        if (moveFetchTimer) {
                            window.clearTimeout(moveFetchTimer);
                            moveFetchTimer = null;
                        }
                        clearMarkers();
                        if (selectedCode !== lastSelectionCode || lastMode !== mode) {
                            const bounds = getMainlandBounds();
                            if (bounds) {
                                skipNextMoveFetch = true;
                                map.fitBounds(bounds);
                            }
                        }
                        if (loadingEl) {
                            loadingEl.hidden = true;
                        }
                    }
                    lastMode = mode;
                    lastSelectionCode = selectedCode;
                }

                async function startMap() {
                    if (started) {
                        return;
                    }
                    started = true;
                    try {
                        await loadStylesheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
                        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
                        await loadDepartmentBoundaries();
                        const franceBounds = getMainlandBounds();
                        map = L.map(mapEl, {
                            zoomControl: true,
                            minZoom: 5,
                            maxZoom: 12,
                            maxBounds: franceBounds.pad(0.1),
                            maxBoundsViscosity: 0.85
                        });
                        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(map);
                        markerLayer = L.layerGroup().addTo(map);
                        map.fitBounds(franceBounds);
                        map.on("moveend", () => {
                            if (getDepartmentMode() !== "stations") {
                                return;
                            }
                            if (skipNextMoveFetch) {
                                skipNextMoveFetch = false;
                                return;
                            }
                            scheduleVisibleStationFetch();
                        });
                        syncMapScene();
                    } catch (error) {
                        console.error("fuelwise map failed", error);
                        if (loadingEl) {
                            loadingEl.hidden = false;
                            loadingEl.textContent = fuelwiseCopy.map.failed;
                        }
                    }
                }

                return {
                    observe() {
                        if ("IntersectionObserver" in window) {
                            const observer = new IntersectionObserver((entries) => {
                                if (entries.some((entry) => entry.isIntersecting)) {
                                    observer.disconnect();
                                    startMap();
                                }
                            }, { rootMargin: "200px" });
                            observer.observe(mapEl);
                        } else {
                            startMap();
                        }
                    },
                    sync(nextStations) {
                        stations = Array.isArray(nextStations) ? nextStations : [];
                        if (started && map) {
                            syncMapScene();
                        }
                    }
                };
            })();

            async function loadDepartmentDetail(code, name) {
                if (!code) {
                    resetDetail(fuelwisePayload);
                    return;
                }
                selectedDetailDepartmentCode = code;
                selectedDetailDepartmentName = name || "";
                setActiveDepartment(code);
                if (detailTitleEl) {
                    detailTitleEl.textContent = replaceTokens(fuelwiseCopy.detail.department_title, { name: selectedDetailDepartmentName });
                }
                renderStations([]);
                if (detailListEl) {
                    detailListEl.innerHTML = `<tr><td colspan="3" class="empty-state-cell">${escapeHtml(fuelwiseCopy.detail.loading)}</td></tr>`;
                }
                resetStationChart();

                const params = new URLSearchParams({
                    source_type: fuelwisePayload.snapshot_source_type || "official",
                    snapshot_date: fuelwisePayload.latest_snapshot_date || "",
                    department_code: code,
                    fuel_type: fuelwisePayload.filters?.fuel_type || "all",
                    limit: "250"
                });

                try {
                    const response = await fetch(`${fuelwiseUrls.drilldown}?${params.toString()}`, {
                        headers: { "Accept": "application/json" }
                    });
                    if (!response.ok) {
                        throw new Error(`Request failed with ${response.status}`);
                    }
                    const payload = await response.json();
                    if (detailTitleEl) {
                        detailTitleEl.textContent = replaceTokens(fuelwiseCopy.detail.department_title, {
                            name: payload.department_name || selectedDetailDepartmentName
                        });
                    }
                    renderStations(payload.stations || []);
                    resetStationChart();
                    if (pendingStationSelection && String(pendingStationSelection.departmentCode || "") === String(code || "")) {
                        const stationExists = Array.isArray(payload.stations)
                            && payload.stations.some((station) => Number(station.station_id) === Number(pendingStationSelection.stationId));
                        if (stationExists) {
                            scrollStationIntoView(pendingStationSelection.stationId);
                        }
                        await loadStationTrend(pendingStationSelection.stationId, pendingStationSelection.stationName);
                        pendingStationSelection = null;
                    }
                } catch (error) {
                    if (detailListEl) {
                        detailListEl.innerHTML = `<tr><td colspan="3" class="empty-state-cell">${escapeHtml(fuelwiseCopy.detail.failed)}</td></tr>`;
                    }
                    pendingStationSelection = null;
                }
            }

            async function focusStationFromMap(station) {
                if (!station?.station_id) {
                    return;
                }
                const stationId = Number(station.station_id);
                const stationName = station.name || fuelwiseCopy.common_station;
                const departmentCode = station.department_code || "";
                const currentDepartmentCode = normalizeDepartmentCode(fuelwisePayload.filters?.department_code);
                const stationAlreadyVisible = detailListEl?.querySelector(`.station-item[data-station-id="${String(stationId)}"]`);

                if (stationAlreadyVisible) {
                    scrollStationIntoView(stationId);
                    await loadStationTrend(stationId, stationName);
                    return;
                }

                if (departmentCode && normalizeDepartmentCode(departmentCode) !== currentDepartmentCode) {
                    pendingStationSelection = {
                        stationId,
                        stationName,
                        departmentCode,
                    };
                    const departmentName = station.department_name || station.city || departmentCode;
                    applyDepartmentFilter(departmentCode, departmentName);
                    return;
                }

                scrollStationIntoView(stationId);
                await loadStationTrend(stationId, stationName);
            }

            async function loadStationTrend(stationId, stationName) {
                if (!stationId) {
                    resetStationChart();
                    return;
                }
                selectedStationId = Number(stationId);
                selectedStationName = stationName || fuelwiseCopy.common_station;
                setActiveStation(selectedStationId);
                if (stationChartTitleEl) {
                    stationChartTitleEl.textContent = replaceTokens(fuelwiseCopy.station_chart.station_title, { station: selectedStationName });
                }
                if (stationChartNoteEl) {
                    stationChartNoteEl.textContent = `Loading ${getSelectedTimeframeLabel().toLowerCase()} for this station...`;
                }
                if (stationChartEl) {
                    stationChartEl.innerHTML = "";
                    stationChartEl.setAttribute("hidden", "hidden");
                }
                if (stationChartEmptyEl) {
                    stationChartEmptyEl.hidden = false;
                    stationChartEmptyEl.textContent = shortageify(fuelwiseCopy.station_chart.loading);
                }
                renderStationLegend([]);
                if (stationTrendRequest) {
                    stationTrendRequest.abort();
                }
                const requestController = new AbortController();
                stationTrendRequest = requestController;

                const params = new URLSearchParams({
                    station_id: String(stationId),
                    source_type: fuelwisePayload.snapshot_source_type || "official",
                    snapshot_date: fuelwisePayload.latest_snapshot_date || "",
                    fuel_type: fuelwisePayload.filters?.fuel_type || "all",
                    days: String(getSelectedTimeframeDays() || 365)
                });

                try {
                    const response = await fetch(`${fuelwiseUrls.stationTrend}?${params.toString()}`, {
                        headers: { "Accept": "application/json" },
                        signal: requestController.signal
                    });
                    if (!response.ok) {
                        throw new Error(`Request failed with ${response.status}`);
                    }
                    const payload = await response.json();
                    if (stationChartTitleEl) {
                        stationChartTitleEl.textContent = replaceTokens(fuelwiseCopy.station_chart.station_title, {
                            station: payload.station_name || selectedStationName
                        });
                    }
                    if (stationChartNoteEl) {
                        stationChartNoteEl.textContent = `${formatInteger(payload.totals?.period_total || 0)} shortage instances over ${payload.days || 30} days.`;
                    }
                    renderStationChart(payload);
                } catch (error) {
                    if (error.name === "AbortError") {
                        return;
                    }
                    if (stationChartTitleEl) {
                        stationChartTitleEl.textContent = replaceTokens(fuelwiseCopy.station_chart.station_title, { station: selectedStationName });
                    }
                    if (stationChartNoteEl) {
                        stationChartNoteEl.textContent = shortageify(fuelwiseCopy.station_chart.failed_note);
                    }
                    if (stationChartEl) {
                        stationChartEl.innerHTML = "";
                        stationChartEl.setAttribute("hidden", "hidden");
                    }
                    if (stationChartEmptyEl) {
                        stationChartEmptyEl.hidden = false;
                        stationChartEmptyEl.textContent = shortageify(fuelwiseCopy.station_chart.failed);
                    }
                } finally {
                    if (stationTrendRequest === requestController) {
                        stationTrendRequest = null;
                    }
                }
            }

            function updateUrlFromPayload(payload) {
                const params = new URLSearchParams();
                const nextFuelType = payload.filters?.fuel_type === "SP95" ? "E10" : payload.filters?.fuel_type;
                if ((nextFuelType || "all") !== "all") {
                    params.set("fuel_type", nextFuelType);
                }
                if (payload.filters?.department_code) {
                    params.set("department_code", payload.filters.department_code);
                }
                if (getSelectedTimeframeDays()) {
                    params.set("timeframe", String(getSelectedTimeframeDays()));
                }
                const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
                window.history.replaceState({}, "", nextUrl);
            }

            function renderAll(payload) {
                fuelwisePayload = payload;
                renderHero(payload);
                renderMetrics(payload);
                renderSelectOptions(fuelEl, payload.filters?.fuel_options, payload.filters?.fuel_type || "all", "fuel");
                renderSelectOptions(departmentEl, payload.filters?.department_options, payload.filters?.department_code || "", "department");
                renderDepartments(payload);
                renderPriority(payload);
                renderBars(payload);
                renderActiveFilters(payload);
                syncScopedDetail(payload);
                if (selectedStationId && !detailStations.some((station) => Number(station.station_id) === Number(selectedStationId))) {
                    resetStationChart();
                } else if (selectedStationId) {
                    setActiveStation(selectedStationId);
                }
                renderShortageChart();
                renderPriceChart();
                mapController.sync(payload.rupture_map_stations || []);
                updateUrlFromPayload(payload);
            }

            function rerenderChartsForViewport() {
                renderShortageChart();
                renderPriceChart();
                if (currentStationTrendPayload && selectedStationId) {
                    renderStationChart(currentStationTrendPayload);
                }
            }

            async function refreshDashboard() {
                if (!fuelEl || !departmentEl) {
                    return;
                }
                const params = new URLSearchParams();
                if (fuelEl.value) {
                    params.set("fuel_type", fuelEl.value);
                }
                if (departmentEl.value) {
                    params.set("department_code", departmentEl.value);
                }
                if (dashboardRequest) {
                    dashboardRequest.abort();
                }
                const requestController = new AbortController();
                dashboardRequest = requestController;
                setPageLoading(true);

                try {
                    const response = await fetch(`${fuelwiseUrls.dashboard}${params.toString() ? `?${params.toString()}` : ""}`, {
                        headers: { "Accept": "application/json" },
                        signal: requestController.signal
                    });
                    if (!response.ok) {
                        throw new Error(`Request failed with ${response.status}`);
                    }
                    const payload = await response.json();
                    renderAll(payload);
                    if (pendingStationSelection) {
                        const matchingStation = (payload.rupture_stations || []).find(
                            (station) => Number(station.station_id) === Number(pendingStationSelection.stationId)
                        );
                        if (matchingStation) {
                            scrollStationIntoView(matchingStation.station_id);
                            await loadStationTrend(matchingStation.station_id, pendingStationSelection.stationName || matchingStation.name);
                        }
                        pendingStationSelection = null;
                    }
                } catch (error) {
                    if (error.name !== "AbortError") {
                        console.error("fuelwise dashboard refresh failed", error);
                    }
                } finally {
                    if (dashboardRequest === requestController) {
                        setPageLoading(false);
                    }
                }
            }

            formEl?.addEventListener("submit", (event) => {
                event.preventDefault();
                refreshDashboard();
            });
            Object.values(filterComboboxes).forEach((state) => {
                state.inputEl?.addEventListener("focus", () => {
                    openCombobox(state.kind, "");
                });
                state.inputEl?.addEventListener("click", () => {
                    openCombobox(state.kind, "");
                });
                state.inputEl?.addEventListener("input", (event) => {
                    openCombobox(state.kind, String(event.target.value || ""));
                });
                state.inputEl?.addEventListener("keydown", (event) => {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        openCombobox(state.kind, state.inputEl.value);
                        state.listEl?.querySelector(".filter-combobox-option")?.focus();
                        return;
                    }
                    if (event.key === "Enter") {
                        const firstMatch = getComboboxMatches(state, state.inputEl.value)[0];
                        if (firstMatch) {
                            event.preventDefault();
                            setComboboxValue(state.kind, firstMatch.value, { refresh: true });
                        }
                        return;
                    }
                    if (event.key === "Escape") {
                        closeCombobox(state.kind);
                    }
                });
                state.listEl?.addEventListener("click", (event) => {
                    const optionEl = event.target.closest(".filter-combobox-option");
                    if (!optionEl) {
                        return;
                    }
                    setComboboxValue(state.kind, optionEl.dataset.value, { refresh: true });
                });
            });
            document.addEventListener("click", (event) => {
                const target = event.target;
                if (!(target instanceof Node)) {
                    return;
                }
                Object.entries(filterComboboxes).forEach(([kind, state]) => {
                    const wrapper = state.inputEl?.closest(".filter-combobox");
                    if (wrapper && !wrapper.contains(target)) {
                        closeCombobox(kind);
                    }
                });
            });
            async function handleTimeframeChange() {
                updateTimeframeSummary();
                renderActiveFilters(fuelwisePayload);
                renderShortageChart();
                renderPriceChart();
                updateUrlFromPayload(fuelwisePayload);
                if (selectedStationId) {
                    await loadStationTrend(selectedStationId, selectedStationName);
                } else {
                    resetStationChart();
                }
            }

            timeframeEl?.addEventListener("input", handleTimeframeChange);
            timeframeEl?.addEventListener("change", handleTimeframeChange);
            stationSearchEl?.addEventListener("input", (event) => {
                stationSearchTerm = String(event.target.value || "");
                renderStations(detailStations, { store: false });
            });
            clearStationSearchEl?.addEventListener("click", () => {
                stationSearchTerm = "";
                if (stationSearchEl) {
                    stationSearchEl.value = "";
                }
                renderStations(detailStations, { store: false });
            });
            activeFiltersEl?.addEventListener("click", (event) => {
                const badgeEl = event.target.closest(".filter-badge");
                if (!badgeEl) {
                    return;
                }
                if (badgeEl.dataset.filterKind === "fuel" && fuelEl) {
                    setComboboxValue("fuel", "all");
                }
                if (badgeEl.dataset.filterKind === "department" && departmentEl) {
                    setComboboxValue("department", "");
                    pendingStationSelection = null;
                    resetStationChart();
                }
                if (badgeEl.dataset.filterKind === "timeframe" && timeframeEl) {
                    timeframeEl.value = "0";
                    handleTimeframeChange();
                    return;
                }
                refreshDashboard();
            });

            departmentsBodyEl?.addEventListener("click", (event) => {
                const rowEl = event.target.closest(".department-row");
                if (rowEl) {
                    applyDepartmentFilter(rowEl.dataset.departmentCode, rowEl.dataset.departmentName);
                }
            });
            departmentsBodyEl?.addEventListener("keydown", (event) => {
                const rowEl = event.target.closest(".department-row");
                if (rowEl && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    applyDepartmentFilter(rowEl.dataset.departmentCode, rowEl.dataset.departmentName);
                }
            });
            chipListEl?.addEventListener("click", (event) => {
                const chipEl = event.target.closest(".department-chip");
                if (chipEl) {
                    applyDepartmentFilter(chipEl.dataset.departmentCode, chipEl.dataset.departmentName);
                }
            });
            barChartEl?.addEventListener("click", (event) => {
                const barEl = event.target.closest(".bar-row");
                if (!barEl) {
                    return;
                }
                const match = (fuelwisePayload.departments || []).find((department) =>
                    department.code === barEl.dataset.departmentCode || department.name === barEl.dataset.departmentName
                );
                if (match) {
                    applyDepartmentFilter(match.code, match.name);
                }
            });
            detailListEl?.addEventListener("click", (event) => {
                const stationEl = event.target.closest(".station-item");
                if (stationEl) {
                    loadStationTrend(stationEl.dataset.stationId, stationEl.dataset.stationName);
                }
            });
            detailListEl?.addEventListener("keydown", (event) => {
                const stationEl = event.target.closest(".station-item");
                if (stationEl && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    loadStationTrend(stationEl.dataset.stationId, stationEl.dataset.stationName);
                }
            });

            window.addEventListener("resize", () => {
                if (resizeFrame) {
                    window.cancelAnimationFrame(resizeFrame);
                }
                resizeFrame = window.requestAnimationFrame(() => {
                    rerenderChartsForViewport();
                    resizeFrame = null;
                });
            });

            document.addEventListener("click", (event) => {
                if (!event.target.closest(".chart-shell")) {
                    shortageTooltipEl.hidden = true;
                    priceTooltipEl.hidden = true;
                    stationChartTooltipEl.hidden = true;
                }
            });

            renderAll(fuelwisePayload);
            mapController.observe();
        })();
