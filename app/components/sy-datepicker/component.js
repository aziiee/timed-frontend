import Component from "@ember/component";
import { action } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { tracked } from "@glimmer/tracking";
import moment from "moment";

const DISPLAY_FORMAT = "DD.MM.YYYY";
const PARSE_FORMAT = "D.M.YYYY";
const parse = value => (value ? moment(value, PARSE_FORMAT) : null);

export default class SyDatepickerComponent extends Component {
  @tracked value = null;
  name = "date";
  placeholder = DISPLAY_FORMAT;

  get displayValue() {
    return this.value && this.value.isValid()
      ? this.value.format(DISPLAY_FORMAT)
      : null;
  }

  setValidity() {
    const target = this.element.querySelector(
      ".ember-basic-dropdown-trigger input"
    );
    const parsed = parse(target.value);
    if (parsed && !parsed.isValid()) {
      return target.setCustomValidity("Invalid date");
    }
    return target.setCustomValidity("");
  }

  @action
  setCenter(obj) {
    debugger
    this.set("center", obj);
  }

  @action
  handleBlur(dropdown, event) {
    const container = document.getElementById(
      `ember-basic-dropdown-content-${dropdown.uniqueId}`
    );
    if (!container || !container.contains(event.relatedTarget)) {
      dropdown.actions.close();
    }
  }

  @action
  handleFocus(dropdown) {
    dropdown.actions.open();
  }

  @action
  checkValidity() {
    scheduleOnce("afterRender", this, "setValidity");
  }

  @action
  handleChange({
    target: {
      value,
      validity: { valid }
    }
  }) {
    if (valid) {
      const parsed = parse(value);
      return this["on-change"](parsed && parsed.isValid() ? parsed : null);
    }
  }
}
