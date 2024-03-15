import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditMemberPage = () => {
  const location = useLocation();
  const selectedMember = location.state;
  const navigate = useNavigate();
  const [name, setName] = useState(selectedMember.username);
  const [phone, setPhone] = useState(selectedMember.phone);
  const [debt, setDebt] = useState(selectedMember.debt);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/members/${selectedMember.username}`)
      .then((response) => {
        alert("Member deleted successfully");
        navigate("/members");
      })
      .catch((error) => {
        alert("Error deleting member:", error);
      });
  };

  const onSubmit = () => {
    axios
      .put(`http://localhost:5000/members/${selectedMember.username}`, {
        username: name,
        phone: phone,
        debt: debt,
      })
      .then((response) => {
        alert("Member updated successfully");
        navigate("/members");
      })
      .catch((error) => {
        alert("Error updating member:", error);
      });
  };

  return (
    <>
      <p className="text-xl font-medium">Edit Member</p>
      <div className="flex flex-row gap-6 justify-center items-center my-9">
        <TextField
          label="User Name"
          type="string"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Phone"
          type="string"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="Debt"
          type="string"
          value={debt}
          onChange={(e) => setDebt(e.target.value)}
        />
      </div>
      <div className="flex justify-center item-center">
        <Button color="secondary" className="w-[20vw]" onClick={onSubmit}>
          Update
        </Button>
      </div>
      <div className="flex flex-row gap-6 justify-end items-center my-24">
        <p className="text-xl font-medium">Delete Member</p>
        <Button color="error" variant="outlined" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </>
  );
};

export default EditMemberPage;
