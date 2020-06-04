import { isBlank } from "@ember/utils";
import Ember from "ember";
import PowerSelectComponent from "ember-power-select/components/power-select";

/* istanbul ignore next */
const PowerSelectCustomComponent = PowerSelectComponent.extend({
  init(...args) {
    this._super(...args);

    this.set("extra", this.getWithDefault("extra", {}));
    this.set("extra.testing", Ember.testing);
  },

  _handleKeyTab(...args) {
    this._handleKeyEnter(...args);
  },

  _focusComesFromOutside(e) {
    const blurredEl = e.relatedTarget;

    if (isBlank(blurredEl) || Ember.testing) {
      return false;
    }

    return !blurredEl.classList.contains("ember-power-select-search-input");
  },

  actions: {
    handleTriggerFocus(event) {
      this._super(event);

      if (this._focusComesFromOutside(event)) {
        this.publicAPI.actions.open(event);
      }
    },

    handleBlur(event) {
      this._super(event);

      if (this._focusComesFromOutside(event)) {
        this.publicAPI.actions.close(event);
      }
    },

    scrollTo() {
      const options = document.querySelector(
        `#ember-power-select-options-${this.publicAPI.uniqueId}`
      );

      const current = options.querySelector("[aria-current=true]");

      if (!current) {
        return;
      }

      const currentScrollY = options.scrollTop;
      const top = current.offsetTop;
      const bottomOfOption = top + current.offsetHeight;

      if (bottomOfOption > currentScrollY + options.offsetHeight) {
        options.scrollTop = bottomOfOption - options.offsetHeight;
      } else if (top < currentScrollY) {
        options.scrollTop = top;
      }
    }
  }
});

export default PowerSelectCustomComponent;
