/* Magic Mirror Module: MMM-Humanize-Duration
 * Version: 1.0.0
 *
 * By Ricardo Gonzalez https://github.com/ryck/MMM-Humanize-Duration
 * MIT Licensed.
 */
Module.register("MMM-Humanize-Duration", {
	defaults: {
		updateInterval: 60 * 1 * 1000, // Every minute
		animationSpeed: 500,
		initialLoadDelay: 0, // start delay in milliseconds.
		options: {
			round: true,
			units: ["y", "mo", "w", "d"],
			largest: 3,
		},
		showDate: false,
		debug: false,
	},
	start: function () {
		this.updateTimer = null;
		this.hasValidDate = false;
		this.ensureHumanizeOptions();
		this.validateDate();
		this.scheduleUpdate(true);
	},
	getStyles: () => ["MMM-Humanize-Duration.css"],
	// Define required scripts.
	getScripts: function () {
		return [
			"moment.js",
			this.file("node_modules/humanize-duration/humanize-duration.js"),
		];
	},
	//Define header for module.
	getHeader: function () {
		return this.data.header;
	},
	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		if (!this.config.date) {
			wrapper.innerHTML = "Please set the date.";
			wrapper.className = "dimmed";
			return wrapper;
		}
		if (!this.hasValidDate) {
			wrapper.innerHTML = "Invalid date configured.";
			wrapper.className = "dimmed";
			return wrapper;
		}
		wrapper.className = "mmm-humanize-duration";
		if (this.config.showDate) {
			const dateRow = document.createElement("div");
			dateRow.className =
				"mmm-humanize-duration-date xsmall dimmed align-right";
			dateRow.innerHTML = this.config.date;
			wrapper.appendChild(dateRow);
		}
		var durationRow = document.createElement("div");
		durationRow.className =
			"mmm-humanize-duration-value small bold align-right";
		durationRow.innerHTML = this.formatDuration();
		wrapper.appendChild(durationRow);
		return wrapper;
	},
	scheduleUpdate: function (instant) {
		var interval = this.config.updateInterval;
		this.stopUpdateTimer();
		if (instant) {
			this.updateDom(this.config.animationSpeed);
		}
		this.updateTimer = setInterval(() => {
			this.updateDom(this.config.animationSpeed);
		}, interval);
	},
	stopUpdateTimer: function () {
		if (this.updateTimer) {
			clearInterval(this.updateTimer);
			this.updateTimer = null;
		}
	},
	suspend: function () {
		this.stopUpdateTimer();
	},
	resume: function () {
		this.scheduleUpdate(false);
	},
	formatDuration: function () {
		if (!this.hasValidDate) {
			return "";
		}
		var start = moment(this.config.date);
		var diff = moment().diff(start);
		return humanizeDuration(diff, this.config.options);
	},
	ensureHumanizeOptions: function () {
		if (!this.config.options || typeof this.config.options !== "object") {
			this.config.options = Object.assign({}, this.defaults.options);
		} else {
			this.config.options = Object.assign(
				{},
				this.defaults.options,
				this.config.options,
			);
		}
		if (!this.config.options.language) {
			const fallbackLanguage =
				typeof config !== "undefined" && config.language
					? config.language
					: "en";
			this.config.options.language = fallbackLanguage;
		}
	},
	validateDate: function () {
		if (!this.config.date) {
			this.hasValidDate = false;
			return;
		}
		var parsedDate = moment(this.config.date);
		this.hasValidDate = parsedDate.isValid();
		if (!this.hasValidDate) {
			if (this.config.debug) {
				Log.info(`${this.name}:`, "Invalid date supplied:", this.config.date);
			}
		}
	},
});
