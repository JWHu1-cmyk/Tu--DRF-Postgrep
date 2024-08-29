import React, { Component } from "react";
import Modal from "./components/Modal.jsx";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Remove the quotes around the URL
axios.defaults.baseURL = API_URL;

// Add this line here
 
axios.defaults.headers.post['Content-Type'] = 'application/json'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],  // Initialize as an empty array
      viewCompleted: false,
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get('/api/todos/')
      .then((res) => {
        if (Array.isArray(res.data)) {
          this.setState({ todoList: res.data });
        } else {
          console.error('API did not return an array:', res.data);
          this.setState({ todoList: [] });
        }
      })
      .catch((err) => {
        console.error('Error fetching todos:', err);
        this.setState({ todoList: [] });
      });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    // Validate the item before submitting
    if (!item.title.trim() || !item.description.trim()) {
      alert("Title and description cannot be empty!");
      return;
    }

    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList())
        .catch((error) => {
          console.error("Error updating item:", error.response.data);
        });
      return;
    }
    axios
      .post('/api/todos/', item)
      .then((res) => this.refreshList())
      .catch((error) => {
        console.error("Error creating item:", error.response.data);
        // Optionally, you can show an error message to the user here
        alert("Failed to create item. Please try again.");
      });
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Complete
        </span>
        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed == viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;