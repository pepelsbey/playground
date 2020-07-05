customElements.define('shower-slide', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });

        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="slide/slide.css">
            <slot></slot>
            <slot name="styles"></slot>
        `;

        this.shadowRoot.appendChild(
            template.content.cloneNode(true)
        );

        const styles = this.shadowRoot
            .querySelector('slot[name="styles"]')
            .assignedNodes();
        if (styles.length) {
            this.shadowRoot.appendChild(
                styles[0]
            );
        }
    }
});
