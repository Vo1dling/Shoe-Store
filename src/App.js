import React from "react";
import api from "./components/api/api";
import Spinner from "./components/Spinner/Spinner.components";
import ItemView from "./components/ItemView/ItemView.components";
import CustomInput from "./components/CustomInput/CustomInput.components";
import CustomButton from "./components/CustomButton/CustomButton.components";
import Popup from "./components/Popup/Popup.components";
import "./App.css";

class App extends React.Component {
  spinnerRef = React.createRef();
  createMenuRef = React.createRef();
  editMenuRef = React.createRef();
  nameInput = React.createRef();
  sizeInput = React.createRef();
  priceInput = React.createRef();
  state = { loading: false, data: [], currentItem: {} };
  showHideSpinner = () => {
    if (this.state.loading) this.spinnerRef.current.classList.remove("hidden");
    else if (!this.state.loading)
      this.spinnerRef.current.classList.add("hidden");
  };
  setupEdit = (e) => {
    const [nameInput, sizeInput, priceInput, menuRef] = [
      this.nameInput.current,
      this.sizeInput.current,
      this.priceInput.current,
      this.createMenuRef.current,
    ];
    let editItem = this.state.data.find((item) => item.id === e.target.id);
    this.state.data.forEach((item) => {
      if (Object.values(item).includes(e.target.id)) editItem = item;
    });
    this.setState({ currentItem: editItem });
    nameInput.value = editItem.name;
    sizeInput.value = editItem.size;
    priceInput.value = editItem.price;
    menuRef.classList.remove("hidden");
  };
  showHideMenu = async (e) => {
    console.log(e);
    if (!this.state.loading) {
      const [nameInput, sizeInput, priceInput, menuRef] = [
        this.nameInput.current,
        this.sizeInput.current,
        this.priceInput.current,
        this.createMenuRef.current,
      ];
      if (
        nameInput.value !== "" &&
        sizeInput.value !== "" &&
        priceInput.value !== "" &&
        !menuRef.classList.contains("hidden") &&
        !e.target.classList.contains("cancel")
      ) {
        this.setState({ loading: true }, async () => {
          this.showHideSpinner();
          menuRef.classList.add("hidden");
          if (this.state.currentItem === {}) await this.postItem();
          else await this.postItem(this.state.currentItem.id);
          this.getData();
        });
      } else if (e.target.classList.contains("cancel")) {
        menuRef.classList.add("hidden");
      } else if (!menuRef.classList.contains("hidden")) {
        [(nameInput, sizeInput, priceInput)].forEach((input) => {
          if (input.value === "") {
            input.classList.add("empty-input");
            setTimeout(() => {
              input.classList.remove("empty-input");
            }, 1500);
          }
        });
      } else {
        menuRef.classList.remove("hidden");
      }
    }
  };
  getData = async () => {
    this.setState({ loading: true }, this.showHideSpinner);
    const res = await api.get();
    this.setState({ loading: false, data: res.data }, this.showHideSpinner);
  };
  postItem = async (id) => {
    const [nameInput, sizeInput, priceInput] = [
      this.nameInput.current,
      this.sizeInput.current,
      this.priceInput.current,
    ];
    if (id)
      await api.put(id, {
        name: nameInput.value,
        size: sizeInput.value,
        price: priceInput.value,
      });
    else
      await api.post("", {
        name: nameInput.value,
        size: sizeInput.value,
        price: priceInput.value,
      });

    nameInput.value = "";
    sizeInput.value = "";
    priceInput.value = "";
  };
  deleteItem = async (e) => {
    this.setState({ loading: true }, this.showHideSpinner);
    await api.delete(e.target.id);
    this.getData();
  };
  componentDidMount() {
    this.getData();
  }
  render() {
    const isEdit = this.state.currentItem.name === undefined;
    return (
      <div>
        <div className="flex-container">
          <CustomButton
            text="Add Product"
            onClick={this.showHideMenu}
            className="add"
          >
            <i className="fas fa-plus"></i>
          </CustomButton>
        </div>
        <div className="list-container">
          {this.state.data.map((item) => {
            return (
              <ItemView
                item={item}
                key={item.id}
                deleteItem={this.deleteItem}
                editItem={this.setupEdit}
              />
            );
          })}
        </div>
        <Spinner spinnerRef={this.spinnerRef} />
        <Popup menuRef={this.createMenuRef}>
          <CustomButton className="cancel" onClick={this.showHideMenu}>
            <i className="fas fa-times"></i>
          </CustomButton>
          <h3>{isEdit ? "Add Product" : "Edit Product"} </h3>
          <CustomInput
            type="text"
            placeHolder="Type in the name of the shoe"
            ref={this.nameInput}
          />
          <CustomInput
            type="number"
            placeHolder="Type in the size of the shoe"
            ref={this.sizeInput}
          />
          <CustomInput
            type="text"
            placeHolder="Place price of shoe Here"
            ref={this.priceInput}
          />
          <CustomButton text="Add" onClick={this.showHideMenu}>
            <i className="fas fa-plus"></i>
          </CustomButton>
        </Popup>
      </div>
    );
  }
}
export default App;
