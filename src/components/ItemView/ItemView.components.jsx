import React from "react";
import CustomButton from "../CustomButton/CustomButton.components";
import "./ItemView.styles.css";
const ItemView = ({ item, deleteItem, editItem }) => {
  const { name, price, size, id } = item;
  return (
    <div style={{ border: "3px solid black" }} className="item-view">
      <img
        src="https://image.freepik.com/free-vector/sneaker-store-logo-template_327390-42.jpg"
        alt=" Thumbnail"
      />
      <h3>Brand : {name}</h3>
      <p>Size : {size}</p>
      <p>Price : {price}$</p>
      <p>ID: {id}</p>
      <div className="button-container">
        <CustomButton onClick={editItem} id={id} edit="true">
          <i className="fas fa-edit" style={{ pointerEvents: "none" }}></i>
        </CustomButton>
        <CustomButton onClick={deleteItem} id={id}>
          <i className="fas fa-trash" style={{ pointerEvents: "none" }}></i>
        </CustomButton>
      </div>
    </div>
  );
};
export default ItemView;
