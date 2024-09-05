import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };
    // 1. ...this.state.activeItem: This spreads all the existing properties of this.state.activeItem into the new object. It's a way to create a shallow copy of the original object.
    // 2. [name]: value: This is using computed property names. The name variable (which comes from e.target.name) is used as the key, and value is set as its value.
    // e is the event object passed by the browser. It has several properties and methods, but in this case, we're particularly interested in e.target, which refers to the DOM element that triggered the event (in this case, the input field that changed).

    this.setState({ activeItem });
    // setState expect an object, thus {} wrapper;

  // The { activeItem } syntax is using object shorthand notation in JavaScript. It's equivalent to writing:
  // this.setState({ activeItem: activeItem })
  // This syntax tells React "update the activeItem property of the state with this new activeItem object".
  // If you have multiple state properties, you could update them like this:
    // this.setState({
    //   activeItem: newActiveItem,
    //   someOtherProperty: newValue
    // })
  // Without the {} wrapper, you'd be trying to pass the activeItem object directly to setState(), which is not what setState() expects. 

  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Title</Label>
              <Input
                type="text"
                id="todo-title"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Todo Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Description</Label>
              <Input
                type="text"
                id="todo-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Todo description"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}