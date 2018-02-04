import React from "react";

export class CheckBoxes extends React.Component {
  renderChoice() {
    return this.props.choices.map(x => {
      return (<p>
        <input type="checkbox" id={x.id} ref={e => x.name}
               name={x.id}
               onChange={e => {
                 this.props.onInput({id: e.currentTarget.name, checked: e.currentTarget.checked});
               }}
        />
        <label htmlFor={x.id}>{x.name}</label>
      </p>);
    });
  }
  render() {
    return (<form action="#">
      {this.renderChoice()}
    </form>);
  }
}
export class InputForm extends React.Component {
  render() {
    return (<form className="col s12">
      <div className={"row"}>
        <div className="input-field col s12">
          <input placeholder={this.props.placeholder}
                 type="text"
                 value={this.props.value}
                 onInput={e => {this.props.onInput(e.currentTarget.value)}}
          />
        </div>
      </div>
    </form>);
  }
}

export class DatePicker extends React.Component {
  render() {
    return (<form className="col s12">
      <div className={"row"}>
        <div className="input-field col s12">
          <input className={"datepicker"}
                 placeholder={this.props.placeholder}
                 type={"datetime-local"}
                 value={this.props.value}
                 onInput={e => {this.props.onInput(e.currentTarget.value)}}
          />
        </div>
      </div>
    </form>);
  }
}

export class SearchLocForm extends React.Component {
  render() {
    return (<form className="col s12">
      <div className={"row"}>
        <div className="input-field col s12">
          <input placeholder={this.props.placeholder}
                 type="text"
                 value={this.props.value}
                 onInput={e => {this.props.onInput(e.currentTarget.value)}}
          />
        </div>
      </div>
    </form>);
  }
}