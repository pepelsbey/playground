(() => {
	class Tabs {
		/**
		 * @param {HTMLElement} element
		 */
		constructor(element) {
			this.element = element;
			this.buttons = new Map([...element.querySelectorAll('[role="tab"]')]
				.map(entry => [entry.getAttribute('aria-controls'), entry])
			);
			this.containers = new Map([...document.querySelectorAll('[role="tabpanel"]')]
				.filter(entry => this.buttons.has(entry.id))
				.map(entry => [entry.id, entry])
			);
			this.current = null;

			this.init();
		}

		/**
		 * @param {string} name
		 */
		select(name) {
			for (const [key, button] of this.buttons.entries()) {
				if (key === name) {
					button.setAttribute('tabindex', '0');
				} else {
					button.setAttribute('tabindex', '-1');
				}

				button.setAttribute('aria-selected', key === name);
			}

			for (const [key, container] of this.containers.entries()) {
				if (key === name) {
					container.removeAttribute('hidden');
				} else {
					container.setAttribute('hidden', true);
				}
			}
		}

		init() {
			const keys = [...this.buttons.keys()];
			const active = [...this.buttons.values()].find(button => {
				return (button.getAttribute('aria-selected') === 'true');
			});

			this.element.addEventListener('keydown', event => {
				if (event.code === 'Home') {
					event.preventDefault();

					this.buttons.get(keys[0]).focus();
				}

				if (event.code === 'End') {
					event.preventDefault();

					this.buttons.get(keys[keys.length - 1]).focus();
				}

				if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
					event.preventDefault();

					this.buttons.get(keys[Math.max(0, this.current - 1)]).focus();
				}

				if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
					event.preventDefault();

					this.buttons.get(keys[Math.min(keys.length - 1, this.current + 1)]).focus();
				}
			});

			for (const [key, button] of this.buttons.entries()) {
				button.addEventListener('click', event => {
					event.preventDefault();

					this.select(key);
				});

				button.addEventListener('focus', () => {
					this.current = keys.indexOf(key);
				});

				button.addEventListener('keypress', event => {
					if (event.code === 'Enter' || event.code === 'Space') {
						event.preventDefault();

						this.select(key);
					}
				});
			}

			this.select(active !== null ? active.getAttribute('aria-controls') : keys[0]);
		}

		static create(element) {
			return new Tabs(element);
		}
	}

	const containers = document.querySelectorAll('[role="tablist"]');

	for (const container of containers) {
		Tabs.create(container);
	}
})();
