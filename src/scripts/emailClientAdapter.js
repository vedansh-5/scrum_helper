class EmailClientAdapter {
    constructor() {
        this.clientConfigs = {
            'google-groups': {
                selectors: {
                    body: 'c-wiz [aria-label="Compose a message"][role=textbox]',
                    subject: 'c-wiz input[aria-label=Subject]'
                },
                eventTypes: {
                    contentChange: 'paste',
                    subjectChange: 'input'
                }
            },
            'gmail': {
                selectors: {
                    body: '.Am.Al.editable',
                    subject: 'input[name="subjectbox"]'
                },
                eventTypes: {
                    contentChange: 'input',
                    subjectChange: 'input'
                }
            },
            'outlook': {
                selectors: {
                    body: '[role="textbox"][aria-label="Message body"]',
                    subject: 'input[aria-label="Add a subject"]'
                },
                eventTypes: {
                    contentChange: 'input',
                    subjectChange: 'change'
                }
            },
            'yahoo': {
                selectors: {
                    body: '.compose-editor [contenteditable="true"]',
                    subject: 'input[placeholder="Subject"]'
                },
                eventTypes: {
                    contentChange: 'input',
                    subjectChange: 'change'
                }
            }
        };
    }

    detectClient() {
        const url = window.location.href;
        if (url.includes('groups.google.com')) return 'google-groups';
        if (url.includes('mail.google.com')) return 'gmail';
        if (url.includes('outlook')) return 'outlook';
        if (url.includes('mail.yahoo.com')) return 'yahoo';
        return null;
    }

    getEditorElements() {
        const clientType = this.detectClient();
        if (!clientType) return null;

        const config = this.clientConfigs[clientType];
        return {
            body: document.querySelector(config.selectors.body),
            subject: document.querySelector(config.selectors.subject),
            eventTypes: config.eventTypes
        };
    }

    injectContent(element, content, eventType) {
        if (!element) return false;
        element.innerHTML = content;
        element.dispatchEvent(new Event(eventType, { bubbles: true }));
        return true;
    }
}

// Create global instance
window.emailClientAdapter = new EmailClientAdapter();