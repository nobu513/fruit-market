import React, { useEffect, useState } from "react";
import {
  Modal,
  Alert,
  Container,
  Form,
  Button,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";

export default function Fruits() {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch_data();
  }, []);

  const fetch_data = () => {
    setLoading(true);
    setTimeout(() => {
      fetch("http://localhost:5000/fruits")
        .then((res) => res.json())
        .then((res) => {
          setFruits(res);
        })
        .then(() => {
          setLoading(false);
        });
    }, 700);
  };
  const [newName, setNewName] = useState();
  const [newPrice, setNewPrice] = useState();

  const create_item = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("http://localhost:5000/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, price: newPrice }),
    })
      .then(() => {
        setLoading(false);
      })
      .then(() => fetch_data());
  };

  const delete_item = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => setLoading(false))
      .then(() => fetch_data());
  };

  const name_handler = (e) => {
    setNewName(e.target.value);
  };
  const price_handler = (e) => {
    setNewPrice(e.target.value);
  };

  const [updateName, setUpdateName] = useState();
  const [updatePrice, setUpdatePrice] = useState();
  const [updateId, setUpdateId] = useState();
  const [editing, setEditing] = useState(false);

  const update_item = (id) => {
    setLoading(true);
    handleClose();
    fetch(`http://localhost:5000/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updateName,
        price: updatePrice,
      }),
    })
      .then(() => setLoading(false))
      .then(() => fetch_data());
  };
  const handleClose = () => setEditing(false);

  const update_name_handler = (e) => {
    setUpdateName(e.target.value);
  };
  const update_price_handler = (e) => {
    setUpdatePrice(e.target.value);
  };

  const modal_handler = (fruit) => {
    setEditing(true);
    setUpdateName(fruit.name);
    setUpdatePrice(fruit.price);
    setUpdateId(fruit.id);
  };
  return (
    <Container className="mt-4">
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Control onChange={name_handler} placeholder="Enter Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control onChange={price_handler} placeholder="Enter price" />
        </Form.Group>
        <Button variant="primary" onClick={create_item}>
          Submit
        </Button>
      </Form>
      <Modal show={editing} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit fruit data.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            onChange={update_name_handler}
            defaultValue={updateName}
          ></Form.Control>
          <Form.Control
            onChange={update_price_handler}
            defaultValue={updatePrice}
          ></Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => update_item(updateId)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {!loading ? (
        <>
          {fruits.map((fruit) => (
            <Alert key={fruit.id} variant="info">
              <Row>
                <Col xs={8}>
                  {fruit.name} ({fruit.price}yen){" "}
                </Col>
                <Col xs={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() => delete_item(fruit.id)}
                  >
                    delete
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="outline-info"
                    onClick={() => modal_handler(fruit)}
                  >
                    edit
                  </Button>
                </Col>
              </Row>
            </Alert>
          ))}
        </>
      ) : (
        <Spinner variant="danger" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </Container>
  );
}
